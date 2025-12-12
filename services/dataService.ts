import { Article } from '../types';
import { MOCK_ARTICLES } from '../constants';

const STORAGE_KEY = 'medical_humanities_articles';

// Initialize data if not present
const initData = (): Article[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Basic validation to ensure it's an array
      if (Array.isArray(parsed)) {
        // Ensure old articles without summary have it initialized to undefined
        return parsed.map(article => ({ ...article, summary: article.summary || undefined }));
      }
    } catch (e) {
      console.error("Data corruption detected, resetting to defaults", e);
      // If corrupted, we might want to keep the bad data in a backup key just in case, 
      // but for now we fallback to mock data to keep app running.
    }
  }
  
  // If no custom data or corrupted, save the mock data
  try {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ARTICLES));
  } catch (e) {
     console.error("Initial storage failed", e);
  }
  return MOCK_ARTICLES;
};

export const getArticles = (): Article[] => {
  return initData();
};

export const getArticleById = (id: string): Article | undefined => {
  const articles = getArticles();
  return articles.find(a => a.id === id);
};

export const saveArticle = (article: Article): boolean => {
  // Get fresh copy
  const articles = [...getArticles()];
  const existingIndex = articles.findIndex(a => a.id === article.id);

  // Ensure summary is only saved for '電影時光' category, otherwise set to undefined
  const articleToSave = article.category === '電影時光' 
    ? article
    : { ...article, summary: undefined };

  if (existingIndex >= 0) {
    // Update existing
    articles[existingIndex] = articleToSave;
  } else {
    // Create new (add to top)
    articles.unshift(articleToSave);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    // Trigger a custom event so components can reload if needed
    window.dispatchEvent(new Event('articlesUpdated'));
    return true;
  } catch (e) {
    console.error("Storage failed:", e);
    alert("儲存失敗！您的瀏覽器儲存空間不足 (Quota Exceeded)。\n\n建議：\n1. 刪除一些舊的文章\n2. 使用更小的圖片 (系統已嘗試壓縮)");
    return false;
  }
};

export const deleteArticle = (id: string): void => {
  const articles = getArticles().filter(a => a.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new Event('articlesUpdated'));
  } catch (e) {
    console.error("Delete failed:", e);
    alert("刪除失敗，請重新整理頁面再試。");
  }
};

// Export all data as JSON string
export const exportData = (): string => {
  // Filter out undefined summary fields for cleaner JSON output
  const articlesToExport = getArticles().map(article => {
    const { summary, ...rest } = article;
    return summary !== undefined ? article : rest; // Only include summary if it exists
  });
  return JSON.stringify(articlesToExport, null, 2);
};

// Import data from JSON string
export const importData = (jsonStr: string): boolean => {
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data)) throw new Error("Invalid format: Not an array");
    
    // Basic validation of the first item to ensure it looks like an article
    if (data.length > 0 && (!data[0].id || !data[0].title)) {
      throw new Error("Invalid format: Item missing required fields");
    }

    // Ensure imported articles also have summary initialized to undefined if missing
    const sanitizedData = data.map((article: Article) => ({ ...article, summary: article.summary || undefined }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedData));
    window.dispatchEvent(new Event('articlesUpdated'));
    return true;
  } catch (e) {
    console.error("Import failed", e);
    return false;
  }
};

// Helper to generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};