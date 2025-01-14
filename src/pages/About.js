import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

// .env dosyasından API URL'sini al
const API_URL = process.env.REACT_APP_API_URL;


const About = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt"); // JWT'yi temizle
    alert("Başarıyla çıkış yaptınız.");
    navigate("/"); // Ana sayfaya yönlendir
  };  


  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand-container">
          <div className="logo-container">
            <img
              src={`${API_URL}/uploads/pngwing_com_d3c195022c.png`} /* Strapi URL */
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

      {/* Hakkımda İçeriği */}
      <div className="about-container">
        <h1>Hakkımda</h1>
        <p>
          Merhaba! Ben <strong>Ömer Faruk Doğan</strong>, yazılım dünyasında yenilikçi çözümler üretmeyi seven bir geliştiriciyim.
        </p>
        
        <div className="skills-section">
          <p>
            <strong>INEKINDEN</strong> platformu, inek alım-satım işlemlerini kolaylaştırmak ve modernleştirmek amacıyla geliştirilmiştir. 
            Kullanıcılarımız platformumuzda:
          </p>
          <p>
            <span>✦ İlan verebilir</span><br/>
            <span>✦ İlanları detaylıca inceleyebilir</span><br/>
            <span>✦ Favori ilanlarını kaydedebilir</span><br/>
            <span>✦ Güvenli alım-satım yapabilir</span>
          </p>
        </div>

        <p>
          <strong>Uzmanlık Alanlarım:</strong><br/>
          React.js | Node.js | MongoDB | RESTful APIs | Modern Web Teknolojileri
        </p>
        
        <p>
          <strong>Hedeflerim:</strong><br/>
          Açık kaynak projelere katkıda bulunmak ve teknoloji topluluklarında aktif rol alarak 
          sektörün gelişimine katkı sağlamak.
        </p>

        <div className="contact-section">
          <p>
            Daha fazla bilgi ve iş birliği için benimle iletişime geçebilirsiniz:<br/>
            <a href="mailto:omerfdogan.tr@gmail.com">omerfdogan.tr@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
