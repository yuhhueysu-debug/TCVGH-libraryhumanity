import React, { useState } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Helper to check if a link is active considering query params
  const isLinkActive = (path: string) => {
    const currentPath = location.pathname + location.search;
    // Exact match for paths with query params
    if (path.includes('?')) {
      return decodeURIComponent(currentPath) === path;
    }
    // For root or simple paths, exact match on pathname (ignoring query if path has none, 
    // but usually we want strict for Home)
    return location.pathname === path && (path === '/' ? location.search === '' : true);
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-indigo-600 p-2.5 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
              <BookOpen size={28} />
            </div>
            <div className="flex flex-col">
              <span className="serif font-bold text-xl sm:text-2xl text-stone-900 leading-tight">醫學人文</span>
              <span className="text-xs sm:text-sm text-stone-500 font-medium tracking-wider">都在這</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-base font-medium transition-colors hover:text-indigo-700
                  ${isLinkActive(link.path) 
                    ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600 after:animate-in after:slide-in-from-bottom-1 after:duration-300' 
                    : 'text-stone-600'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-stone-600 hover:text-stone-900 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <div 
        className={`md:hidden bg-stone-50 border-t border-stone-200 shadow-lg absolute w-full transition-all duration-300 ease-out 
          ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-4 rounded-md text-base font-medium ${
                isLinkActive(link.path)
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;