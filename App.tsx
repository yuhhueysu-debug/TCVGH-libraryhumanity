import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Admin from './pages/Admin';

// ScrollToTop component to handle scroll position on route change
const ScrollToTop = () => {
  const location = useLocation(); // Use useLocation hook
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // Depend on location.pathname

  return null;
}

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-stone-50 font-sans">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
};

export default App;