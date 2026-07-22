import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-layout">
            <div className="cyber-grid-overlay"></div>
            <Navbar />
            <main className="app-main-content">
              <Routes></Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
