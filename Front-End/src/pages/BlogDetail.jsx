import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BASE_URL } from '../url';
import { getPostBySlug } from './Admin/services/api';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getPostBySlug(slug);
        if (!mounted) return;
        setPost(data);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setError('Post not found or failed to load.');
        setPost(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPost();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const coverUrl = useMemo(() => {
    if (!post?.cover_image) return null;
    return `${BASE_URL}/storage/${post.cover_image}`;
  }, [post]);

  const authorName = post?.author?.name || 'Admin';
  const publishedText = formatDate(post?.published_at || post?.created_at);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-5 pt-28 pb-12 text-white font-heading">
        {loading ? (
          <p className="text-white/70">Loading…</p>
        ) : error ? (
          <p className="text-white/70">{error}</p>
        ) : (
          <article className="space-y-6">
            {coverUrl && (
              <img
                src={coverUrl}
                alt={post?.title || 'Cover'}
                className="w-full max-h-[420px] object-cover rounded-2xl border border-white/15"
              />
            )}

            <header className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-semibold">{post?.title}</h1>
              <div className="text-sm text-white/70">
                By {authorName}
                {publishedText ? ` • ${publishedText}` : ''}
              </div>
              {post?.excerpt ? (
                <p className="text-white/80">{post.excerpt}</p>
              ) : null}
            </header>

            <div className="text-white/90 leading-relaxed whitespace-pre-line">
              {post?.content}
            </div>
          </article>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
