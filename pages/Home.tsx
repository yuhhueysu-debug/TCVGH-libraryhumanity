import React, { useEffect, useState } from 'react';
import { getArticles } from '../services/dataService';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Fetch articles on mount
    setArticles(getArticles());
  }, []);

  // Define the 4 categories we want to display
  const categories = [
    { title: '?擗函移?豢蝐?, slug: '?擗函移?豢蝐?, description: '?梯?蝬嚗?閬??鈭箸??漱???? },
    { title: '?餃蔣??', slug: '?餃蔣??', description: '???⊿嚗?閬??賜??脫迭?Ｗ??? },
    { title: '霈???, slug: '霈???, description: '靘?怨風鈭箏??????祕????艾? },
    { title: '撖急撖怠?', slug: '撖急撖怠?', description: '?券??渡?蝮恍?銝哨?蝝??敶梯?敹??? },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-stone-900 text-white py-12 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/1920/1080?grayscale&blur=2" 
            alt="Library background" 
            className="w-full h-full object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-stone-900/60"></div> {/* Darker overlay */}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="serif text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-top-4 duration-700">
            ?怠飛?澈摨佗?<br className="md:hidden" />鈭箸??楛摨?          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Render each category section */}
        {categories.map((category, index) => {
          // Filter articles for this category, take top 3
          const categoryArticles = articles
            .filter(article => article.category === category.slug)
            .slice(0, 3);

          // Skip if no articles found (optional, but good for empty states)
          if (categoryArticles.length === 0) return null;

          return (
            <section key={category.title} className="scroll-mt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b-2 border-indigo-200 pb-4"> {/* Enhanced border */}
                <div>
                  <h2 className="serif text-3xl md:text-4xl font-bold text-stone-900 mb-2">
                    {category.title}
                  </h2>
                  <p className="text-stone-500 text-sm md:text-base">
                    {category.description}
                  </p>
                </div>
                <Link 
                  to={`/articles?category=${encodeURIComponent(category.slug)}`} 
                  className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:gap-3 hover:text-indigo-800 transition-all px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50"
                >
                  ?亦??游? <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          );
        })}
        
        {/* Quote Section */}
        <section className="bg-indigo-50/70 backdrop-blur-sm rounded-3xl p-10 md:p-16 text-center relative overflow-hidden my-16 border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <blockquote className="serif text-2xl md:text-4xl italic text-indigo-800 leading-relaxed max-w-5xl mx-auto mb-6">
            "Wherever the art of Medicine is loved, there is also a love of Humanity."
          </blockquote>
          <cite className="text-indigo-600 font-semibold text-lg not-italic">??Hippocrates</cite>
        </section>
      </div>
    </div>
  );
};

export default Home;