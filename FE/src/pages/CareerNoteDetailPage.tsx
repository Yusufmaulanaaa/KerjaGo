import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

export default function CareerNoteDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/career-notes/${slug}`);
        const json = res.data;
        if (json?.data) {
          setArticle(json.data);
        } else {
          setError('Artikel tidak ditemukan.');
        }
      } catch (err) {
        console.error('Gagal memuat artikel:', err);
        setError('Gagal memuat artikel. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchArticle();
  }, [slug]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          to="/career-notes"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-dark transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Career Notes
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-lime border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Memuat artikel...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">{error}</p>
            <Link
              to="/career-notes"
              className="inline-block bg-brand-dark text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Kembali
            </Link>
          </div>
        ) : article ? (
          <article>
            {/* Header */}
            <div className="h-56 rounded-2xl overflow-hidden mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.classList.add('bg-linear-to-br', 'from-brand-lime', 'to-brand-dark');
                }}
              />
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  categoryColors[article.category] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {article.category}
              </span>
              <span className="text-gray-400 text-xs">{article.readTime}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-heading font-extrabold text-brand-dark mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Author & Date */}
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-6 border-b border-brand-border">
              <span>{article.author}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{article.date}</span>
            </div>

            {/* Full Content */}
            <div className="text-gray-600 text-base leading-[1.9] space-y-5 whitespace-pre-line">
              {article.content}
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-brand-border">
              <Link
                to="/career-notes"
                className="inline-block bg-brand-dark text-white font-semibold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
              >
                ← Kembali ke Career Notes
              </Link>
            </div>
          </article>
        ) : null}
      </div>
      <Footer />
    </div>
  );
}
