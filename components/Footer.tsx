import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          <div>
            <h3 className="serif text-stone-100 text-xl font-bold mb-4">醫學人文都在這</h3>
            <p className="text-sm leading-relaxed text-stone-300">
              致力於推廣醫學與人文的對話，探索醫療背後的生命故事與倫理價值。
            </p>
          </div>
          <div>
            <h4 className="text-stone-100 font-medium mb-4">快速連結</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">關於我們</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">聯絡方式</a></li>
              <li><a href="#" className="hover:text-white transition-colors">隱私權政策</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-stone-100 font-medium mb-4">訂閱電子報</h4>
            <p className="text-sm text-stone-300 mb-3">獲取最新的文章與活動資訊</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="您的 Email" 
                className="bg-stone-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-stone-500 text-white"
              />
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                訂閱
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600 gap-4">
          <p>&copy; {new Date().getFullYear()} Medical Humanities Hub. All rights reserved.</p>
          <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 rounded-md hover:bg-stone-700 text-stone-500 hover:text-stone-300 transition-colors" title="管理員入口">
             <Lock size={14} /> 管理員入口
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;