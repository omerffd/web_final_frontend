import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Details.css"; // Stil dosyasını ekliyoruz

// .env dosyasından API URL'sini al
const API_URL = process.env.REACT_APP_API_URL;

const Details = () => {
  const { id } = useParams(); // URL'den inek ID'sini alır
  const [cow, setCow] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate(); // navigate kullanarak geri yönlendirme yapacağız

  React.useEffect(() => {
    // API'den inek detaylarını çekmek
    const fetchCowDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/buy-cow/${id}`);
        const data = await response.json();
        setCow(data);
        setLoading(false);
      } catch (error) {
        console.error("Detaylar alınırken hata oluştu:", error);
        setLoading(false);
      }
    };

    fetchCowDetails();
  }, [id]);

  if (loading) {
    return <p>Detaylar yükleniyor...</p>;
  }

  if (!cow) {
    return <p>İnek detayları bulunamadı.</p>;
  }

  return (
    <div className="details-container">
      <div className="details-card">
        <h2 className="details-title">{cow.name} Detayları</h2>
        <p className="details-info">Tür: <strong>{cow.type}</strong></p>
        <p className="details-info">Yaş: <strong>{cow.age} yıl</strong></p>
        <p className="details-info">Fiyat: <strong>{cow.price} ₺</strong></p>
        <p className="details-info">Satıcı: <strong>{cow.sellerName}</strong></p>
        <button
          onClick={() => alert(`Satıcıyla iletişim: ${cow.contactNumber}`)}
          className="contact-button"
        >
          Satıcıya Ulaş
        </button>
        <button
          onClick={() => navigate("/buy-cow")}
          className="back-button"
        >
          Geri Dön
        </button>
      </div>
    </div>
  );
};

export default Details;
