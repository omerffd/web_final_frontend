import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Favorites.css";

// .env dosyasından API URL'sini al
const API_URL = process.env.REACT_APP_API_URL;

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/favorites?populate=listing");
        const data = response.data.data;

        // Listing verisi olmayan favorileri filtrele
        const validFavorites = data.filter((fav) => fav.listing);

        // Favorileri benzersiz hale getir (listing.id'ye göre)
        const uniqueFavorites = Array.from(
          new Map(validFavorites.map((fav) => [fav.listing.id, fav])).values()
        );

        setFavorites(uniqueFavorites);
        setLoading(false);
      } catch (error) {
        console.error("Favoriler çekilirken bir hata oluştu:", error);
        alert("Favoriler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.");
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    alert("Başarıyla çıkış yaptınız.");
    navigate("/");
  };

  const handleFavorite = async (listingId, event) => {
    event.stopPropagation(); // Tıklama event'inin parent'a gitmesini engelle
    try {
      const response = await api.post(`/favorites`, {
        data: {
          listing: listingId
        }
      });

      if (response.status === 200) {
        // Favorilerden kaldır
        setFavorites(prev => prev.filter(fav => fav.listing.id !== listingId));
      }
    } catch (error) {
      console.error("Favori işlemi başarısız oldu:", error);
      alert("Favori işlemi sırasında bir hata oluştu.");
    }
  };

  const handleListingClick = (listingId) => {
    navigate(`/listings/${listingId}`); // İlan detayına yönlendir
  };

  return (
    <div>
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
        <button className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </nav>

      {/* Favoriler Listesi */}
      <div className="favorites-container">
        <h1 className="favorites-title">Favoriler</h1>

        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : favorites.length > 0 ? (
          <ul className="favorites-list">
            {favorites.map((favorite) => (
              <li 
                key={favorite.id} 
                className="favorite-item"
                onClick={() => handleListingClick(favorite.listing.id)}
              >
                <button
                  className="favorite-btn"
                  onClick={(e) => handleFavorite(favorite.listing.id, e)}
                >
                  ❤️
                </button>
                <h3>{favorite.listing?.title || "Başlık yok"}</h3>
                <p>
                  {favorite.listing?.description?.[0]?.children?.[0]?.text ||
                    "Açıklama yok"}
                </p>
                <p className="price">
                  {favorite.listing?.price || "Bilinmiyor"} ₺
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-favorites">
            Henüz favori ilanınız bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
