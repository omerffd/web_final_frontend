import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// .env dosyasından API URL'sini al
const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [filteredListings, setFilteredListings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchUserAndData = async () => {
      try {
        // Kullanıcı bilgisini al
        const userResponse = await api.get("/users/me");
        const currentUserId = userResponse.data.id;
        setUserId(currentUserId);

        // Favorileri getir
        const favoritesResponse = await api.get("/favorites?populate=listing");
        const favoriteData = favoritesResponse.data.data;

        // Favori listing ID'lerini Set olarak sakla
        const favoriteListingIds = new Set(
          favoriteData.map((fav) => fav.listing.id)
        );
        setFavorites(favoriteListingIds);

        // İlanları getir
        const listingsResponse = await api.get("/listings?populate=*");
        const allListings = listingsResponse.data.data.map((listing) => ({
          id: listing.id,
          title: listing.title,
          description:
            listing.description?.[0]?.children?.[0]?.text || "Açıklama yok",
          price: listing.price,
          photo_link: listing.photo_link,
          isFavorite: favoriteListingIds.has(listing.id),
          favoriteCount: listing.attributes?.favorites?.data?.length || 0
        }));

        setListings(allListings);
        setFilteredListings(allListings);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchUserAndData();
  }, [navigate]);

  // Toast bildirimlerini güncelle
  const toastConfig = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    className: 'custom-toast'
  };

  // Başarılı toast bildirimi
  const showSuccessToast = (message) => {
    toast.success(message, toastConfig);
  };

  // Hata toast bildirimi
  const showErrorToast = (message) => {
    toast.error(message, toastConfig);
  };

  // LogOut İşlevi
  const handleLogout = () => {
    localStorage.removeItem("jwt"); // JWT'yi temizle
    showSuccessToast('Çıkış yapıldı');
    navigate("/"); // Giriş sayfasına yönlendir
  };

  // Favoriye ekleme fonksiyonu
  const addToFavorites = async (listingId) => {
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/api/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          data: {
            listing: listingId,
            users_permissions_user: userId,
          },
        }),
      });

      if (res.ok) {
        setFavorites((prev) => new Set([...prev, listingId]));
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === listingId
              ? { ...listing, isFavorite: true }
              : listing
          )
        );
        setFilteredListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === listingId
              ? { ...listing, isFavorite: true }
              : listing
          )
        );
        showSuccessToast('Favorilere eklendi');
      } else {
        const errorData = await res.json();
        console.error("Favori ekleme hatası:", errorData);
        showErrorToast('İşlem başarısız oldu');
      }
    } catch (error) {
      console.error("Favorilere eklenirken hata oluştu:", error);
      showErrorToast('İşlem başarısız oldu');
    }
  };

  // Favoriden çıkarma fonksiyonu
  const removeFromFavorites = async (listingId) => {
    try {
      // Favori kaydını bulmak için API çağrısı
      const favoritesResponse = await api.get("/favorites", {
        params: {
          'filters[listing][id][$eq]': listingId,
          'filters[users_permissions_user][id][$eq]': userId,
          'populate': '*'
        },
      });
  
      if (favoritesResponse.data.data.length > 0) {
        // Favorinin `documentId` değerini alın
        const documentId = favoritesResponse.data.data[0].documentId;
  
        if (!documentId) {
          throw new Error("Document ID bulunamadı!");
        }
  
        // Silme isteği gönder
        const deleteResponse = await fetch(`${API_URL}/api/favorites/${documentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (deleteResponse.ok) {
          // Favoriyi kaldırma başarılıysa, state güncellemelerini yap
          const newFavorites = new Set([...favorites]);
          newFavorites.delete(listingId);
          setFavorites(newFavorites);
  
          const updatedListings = listings.map((listing) =>
            listing.id === listingId ? { ...listing, isFavorite: false } : listing
          );
          setListings(updatedListings);
  
          const updatedFilteredListings = filteredListings.map((listing) =>
            listing.id === listingId ? { ...listing, isFavorite: false } : listing
          );
          setFilteredListings(updatedFilteredListings);
  
          showSuccessToast('Favorilerden kaldırıldı');
        } else {
          throw new Error(`Silme işlemi başarısız oldu. Hata kodu: ${deleteResponse.status}`);
        }
      } else {
        showErrorToast('Favori bulunamadı!');
      }
    } catch (error) {
      console.error("Favorilerden kaldırılırken hata oluştu:", error);
      showErrorToast('İşlem başarısız oldu');
    }
  };
  

  // Filtreleme işlemi
  useEffect(() => {
    let filteredResults = [...listings];
    
    switch(filter) {
      case "latest":
        filteredResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "mostLiked":
        // Favorilere göre sıralama
        filteredResults.sort((a, b) => {
          const aFavorites = favorites.has(a.id) ? 1 : 0;
          const bFavorites = favorites.has(b.id) ? 1 : 0;
          return bFavorites - aFavorites;
        });
        break;
      case "priceAsc":
        filteredResults.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        filteredResults.sort((a, b) => b.price - a.price);
        break;
      case "all":
      default:
        break;
    }
    
    setFilteredListings(filteredResults);
  }, [filter, listings, favorites]);

  const handleFavorite = async (listingId) => {
    try {
      const res = await fetch(`/api/user/favorite/${listingId}`, {
        method: 'POST',
      });
      const data = await res.json();
      
      // State'i güncelleyelim
      setListings(prevListings => 
        prevListings.map(listing => 
          listing.id === listingId 
            ? { ...listing, isFavorite: !listing.isFavorite }
            : listing
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ToastContainer />
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand-container">
          <div className="logo-container">
            <img
              src={`${API_URL}/uploads/pngwing_com_d3c195022c.png`} // Strapi URL
              alt="Logo"
              className="brand-logo"
            />
          </div>
          <span className="brand-title">INEKINDEN</span>
        </div>
        <button className="nav-button" onClick={() => navigate("/home")}>
          Ana Sayfa
        </button>
        <button className="nav-button" onClick={() => navigate("/listings")}>
          İlanlar
        </button>
        <button className="nav-button" onClick={() => navigate("/create-listing")}>
          İlan Ver
        </button>
        <button className="nav-button" onClick={() => navigate("/favorites")}>
          Favoriler
        </button>
        <button className="nav-button" onClick={() => navigate("/buy-cow")}>
          İnek Satın Al
        </button>
        <button className="nav-button" onClick={() => navigate("/about")}>
          Hakkımda
        </button>
        {/* LogOut Düğmesi */}
        <button className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </nav>

      <div className="home-container">
        <h1 className="home-title">İlanlar</h1>

        {/* Güncellenen Filtreleme Dropdown */}
        <div className="filter-container">
          <label htmlFor="filter">Filtrele:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tüm İlanlar</option>
            <option value="latest">En Son İlanlar</option>
            <option value="mostLiked">En Çok Beğenilenler</option>
            <option value="priceAsc">Düşük Fiyat</option>
            <option value="priceDesc">Yüksek Fiyat</option>
          </select>
        </div>

        {/*İlanlar */}
        <ul className="listing-grid">
          {filteredListings.map((listing) => (
            <li key={listing.id} className="listing-item">
              <div className="favorite-container">
                <img
                  src={listing.photo_link
                    ? `${process.env.REACT_APP_API_URL}${listing.photo_link}`
                    : `${process.env.REACT_APP_API_URL}/uploads/images_1e23c7d9a8.jpg`}
                  alt={listing.title || "Resim"}
                  className="listing-image"
                />
                <h2>{listing.title || "Başlık yok"}</h2>
                <p>{listing.description || "Açıklama yok"}</p>
                <p>Fiyat: {listing.price || "Belirtilmemiş"} ₺</p>
                <button
                  className={`favorite-btn ${listing.isFavorite ? "favorited" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (listing.isFavorite) {
                      removeFromFavorites(listing.id);
                    } else {
                      addToFavorites(listing.id);
                    }
                  }}
                >
                  {listing.isFavorite ? "❤️" : "🤍"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
