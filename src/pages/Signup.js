import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için
import api from "../api";
import "./Signup.css"; // CSS dosyasını import ediyoruz

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showLoginButton, setShowLoginButton] = useState(false); // Giriş Yap butonunu kontrol eden state
  const navigate = useNavigate(); // Giriş yap ekranına yönlendirme için

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/users", {
      username,
      email,
      password,
      role: "2", // Rol ID'sini Strapi'de doğru ayarladığınızdan emin olun
    })
      .then((response) => {
        console.log("Kullanıcı başarıyla oluşturuldu:", response.data);
        setMessage("Kayıt başarılı! Giriş yapmak için aşağıdaki butona tıklayın.");
        setShowLoginButton(true); // Giriş Yap butonunu göster
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.error("Kullanıcı oluşturma hatası:", error.response?.data || error);
        setMessage("Kayıt sırasında bir hata oluştu.");
      });
  };

  const redirectToLogin = () => {
    navigate("/"); // Giriş yap ekranına yönlendir
  };

  return (
    <div className="signup-container">
      <h1>Kayıt Ol</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Adınız"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-btn">Kayıt Ol</button>
      </form>
      {message && <p className="message">{message}</p>}
      {showLoginButton && (
        <button onClick={redirectToLogin} className="redirect-login-btn">
          Giriş Yap
        </button>
      )}
    </div>
  );
};

export default Signup;
