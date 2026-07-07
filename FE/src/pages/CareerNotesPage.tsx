import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/axios';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const categoryColors: Record<string, string> = {
  'Tips CV': 'bg-blue-100 text-blue-700',
  'Interview': 'bg-purple-100 text-purple-700',
  'Tren Industri': 'bg-orange-100 text-orange-700',
  'Karir': 'bg-green-100 text-green-700',
  'Skill': 'bg-pink-100 text-pink-700',
};

export default function CareerNotesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/career-notes');
        const json = res.data;
        console.log("Data career notes dari backend:", json);
        if (json && Array.isArray(json.data)) {
          setArticles(json.data);
        } else if (Array.isArray(json)) {
          setArticles(json);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error('Gagal memuat career notes:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-extrabold text-brand-dark mb-2">Career Notes</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Tips karir, panduan interview, tren industri, dan wawasan pasar kerja terkini untuk membantu Anda meraih karier impian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-brand-lime border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Memuat artikel...</p>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg">Belum ada artikel tersedia.</p>
            </div>
          ) : articles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white border border-brand-border rounded-xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            >
              {/* Gambar Artikel */}
              <div className="h-44 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.classList.add('bg-linear-to-br', 'from-brand-lime', 'to-brand-dark');
                  }}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>
                    {article.category}
                  </span>
                  <span className="text-gray-400 text-xs">{article.readTime}</span>
                </div>
                <h2 className="font-heading font-bold text-brand-dark mb-2 group-hover:text-brand-dark/80 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-brand-border pt-3">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
                <Link
                  to={`/career-notes/${article.slug}`}
                  className="mt-3 inline-block w-full text-center bg-brand-dark text-white text-sm font-semibold py-2 rounded-full hover:opacity-90 transition-opacity"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal Detail Artikel */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.classList.add('bg-linear-to-br', 'from-brand-lime', 'to-brand-dark');
                }}
              />
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body Konten */}
            <div className="px-8 py-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[selectedArticle.category] || 'bg-gray-100 text-gray-600'}`}>
                  {selectedArticle.category}
                </span>
                <span className="text-gray-400 text-xs">{selectedArticle.readTime}</span>
              </div>

              <h2 className="text-2xl font-heading font-bold text-brand-dark mb-3 leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-gray-400 mb-5 pb-5 border-b border-brand-border">
                <span>{selectedArticle.author}</span>
                <span>{selectedArticle.date}</span>
              </div>

              <div className="text-gray-600 text-sm leading-[1.8] space-y-4 whitespace-pre-line">
                {selectedArticle.content}
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="mt-6 w-full bg-brand-dark text-white font-semibold py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
