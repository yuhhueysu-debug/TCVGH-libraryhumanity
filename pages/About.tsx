import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="serif text-4xl md:text-5xl font-bold text-stone-900 mb-6">???/h1>
        <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div> {/* Thicker divider */}
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-stone-100 space-y-10">
        <section>
          <h2 className="serif text-2xl font-bold text-stone-800 mb-4">??雿踹</h2>
          <p className="text-stone-600 leading-relaxed text-lg">
            ?摮訾犖??券銝??????怎?撠平?犖??擗?撟喳???楛靽∴??芰?????趕鞈渡移皝??銵??湧?閬澈??鈭箸折??瑯??澈?怠飛甇瑕?怎?閮???摮訾???????嚗????敹???憓釣?乩??⊥?瘚???撠??賜?????          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 py-8 border-y border-stone-100"> {/* Added top/bottom border */}
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100"> {/* Added border */}
            <h3 className="font-bold text-indigo-900 mb-2 text-lg">蝯阡?犖??/h3>
            <p className="text-indigo-800 text-base"> {/* Adjusted text color and size */}
              ????蝛粹?嚗楨閫?璆剖行??其犖?葉撠?舀?????            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100"> {/* Added border */}
            <h3 className="font-bold text-indigo-900 mb-2 text-lg">蝯血之??/h3>
            <p className="text-indigo-800 text-base"> {/* Adjusted text color and size */}
              ?圾?怎???蝣箏??扯?璆菟?嚗遣蝡?亙熒???靽??閫??            </p>
          </div>
        </div>

        <section>
          <h2 className="serif text-2xl font-bold text-stone-800 mb-4">?舐窗??/h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            憒??冽?隞颱??阮撱箄降??雿?獢???嚗迭餈???蝜怒???敺?唳??喋?          </p>
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