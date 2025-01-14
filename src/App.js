import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Listing from "./pages/Listing";
import CreateListing from "./pages/CreateListing";
import Favorites from "./pages/Favorites";
import BuyCow from "./pages/BuyCow";
import Details from "./pages/Details"; // Yeni oluşturulan Details bileşeni
import About from "./pages/About";
import Footer from "./components/Footer";
import "./components/Footer.css"

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/listings" element={<Listing />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/buy-cow" element={<BuyCow />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
