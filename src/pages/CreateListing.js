import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için
import api from "../api";
import "./CreateListing.css"; // CSS dosyasını import ediyoruz

// .env dosyasından API URL'sini al
const API_URL = process.env.REACT_APP_API_URL;

const CreateListing = () => {
  const navigate = useNavigate(); // Yönlendirme için
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // Resim için state
  const [previewUrl, setPreviewUrl] = useState(null); // Resim önizleme için state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Hata mesajı için state
  const [phoneNumber, setPhoneNumber] = useState(""); // Telefon numarası için state

  // Telefon numarası validasyonu için fonksiyon
  const validatePhoneNumber = (number) => {
    // Yeni format: 05XX-XXX-XX-XX
    const phoneRegex = /^05\d{2}-\d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(number);
  };

  // Telefon numarasını formatla
  const formatPhoneNumber = (value) => {
    // Sadece rakamları al
    const numbers = value.replace(/\D/g, '');
    
    // Maksimum 11 rakam olacak şekilde kes
    const trimmed = numbers.slice(0, 11);
    
    // Formatı uygula
    let formatted = '';
    if (trimmed.length > 0) {
      formatted = trimmed.slice(0, 4);
      if (trimmed.length > 4) {
        formatted += `-${trimmed.slice(4, 7)}`;
      }
      if (trimmed.length > 7) {
        formatted += `-${trimmed.slice(7, 9)}`;
      }
      if (trimmed.length > 9) {
        formatted += `-${trimmed.slice(9, 11)}`;
      }
    }
    return formatted;
  };

  // Telefon numarası değiştiğinde çalışacak handler
  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Sadece rakamları al
    const numbersOnly = input.replace(/\D/g, '');
    // Formatlanmış değeri state'e kaydet
    setPhoneNumber(formatPhoneNumber(numbersOnly));
  };

  // Resim seçme işlemi
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        // 5MB limit
        setError("Dosya boyutu çok büyük. Lütfen 5MB'dan küçük bir dosya seçin.");
        return;
      }
      setImage(file);
      // Önizleme URL'i oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt"); // JWT'yi temizle
    alert("Başarıyla çıkış yaptınız.");
    navigate("/"); // Ana sayfaya yönlendir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    if (!title || !description || !price || !phoneNumber) {
      setError("Lütfen tüm alanları doldurun.");
      setLoading(false);
      return;
    }

    // Telefon numarası formatını kontrol et
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Lütfen geçerli bir telefon numarası girin. Örnek: 05XX XXX XX XX");
      setLoading(false);
      return;
    }

    try {
      // Resmi yükle
      let photoUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append("files", image);
  
        const imageResponse = await api.post("/upload", formData);
        if (imageResponse.data && imageResponse.data.length > 0) {
          // Backend'den dönen resim URL'sini al
          photoUrl = imageResponse.data[0].url;
        } else {
          setError("Resim yüklenemedi. Lütfen tekrar deneyin.");
          setLoading(false);
          return;
        }
      }
  
      // İlanı oluştur
      const createResponse = await api.post("/listings", {
        data: {
          title,
          description: [
            {
              type: "paragraph",
              children: [{ type: "text", text: description }],
            },
          ],
          price: parseFloat(price),
          photo_link: photoUrl, // Backend'den alınan resim URL'sini burada kullanıyoruz
          phone_number: phoneNumber, // Telefon numarasını ekle
        },
      });
  
      if (createResponse.status === 200 || createResponse.status === 201) {
        alert("İlan başarıyla oluşturuldu!");
        navigate("/listings");
      } else {
        setError(
          `İlan oluşturulurken bir hata oluştu: ${createResponse.data.message || "Bilinmeyen hata"}`
        );
      }
    } catch (error) {
      console.error("Hata detayı:", error.response?.data || error.message);
      setError(
        `İlan oluşturulurken bir hata oluştu: ${
          error.response?.data?.error?.message || "Bilinmeyen bir hata oluştu."
        }`
      );
    } finally {
      setLoading(false);
    }
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


      {/* Form */}
      <div className="form-container">
        <h1>Yeni İlan Oluştur</h1>
        <form onSubmit={handleSubmit} className="create-listing-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Başlık</label>
            <input
              type="text"
              id="title"
              placeholder="Başlık"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              placeholder="Açıklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price">Fiyat</label>
            <input
              type="number"
              id="price"
              placeholder="Fiyat"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Telefon Numarası</label>
            <input
              type="tel"
              id="phone_number"
              placeholder="05XX-XXX-XX-XX"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              required
            />
            <small className="form-text">
              Örnek format: 0555-333-33-33
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="image">Resim:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Önizleme" />
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "İlan Oluşturuluyor..." : "İlan Oluştur"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
