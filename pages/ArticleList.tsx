import React, { useState, useEffect } from 'react';
import { getArticles } from '../services/dataService';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { useSearchParams } from 'react-router-dom';

const ArticleList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Listen for custom event to refresh data when localStorage changes
    const handleArticlesUpdate = () => {
      setArticles(getArticles());
    };
    window.addEventListener('articlesUpdated', handleArticlesUpdate);

    setArticles(getArticles());

    return () => {
      window.removeEventListener('articlesUpdated', handleArticlesUpdate);
    };
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="serif text-4xl md:text-5xl font-bold text-stone-900 mb-6">
          {selectedCategory === 'All' ? '探索文章' : selectedCategory}
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
          {selectedCategory === 'All' 
            ? '從經典書籍到電影時光，深入了解醫學人文的多元面貌。' 
            : `瀏覽所有關於「${selectedCategory}」的文章與推薦。`}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat: string) => ( // <--- 在這裡明確指定 cat 的型別為 string
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300
              ${selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-stone-700 hover:bg-indigo-50 border border-stone-200'}`}
          >
            {cat === 'All' ? '全部文章' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          此分類暫無文章。
        </div>
      )}
    </div>
  );
};

export default ArticleList;