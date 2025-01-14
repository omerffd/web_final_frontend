import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için useNavigate
import api from "../api";
import "./Login.css"; // CSS dosyasını import ediyoruz


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Yönlendirme için useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/auth/local", {
      identifier: email, // API'nin istediği "identifier" alanı
      password, // Şifre
    })
      .then((response) => {
        console.log("Giriş başarılı:", response.data);

        // JWT'yi localStorage'a kaydediyoruz
        localStorage.setItem("jwt", response.data.jwt);

        setMessage("Giriş başarılı! Hoş geldiniz.");
        setEmail("");
        setPassword("");
        
        // Giriş başarılı olduğunda Home bileşenine yönlendirme
        navigate("/home");
      })
      .catch((error) => {
        console.error("Giriş hatası:", error.response?.data || error);
        setMessage("Giriş sırasında bir hata oluştu.");
      });
  };

  const handleRegister = () => {
    // Kayıt ol sayfasına yönlendirme
    navigate("/Signup");
  };

  return (
    <div className="login-container">
      <h1>Giriş Yap</h1>
      <form onSubmit={handleSubmit} className="login-form">
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
        <button type="submit" className="login-btn">Giriş Yap</button>
      </form>
      <button onClick={handleRegister} className="register-btn">Kayıt Ol</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
