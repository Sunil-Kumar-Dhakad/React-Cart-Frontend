import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { AppProvider, useUI } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/globals.css';

function AppInner() {
  const [page, setPage] = useState('home');
  const { cartOpen, checkoutOpen, openCart, closeCart, openCheckout, closeCheckout } = useUI();

  const renderPage = () => {
    switch (page) {
      case 'home':     return <HomePage     setPage={setPage} />;
      case 'products': return <ProductsPage setPage={setPage} onBuyNow={openCheckout} />;
      case 'about':    return <AboutPage    setPage={setPage} />;
      case 'contact':  return <ContactPage  />;
      case 'login':    return <LoginPage    setPage={setPage} />;
      case 'register': return <RegisterPage setPage={setPage} />;
      default:         return <HomePage     setPage={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page={page} setPage={setPage} onCartOpen={openCart} />
      <main style={{ flex: 1 }}>{renderPage()}</main>
      <Footer setPage={setPage} />
      <CartSidebar   open={cartOpen}      onClose={closeCart}    onCheckout={openCheckout} />
      <CheckoutModal open={checkoutOpen}  onClose={closeCheckout} />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </Provider>
  );
}
