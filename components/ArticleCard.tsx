import React from 'react';
import { Article } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  // Determine which content to display as a brief description on the card
  const displayContent = article.category === '電影時光' && article.summary 
    ? article.summary 
    : article.content;

  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-stone-100">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-64 md:h-80 overflow-hidden bg-stone-100 relative">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay for hover effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-indigo-700 bg-indigo-50 rounded-full w-fit mb-4">
              {article.category}
            </span>
            <h3 className="serif text-2xl md:text-3xl font-bold text-stone-900 mb-4 group-hover:text-indigo-800 transition-colors">
              {article.title}
            </h3>
            <p className="text-stone-600 mb-6 leading-relaxed line-clamp-3">
              {displayContent}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
              <div className="flex items-center space-x-4 text-xs text-stone-500">
                <span className="flex items-center gap-1.5"><User size={14}/> {article.author}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14}/> {article.date}</span>
              </div>
              <Link 
                to={`/articles/${article.id}?category=${encodeURIComponent(article.category)}`} 
                className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:gap-3 hover:text-indigo-800 transition-all"
              >
                閱讀全文 <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 h-full">
      <div className="h-52 overflow-hidden relative bg-stone-100">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay for hover effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 left-4">
           <span className="px-2.5 py-1 text-xs font-semibold text-stone-800 bg-white/90 backdrop-blur rounded-full shadow-sm">
              {article.category}
            </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="serif text-xl font-bold text-stone-900 mb-3 group-hover:text-indigo-700 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-stone-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
          {displayContent}
        </p>
        <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-auto">
          <span className="text-xs text-stone-400">{article.date}</span>
          <Link 
            to={`/articles/${article.id}?category=${encodeURIComponent(article.category)}`} 
            className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
          >
            閱讀更多
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;