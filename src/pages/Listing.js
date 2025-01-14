import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Listing.css";

// .env dosyasından API URL'sini al
const API_URL = process.env.REACT_APP_API_URL;

const Listing = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchUserAndData = async () => {
      try {
        // Kullanıcı bilgilerini al
        const userResponse = await api.get("/users/me");
        const currentUserId = userResponse.data.id;
        setUserId(currentUserId);

        // Favorileri getir
        const favoritesResponse = await api.get("/favorites?populate=listing");
        const favoriteData = favoritesResponse.data.data;

        // Favori ilan ID'lerini Set olarak sakla
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
        }));

        setListings(allListings);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchUserAndData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    alert("Başarıyla çıkış yaptınız.");
    navigate("/");
  };

  const toggleFavorite = async (listingId, isFavorite) => {
    try {
      if (isFavorite) {
        // Favoriden kaldır
        const favoritesResponse = await api.get("/favorites", {
          params: {
            "filters[listing][id][$eq]": listingId,
            "filters[users_permissions_user][id][$eq]": userId,
          },
        });

        if (favoritesResponse.data.data.length > 0) {
          const favoriteId = favoritesResponse.data.data[0].id;
          await api.delete(`/favorites/${favoriteId}`);
        }

        setFavorites((prev) => {
          const updatedFavorites = new Set(prev);
          updatedFavorites.delete(listingId);
          return updatedFavorites;
        });

        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === listingId ? { ...listing, isFavorite: false } : listing
          )
        );
        alert("Favorilerden kaldırıldı!");
      } else {
        // Favorilere ekle
        await api.post("/favorites", {
          data: {
            listing: listingId,
            users_permissions_user: userId,
          },
        });

        setFavorites((prev) => new Set([...prev, listingId]));

        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === listingId ? { ...listing, isFavorite: true } : listing
          )
        );
        alert("Favorilere eklendi!");
      }
    } catch (error) {
      console.error("Favori işlemi başarısız oldu:", error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="brand-container">
          <div className="logo-container">
            <img
              src={`${API_URL}/uploads/pngwing_com_d3c195022c.png`}
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
        <button className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </nav>

      <div className="listing-container">
      <div className="listings-header">
        <h1 className="listing-title">Tüm İnek İlanları</h1>
      </div>
        <ul className="listing-grid">
          {listings.map((listing) => (
            <li key={listing.id} className="listing-item">
              <div className="favorite-container">
                <img
                  src={
                    listing.photo_link
                     ? `${process.env.REACT_APP_API_URL}${listing.photo_link}`
                     : `${process.env.REACT_APP_API_URL}/uploads/default_image.jpg`
                  }
                  alt={listing.title || "Resim"}
                  className="listing-image"
                />
                <h2>{listing.title || "Başlık yok"}</h2>
                <p>{listing.description}</p>
                <p>Fiyat: {listing.price || "Belirtilmemiş"} ₺</p>
                <button
                  className={`favorite-btn ${
                    listing.isFavorite ? "favorited" : ""
                  }`}
                  onClick={() =>
                    toggleFavorite(listing.id, listing.isFavorite)
                  }
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

export default Listing;
