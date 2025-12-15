import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import { getArticles, saveArticle, deleteArticle, generateId, exportData, importData } from '../services/dataService';
import { Plus, Edit, Trash2, Save, X, Search, Upload, Image as ImageIcon, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2, Download, FileJson, AlertTriangle, Code, Copy, Check, FileCode, Film, FileText, Info, LogOut, User, Key } from 'lucide-react';

// Helper function to compress image
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Reduced quality for smaller size
          resolve(dataUrl);
        } else {
          reject(new Error('Canvas context not available'));
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper to convert Google Drive viewer links to direct links
const processImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Only process Google Drive links
  if (!url.includes('drive.google.com')) return url;

  let id = '';

  // Pattern 1: .../d/ID/... (Standard view links)
  // Matches: https://drive.google.com/file/d/1abc123.../view
  const matchPath = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchPath && matchPath[1]) {
    id = matchPath[1];
  } 
  
  // Pattern 2: ...id=ID... (Open links, export links)
  // Matches: https://drive.google.com/open?id=1abc123...
  else {
    const matchQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchQuery && matchQuery[1]) {
      id = matchQuery[1];
    }
  }

  if (id) {
    // Return the direct export link which works for <img> tags
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  
  return url;
};

const Admin: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Logic State
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [currentArticle, setCurrentArticle] = useState<Article>({
    id: '',
    title: '',
    content: '',
    summary: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    category: '圖書館精選書籍',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
  });

  useEffect(() => {
    // Check authentication on mount
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    // Listen for custom event to refresh data when localStorage changes
    const handleArticlesUpdate = () => {
      refreshData();
    };
    window.addEventListener('articlesUpdated', handleArticlesUpdate);

    refreshData();

    return () => {
      window.removeEventListener('articlesUpdated', handleArticlesUpdate);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 簡單的帳密驗證 (Hardcoded credentials)
    // 您可以在這裡修改預設帳號密碼
    const ADMIN_USER = 'admin';
    const ADMIN_PASS = 'medical888';

    if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('帳號或密碼錯誤');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setLoginUser('');
    setLoginPass('');
    setIsEditing(false); // Reset editing state
  };

  const refreshData = () => {
    setArticles(getArticles());
  };

  const handleEdit = (article: Article) => {
    setCurrentArticle({ ...article, summary: article.summary || '' }); 
    setImgLoadError(false);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除這篇文章嗎？此動作無法復原。')) {
      deleteArticle(id);
      refreshData();
    }
  };

  const handleCreateNew = () => {
    setCurrentArticle({
      id: generateId(),
      title: '',
      content: '',
      summary: '', 
      author: '網站管理員',
      date: new Date().toISOString().split('T')[0],
      category: '圖書館精選書籍',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
    });
    setImgLoadError(false);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const articleToSave = currentArticle.category === '電影時光' 
      ? currentArticle
      : { ...currentArticle, summary: undefined };

    const success = saveArticle(articleToSave);
    if (success) {
      setIsEditing(false);
      refreshData();
      alert('文章已成功儲存！');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'imageUrl') {
      setImgLoadError(false);
      const processedUrl = processImageUrl(value);
      setCurrentArticle(prev => ({ ...prev, [name]: processedUrl }));
    } else {
      setCurrentArticle(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImg(true);
      setImgLoadError(false);
      try {
        const compressedDataUrl = await compressImage(file);
        setCurrentArticle(prev => ({ ...prev, imageUrl: compressedDataUrl }));
      } catch (error) {
        console.error("Image processing error", error);
        alert("圖片處理失敗，請試著換一張圖片或確認圖片格式。");
      } finally {
        setIsProcessingImg(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleBackup = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical-humanities-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('備份檔案已下載到您的電腦。');
  };

  const handleRestoreClick = () => {
    if (window.confirm('警告：還原資料將會覆蓋目前所有的文章。\n\n建議您先執行「備份資料」以防萬一。\n\n確定要繼續還原嗎？')) {
      backupInputRef.current?.click();
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonStr = event.target?.result as string;
        const success = importData(jsonStr);
        if (success) {
          refreshData();
          alert('資料還原成功！');
        } else {
          alert('資料還原失敗，請確認檔案格式是否正確。');
        }
      };
      reader.readAsText(file);
    }
    if (backupInputRef.current) backupInputRef.current.value = '';
  };

  const generateConstantsCode = () => {
    const articlesForExport = articles.map(article => {
      const { summary, ...rest } = article;
      return summary !== undefined ? article : rest;
    });

    const json = JSON.stringify(articlesForExport, null, 2);
    return `import { Article } from './types';

export const MOCK_ARTICLES: Article[] = ${json};

export const NAV_LINKS = [
  { name: '首頁', path: '/' },
  { name: '圖書館精選書籍', path: '/articles?category=圖書館精選書籍' },
  { name: '讀者推薦', path: '/articles?category=讀者推薦' },
  { name: '電影時光', path: '/articles?category=電影時光' },
  { name: '寫景寫心', path: '/articles?category=寫景寫心' },
  { name: '關於我們', path: '/about' },
];`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateConstantsCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySingleArticle = (article: Article) => {
    const articleToCopy: Article = {
      id: article.id,
      title: article.title,
      content: article.content,
      author: article.author,
      date: article.date,
      category: article.category,
      imageUrl: article.imageUrl,
    };
    if (article.summary !== undefined) {
      articleToCopy.summary = article.summary;
    }
    const json = JSON.stringify(articleToCopy, null, 2);
    navigator.clipboard.writeText(json);
    alert(`文章 "${article.title}" 的 JSON 資料已複製！\n\n請傳給 AI 並說：「請幫我更新/新增這篇文章到 constants.ts」`);
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.includes(searchTerm) ||
    (a.summary && a.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 px-4">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-stone-100 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
              <Key size={32} />
            </div>
            <h1 className="serif text-2xl font-bold text-stone-900 mb-2">後台管理登入</h1>
            <p className="text-stone-500 text-sm">醫學人文網站內容管理系統</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700 ml-1">帳號</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="請輸入管理員帳號"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700 ml-1">密碼</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Key size={18} />
                </div>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="請輸入密碼"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-2"
            >
              登入系統
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-stone-400">
            &copy; Medical Humanities Hub Admin
          </div>
        </div>
      </div>
    );
  }

  // Authenticated View (Existing UI)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-stone-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="serif text-3xl font-bold text-stone-900">內容管理後台</h1>
          <p className="text-stone-500 text-sm mt-1">
             資料儲存於本機瀏覽器。為了避免資料遺失，請定期<button onClick={handleBackup} className="text-indigo-600 underline hover:text-indigo-800 font-medium">備份資料</button>。
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-stone-500 mr-2 hidden md:inline">管理員: {loginUser}</span>
          {!isEditing && (
            <button 
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm"
            >
              <Plus size={18} /> <span className="hidden sm:inline">新增文章</span>
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white border border-stone-200 text-stone-600 px-4 py-2 rounded-lg hover:bg-stone-50 hover:text-rose-600 transition-colors shadow-sm text-sm"
            title="登出系統"
          >
            <LogOut size={18} /> <span className="hidden sm:inline">登出</span>
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      {showWarning && !isEditing && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg shadow-sm flex justify-between items-start animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-amber-900 text-sm">重要提示：資料可能會消失</h3>
              <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                因為本網站目前為靜態展示模式，您新增的文章僅暫存於<strong>瀏覽器快取 (Local Storage)</strong>。
                <br />
                當您<strong>重新整理網頁程式碼</strong>或<strong>更換瀏覽器</strong>時，資料將會重置為預設值。
                <br />
                <span className="font-bold underline decoration-amber-500/50">請點擊「產生完整程式碼」按鈕，將內容複製給 AI，以永久保存您的修改。</span>
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowWarning(false)} 
            className="text-amber-500 hover:text-amber-800 p-1 hover:bg-amber-100 rounded transition-colors"
            aria-label="關閉警告"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Backup/Restore Toolbar */}
      {!isEditing && (
        <div className="space-y-4 mb-8">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-indigo-800 text-sm font-medium">
              <Info size={18} />
              <span>資料維護與備份選項</span>
            </div>
            <div className="flex flex-wrap gap-3">
               <button 
                 onClick={handleBackup}
                 className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm hover:bg-indigo-50 transition-colors"
                 aria-label="備份資料"
               >
                 <Download size={14} /> 備份資料
               </button>
               
               <input type="file" ref={backupInputRef} onChange={handleRestoreFile} accept=".json" className="hidden" />
               <button 
                 onClick={handleRestoreClick}
                 className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm hover:bg-indigo-50 transition-colors"
                 aria-label="還原資料"
               >
                 <FileJson size={14} /> 還原資料
               </button>

               <div className="w-px h-6 bg-indigo-200 mx-1 hidden sm:block"></div>

               <button 
                 onClick={() => setShowCodeGenerator(!showCodeGenerator)}
                 className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm transition-colors ${showCodeGenerator ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50'}`}
                 aria-label="產生完整程式碼"
               >
                 <Code size={14} /> 產生完整程式碼
               </button>
            </div>
          </div>

          {/* Code Generator Panel */}
          {showCodeGenerator && (
            <div className="bg-stone-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="bg-stone-900 px-4 py-3 flex justify-between items-center border-b border-stone-700">
                 <span className="text-stone-300 text-sm font-mono flex items-center gap-2">
                   <FileCode size={14} /> constants.ts 生成預覽 (全站資料)
                 </span>
                 <button 
                   onClick={handleCopyCode}
                   className="flex items-center gap-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded transition-colors"
                   aria-label={copied ? '已複製！' : '複製全部'}
                 >
                   {copied ? <Check size={14} /> : <Copy size={14} />}
                   {copied ? '已複製！' : '複製全部'}
                 </button>
               </div>
               <div className="p-4">
                 <div className="text-stone-400 text-xs mb-2">
                   如果您做了大量修改，請複製下方完整內容傳給 AI，這是最安全的保存方式。
                 </div>
                 <textarea 
                    readOnly
                    value={generateConstantsCode()}
                    className="w-full h-64 bg-stone-950 text-indigo-300 font-mono text-xs p-4 rounded-lg border border-stone-700 focus:border-indigo-500 outline-none resize-none"
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    aria-label="生成的 constants.ts 代碼"
                 />
               </div>
            </div>
          )}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 bg-indigo-50 flex justify-between items-center">
            <h2 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
              {currentArticle.id ? '編輯文章' : '新增文章'}
            </h2>
            <button onClick={() => setIsEditing(false)} className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 transition-colors" aria-label="取消編輯">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">文章標題</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={currentArticle.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="輸入標題..."
                  aria-label="文章標題"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">分類</label>
                <select
                  name="category"
                  value={currentArticle.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  aria-label="文章分類"
                >
                  <option value="圖書館精選書籍">圖書館精選書籍</option>
                  <option value="電影時光">電影時光</option>
                  <option value="讀者推薦">讀者推薦</option>
                  <option value="寫景寫心">寫景寫心</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">作者</label>
                <input
                  type="text"
                  name="author"
                  required
                  value={currentArticle.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  aria-label="文章作者"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">發布日期</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={currentArticle.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  aria-label="發布日期"
                />
              </div>
            </div>

            {/* Image Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">封面圖片</label>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                
                <div className="grid md:grid-cols-[1fr_200px] gap-6 items-start">
                  <div className="space-y-4">
                    {/* Method 1: URL */}
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
                         <LinkIcon size={14} /> 方式一：貼上圖片網址 (推薦)
                       </label>
                       <input
                        type="url"
                        name="imageUrl"
                        value={currentArticle.imageUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                        placeholder="https://..."
                        disabled={isProcessingImg}
                        aria-label="圖片網址"
                      />
                      <div className="flex flex-col gap-1 text-xs text-stone-500 bg-white p-2 rounded border border-stone-100">
                         <div className="flex items-center gap-1 font-medium text-indigo-800">
                           <AlertCircle size={12} />
                           Google Drive 設定提醒：
                         </div>
                         <ol className="list-decimal list-inside space-y-0.5 ml-1 text-stone-600">
                            <li>右鍵點擊圖片 → 選擇「共用」</li>
                            <li>將權限改為 <strong className="text-red-500">「知道連結的任何人」</strong> (非僅限)</li>
                            <li>複製連結並貼上，系統會自動轉換</li>
                         </ol>
                      </div>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-stone-200"></div>
                      <span className="flex-shrink-0 mx-4 text-stone-400 text-xs">或</span>
                      <div className="flex-grow border-t border-stone-200"></div>
                    </div>

                    {/* Method 2: Upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                         <Upload size={14} /> 方式二：上傳電腦圖片
                       </label>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                        aria-label="上傳圖片檔案"
                      />
                      <button
                        type="button"
                        onClick={triggerFileUpload}
                        disabled={isProcessingImg}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white text-stone-700 rounded-lg hover:bg-stone-50 transition-colors border border-stone-300 text-sm font-medium disabled:opacity-50"
                        aria-label={isProcessingImg ? '處理中' : '選擇檔案'}
                      >
                        {isProcessingImg ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16} />}
                        {isProcessingImg ? '處理中...' : '選擇檔案'}
                      </button>
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-stone-500 flex justify-between">
                      圖片預覽
                      {currentArticle.imageUrl && !imgLoadError && (
                         <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={12}/> 正常</span>
                      )}
                    </label>
                    <div className={`aspect-square w-full rounded-lg overflow-hidden border-2 bg-stone-100 flex items-center justify-center relative group ${imgLoadError ? 'border-red-500' : 'border-stone-200'}`}> {/* Stronger error border */}
                      {currentArticle.imageUrl ? (
                        <>
                          <img 
                            src={currentArticle.imageUrl} 
                            alt="Preview" 
                            referrerPolicy="no-referrer"
                            className={`w-full h-full object-contain ${imgLoadError ? 'hidden' : 'block'}`}
                            onLoad={() => setImgLoadError(false)}
                            onError={() => setImgLoadError(true)}
                          />
                          {imgLoadError && (
                            <div className="text-red-600 flex flex-col items-center p-2 text-center">
                              <AlertCircle size={24} className="mb-2" />
                              <span className="text-xs font-bold">無法載入圖片</span>
                              <span className="text-[10px] mt-1 text-stone-400">請確認連結權限是否已設為「公開」</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-stone-300 flex flex-col items-center p-4 text-center">
                          <ImageIcon size={32} />
                          <span className="text-xs mt-2">請輸入網址或上傳</span>
                        </div>
                      )}
                      {isProcessingImg && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <Loader2 size={24} className="animate-spin text-indigo-600" />
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400 text-center">
                      * 圖片將保持原比例顯示，不會裁切
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Fields */}
            {currentArticle.category === '電影時光' ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 flex items-center gap-1">
                    <Film size={16}/> 電影簡介 (summary)
                  </label>
                  <textarea
                    name="summary"
                    rows={5}
                    value={currentArticle.summary}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                    placeholder="在此輸入電影的簡短介紹或劇情梗概..."
                    aria-label="電影簡介"
                  />
                  <p className="text-xs text-stone-500">此內容將顯示在文章列表和文章詳情頁的「簡介」區塊。</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 flex items-center gap-1">
                    <FileText size={16}/> 觀影心得 (content)
                  </label>
                  <textarea
                    name="content"
                    required
                    rows={10}
                    value={currentArticle.content}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                    placeholder="在此輸入您的觀影心得、分析或評論..."
                    aria-label="觀影心得"
                  />
                  <p className="text-xs text-stone-500">此內容將顯示在文章詳情頁的「觀影心得」區塊。</p>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">文章內容</label>
                <textarea
                  name="content"
                  required
                  rows={10}
                  value={currentArticle.content}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                  placeholder="在此輸入文章內容..."
                  aria-label="文章內容"
                />
                <p className="text-xs text-stone-500">提示：使用 Enter 換行來分段。</p>
              </div>
            )}

            <div className="pt-4 flex justify-between gap-4 border-t border-stone-100">
               <button
                type="button"
                onClick={() => handleCopySingleArticle(currentArticle)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors text-sm"
                aria-label="複製單篇文章 JSON"
              >
                <FileCode size={16} /> 複製單篇 JSON
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
                  aria-label="取消"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isProcessingImg || imgLoadError}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title={imgLoadError ? "請先修正圖片錯誤" : ""}
                  aria-label="儲存發布"
                >
                  <Save size={18} /> 儲存發布
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-stone-100 flex items-center gap-2">
             <Search size={20} className="text-stone-400" />
             <input 
               type="text" 
               placeholder="搜尋文章標題、分類或內容..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="flex-1 outline-none text-stone-700 text-base"
               aria-label="搜尋文章"
             />
          </div>

          {/* List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-600 text-sm uppercase tracking-wider"> {/* Adjusted text size */}
                  <th className="px-6 py-4 font-semibold">圖片</th>
                  <th className="px-6 py-4 font-semibold">標題 / 內容摘要</th>
                  <th className="px-6 py-4 font-semibold">分類</th>
                  <th className="px-6 py-4 font-semibold">作者/日期</th>
                  <th className="px-6 py-4 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredArticles.map(article => (
                  <tr key={article.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4 w-24">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-200 border border-stone-100">
                        <img 
                          src={article.imageUrl} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" // Changed to object-cover
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-bold text-stone-900 line-clamp-1">{article.title}</div>
                      <div className="text-stone-500 text-sm mt-1 line-clamp-2"> {/* Adjusted text size */}
                        {article.category === '電影時光' && article.summary 
                          ? `簡介: ${article.summary}` 
                          : article.content}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      <div>{article.author}</div>
                      <div className="text-xs text-stone-400">{article.date}</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                         onClick={() => handleCopySingleArticle(article)}
                         className="text-stone-500 hover:text-stone-800 p-2 hover:bg-stone-100 rounded-md transition-colors" // Rounded-md
                         title="複製此文章 JSON (給 AI 更新)"
                         aria-label="複製單篇文章 JSON"
                       >
                         <FileCode size={18} />
                       </button>
                      <button 
                        onClick={() => handleEdit(article)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md transition-colors" // Rounded-md
                        title="編輯"
                        aria-label={`編輯文章 ${article.title}`}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-md transition-colors" // Rounded-md
                        title="刪除"
                        aria-label={`刪除文章 ${article.title}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredArticles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                      沒有找到符合的文章。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;