import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getArticleById } from '../services/dataService';
import { Article } from '../types';
import { ArrowLeft, Home as HomeIcon, Calendar, User, Tag } from 'lucide-react';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const location = useLocation(); // Get current location to parse query params

  useEffect(() => {
    // Listen for custom event to refresh data when localStorage changes
    const handleArticlesUpdate = () => {
      if (id) {
        setArticle(getArticleById(id));
      }
    };
    window.addEventListener('articlesUpdated', handleArticlesUpdate);

    if (id) {
      setArticle(getArticleById(id));
    }

    return () => {
      window.removeEventListener('articlesUpdated', handleArticlesUpdate);
    };
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">找不到文章</h2>
        <Link to="/articles" className="text-indigo-600 hover:underline">返回列表</Link>
      </div>
    );
  }

  // Determine the back-to-list path
  const queryParams = new URLSearchParams(location.search);
  const previousCategory = queryParams.get('category');
  const backToListPath = previousCategory 
    ? `/articles?category=${encodeURIComponent(previousCategory)}` 
    : '/articles'; // Default to all articles if category is not in URL

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase rounded-full">
            {article.category}
          </span>
        </div>
        <h1 className="serif text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-stone-500">
          <span className="flex items-center gap-2">
            <User size={16} />
            {article.author}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={16} />
            {article.date}
          </span>
        </div>
      </header>

      <div className="aspect-video w-full mb-12 rounded-xl overflow-hidden shadow-lg bg-stone-100 border border-stone-200">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover" // Changed to object-cover
        />
      </div>

      <div className="prose prose-lg prose-indigo prose-stone mx-auto">
        {article.category === '電影時光' && article.summary && (
          <div className="mb-10 p-6 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
            <h2 className="serif text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">電影簡介</h2>
            <div className="text-stone-700 leading-relaxed space-y-4">
              {article.summary.split('\n').map((paragraph, idx) => (
                <p key={`summary-p-${idx}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        <div className="text-stone-800 leading-relaxed space-y-6"> {/* Increased line-height */}
          {article.category === '電影時光' && article.content && (
            <h2 className="serif text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">觀影心得</h2>
          )}
          {/* Render content paragraphs */}
          {article.content.split('\n').map((paragraph, idx) => (
            <p key={`content-p-${idx}`}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="border-t border-stone-200 mt-16 pt-8 flex items-center justify-between">
         <div className="flex items-center gap-2 text-stone-500">
           <Tag size={16} />
           <span className="text-sm">關鍵字：{article.category}, 醫學, 人文</span>
         </div>
      </div>

      {/* New position for navigation links */}
      <div className="flex justify-between items-center mt-12 pt-4 border-t border-stone-100">
        <Link 
          to={backToListPath} 
          className="inline-flex items-center text-stone-600 hover:text-indigo-700 transition-colors group px-4 py-2 rounded-lg border border-stone-200 hover:bg-stone-50"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-0.5 transition-transform" />
          返回 {previousCategory ? previousCategory : '文章列表'}
        </Link>
        <Link 
          to="/" 
          className="inline-flex items-center text-stone-600 hover:text-indigo-700 transition-colors group px-4 py-2 rounded-lg border border-stone-200 hover:bg-stone-50"
        >
          返回首頁 <HomeIcon size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default ArticleDetail;