import React from "react";

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="serif text-4xl md:text-5xl font-bold text-stone-900 mb-6">
          {"\u95DC\u65BC\u6211\u5011"}
        </h1>
        <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-stone-100 space-y-10">
        <p className="text-stone-700 leading-relaxed text-lg">
          {
            "\u300C\u91AB\u5B78\u4EBA\u6587\u7DB2\u7AD9\u300D\u5E0C\u671B\u5728\u8B80\u66F8\u3001\u5F71\u50CF\u3001\u66F8\u5BEB\u8207\u5206\u4EAB\u4E4B\u9593\uFF0C\u8B93\u6211\u5011\u770B\u898B\u91AB\u7642\u4E0D\u53EA\u662F\u6280\u8853\uFF0C\u4E5F\u662F\u7406\u89E3\u3001\u95DC\u61F7\u8207\u76F8\u4F34\u3002"
          }
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2 text-lg">
              {"\u6211\u5011\u7684\u9858\u666F"}
            </h3>
            <p className="text-indigo-800 text-base leading-relaxed">
              {
                "\u7528\u66F8\u8207\u5F71\u50CF\u3001\u4EBA\u751F\u6545\u4E8B\u8207\u65E5\u5E38\u7D00\u9304\uFF0C\u5F15\u5C0E\u66F4\u6E29\u67D4\u7684\u7F3A\u53E3\u548C\u66F4\u6DF1\u7684\u7406\u89E3\u3002"
              }
            </p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2 text-lg">
              {"\u6211\u5011\u7684\u65B9\u6CD5"}
            </h3>
            <p className="text-indigo-800 text-base leading-relaxed">
              {
                "\u900F\u904E\u7CBE\u9078\u66F8\u7C4D\u3001\u96FB\u5F71\u8207\u5176\u4ED6\u7D20\u6750\uFF0C\u7D50\u5408\u95B1\u8B80\u5FC3\u5F97\u8207\u63A8\u85A6\u7B46\u8A18\uFF0C\u5E6B\u52A9\u4F60\u627E\u5230\u5C6C\u65BC\u81EA\u5DF1\u7684\u76EE\u5149\u3002"
              }
            </p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2 text-lg">
              {"\u6211\u5011\u7684\u9080\u8ACB"}
            </h3>
            <p className="text-indigo-800 text-base leading-relaxed">
              {
                "\u6B61\u8FCE\u4F60\u6295\u7A3F\u3001\u63A8\u85A6\u3001\u6216\u5206\u4EAB\u4F60\u7684\u95B1\u8B80\u8207\u89C0\u5F71\u611F\u53D7\uFF0C\u8B93\u9019\u500B\u7A7A\u9593\u66F4\u8CBC\u8FD1\u751F\u547D\u7684\u73FE\u5834\u3002"
              }
            </p>
          </div>
        </div>

        <section className="pt-4">
          <h2 className="serif text-2xl font-bold text-stone-800 mb-4">
            {"\u806F\u7D61\u65B9\u5F0F"}
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            {
              "\u5982\u679C\u4F60\u6709\u4EFB\u4F55\u5EFA\u8B70\u6216\u5408\u4F5C\u60F3\u6CD5\uFF0C\u6B61\u8FCE\u8207\u6211\u5011\u806F\u7D61\u3002"
            }
          </p>
          <a
            className="inline-flex items-center gap-2 text-indigo-700 font-semibold hover:text-indigo-900 transition-colors"
            href="mailto:contact@medicalhumanities.tw"
          >
            {"contact@medicalhumanities.tw"}
          </a>
        </section>
      </div>
    </div>
  );
};

export default About;
