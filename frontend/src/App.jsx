import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './components/ToastContainer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import SpecialCollection from './pages/SpecialCollection';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import LoginOTP from './pages/LoginOTP';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import ShippingInfo from './pages/ShippingInfo';
import Returns from './pages/Returns';
import TrackOrder from './pages/TrackOrder';
import SizeGuide from './pages/SizeGuide';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import OrderSuccess from './pages/OrderSuccess';
import SearchResults from './pages/SearchResults';
import RecentlyViewed from './pages/RecentlyViewed';
import ProductComparison from './pages/ProductComparison';
import CookieConsent from './components/CookieConsent';
import ErrorBoundary from './components/ErrorBoundary';
import BackToTop from './components/BackToTop';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<CategoryPage />} />
          <Route path="/women" element={<CategoryPage />} />
          <Route path="/watches" element={<CategoryPage />} />
          <Route path="/lenses" element={<CategoryPage />} />
          <Route path="/accessories" element={<CategoryPage />} />
          <Route path="/men/:category" element={<CategoryPage />} />
          <Route path="/women/:category" element={<CategoryPage />} />
          <Route path="/new-arrival" element={<SpecialCollection type="new-arrival" />} />
          <Route path="/sale" element={<SpecialCollection type="sale" />} />
          <Route path="/product/:category/:id" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-otp" element={<LoginOTP />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/recently-viewed" element={<RecentlyViewed />} />
          <Route path="/compare" element={<ProductComparison />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CookieConsent />}
      {!isAdminRoute && <BackToTop />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <CartProvider>
          <WishlistProvider>
            <ToastProvider>
        <Router>
          <AppContent />
        </Router>
            </ToastProvider>
          </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
