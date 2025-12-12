import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="serif text-4xl md:text-5xl font-bold text-stone-900 mb-6">關於我們</h1>
        <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div> {/* Thicker divider */}
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-stone-100 space-y-10">
        <section>
          <h2 className="serif text-2xl font-bold text-stone-800 mb-4">我們的使命</h2>
          <p className="text-stone-600 leading-relaxed text-lg">
            「醫學人文都在這」是一個致力於連結醫療專業與人文素養的平台。我們深信，優秀的醫療不僅仰賴精湛的技術，更需要溫暖的人性關懷。透過分享醫學歷史、倫理討論、文學作品與藝術療癒，我們希望為忙碌的醫療環境注入一股清流，喚醒對生命的初心。
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 py-8 border-y border-stone-100"> {/* Added top/bottom border */}
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100"> {/* Added border */}
            <h3 className="font-bold text-indigo-900 mb-2 text-lg">給醫療人員</h3>
            <p className="text-indigo-800 text-base"> {/* Adjusted text color and size */}
              提供反思的空間，緩解職業倦怠，在人文中尋找支持的力量。
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100"> {/* Added border */}
            <h3 className="font-bold text-indigo-900 mb-2 text-lg">給大眾</h3>
            <p className="text-indigo-800 text-base"> {/* Adjusted text color and size */}
              理解醫療的不確定性與極限，建立更健康的醫病關係與生命觀。
            </p>
          </div>
        </div>

        <section>
          <h2 className="serif text-2xl font-bold text-stone-800 mb-4">聯絡我們</h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            如果您有任何投稿建議、合作提案或回饋，歡迎隨時與我們聯繫。我們期待聽到您的聲音。
          </p>
          <a 
            href="mailto:contact@medicalhumanities.tw" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            contact@medicalhumanities.tw
          </a>
        </section>
      </div>
    </div>
  );
};

export default About;