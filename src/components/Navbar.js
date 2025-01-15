import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert("Başarıyla çıkış yaptınız.");
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="brand-container">
        <div className="logo-container">
          <img
            src="http://localhost:1337/uploads/pngwing_com_d3c195022c.png"
            alt="Logo"
            className="brand-logo"
          />
        </div>
        <span className="brand-title">INEKINDEN</span>
      </div>

      <div className="nav-buttons">
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
        <button className="nav-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
