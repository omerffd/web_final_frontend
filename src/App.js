import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Toastify import
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS dosyası

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Listing from "./pages/Listing";
import CreateListing from "./pages/CreateListing";
import Favorites from "./pages/Favorites";
import BuyCow from "./pages/BuyCow";
import Details from "./pages/Details";
import About from "./pages/About";
import Footer from "./components/Footer";
import "./components/Footer.css";


function App() {

  return (
    <Router>
      <div>
        {/* ToastContainer burada, uygulamanın kök seviyesine eklenmiştir */}
        <ToastContainer />  

        {/* Uygulamanın rotaları */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/listings" element={<Listing />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/buy-cow" element={<BuyCow />} />
          <Route path="/about" element={<About />} />
          <Route path="/details" element={<Details />} />
        </Routes>

        {/* Footer bileşeni */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
