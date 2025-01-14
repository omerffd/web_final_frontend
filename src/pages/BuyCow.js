import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyCow.css";

// .env dosyasından API URL'sini al
const API_URL = process.env.REACT_APP_API_URL;

const BuyCow = () => {
  const [cows, setCows] = useState([]);
  const [filteredCows, setFilteredCows] = useState([]);
  const [filter, setFilter] = useState({ priceMin: "", priceMax: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCows = async () => {
      try {
        const response = await fetch(`${API_URL}/buy-cow`);
        const data = await response.json();
        setCows(data);
        setFilteredCows(data);
        setLoading(false);
      } catch (error) {
        console.error("İnek verileri alınırken bir hata oluştu:", error);
        setLoading(false);
      }
    };

    fetchCows();
  }, []);

  useEffect(() => {
    if (map && filteredCows.length > 0) {
      const markers = filteredCows.map((cow) => {
        if (cow.latitude && cow.longitude) {
          return new window.google.maps.Marker({
            position: { lat: cow.latitude, lng: cow.longitude },
            map: map,
            title: cow.name,
          });
        }
        return null;
      });

      return () => {
        markers.forEach((marker) => marker?.setMap(null));
      };
    }
  }, [map, filteredCows]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => {
    let filtered = [...cows];
    if (filter.priceMin) {
      filtered = filtered.filter((cow) => cow.price >= parseFloat(filter.priceMin));
    }
    if (filter.priceMax) {
      filtered = filtered.filter((cow) => cow.price <= parseFloat(filter.priceMax));
    }
    if (filter.type) {
      filtered = filtered.filter((cow) =>
        cow.type.toLowerCase().includes(filter.type.toLowerCase())
      );
    }
    setFilteredCows(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    alert("Başarıyla çıkış yaptınız.");
    navigate("/");
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
        {/* LogOut Düğmesi */}
        <button className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </nav>


      <div className="buy-cow-container">
        <h1 className="page-title">İnek Satın Al</h1>

        <div className="map-container">
          <div
            ref={(mapRef) => {
              if (mapRef && !map) {
                setMap(
                  new window.google.maps.Map(mapRef, {
                    center: { lat: 39.92077, lng: 32.85411 },
                    zoom: 12,
                  })
                );
              }
            }}
            style={{ width: "100%", height: "500px", borderRadius: "10px" }}
          />
        </div>

        <div className="filter-container">
          <h2>Filtreleme</h2>
          <div className="filter-inputs">
            <input
              type="number"
              name="priceMin"
              placeholder="Min Fiyat"
              value={filter.priceMin}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="number"
              name="priceMax"
              placeholder="Max Fiyat"
              value={filter.priceMax}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="text"
              name="type"
              placeholder="Tür (ör: Holstein)"
              value={filter.type}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <button className="filter-button" onClick={applyFilter}>
              Filtrele
            </button>
          </div>
        </div>

        <div className="cow-list-container">
          {loading ? (
            <p>Yükleniyor...</p>
          ) : filteredCows.length > 0 ? (
            <div className="cow-grid">
              {filteredCows.map((cow) => (
                <div key={cow.id} className="cow-card">
                  <h3>{cow.name}</h3>
                  <p>Tür: {cow.type}</p>
                  <p>Yaş: {cow.age} yıl</p>
                  <p>Fiyat: {cow.price} ₺</p>
                  <p className="cow-description">{cow.description}</p>
                  <button
                    className="details-button"
                    onClick={() => navigate(`/details/${cow.id}`)}
                  >
                    Detayları Gör
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Şu anda satılık inek bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyCow;
