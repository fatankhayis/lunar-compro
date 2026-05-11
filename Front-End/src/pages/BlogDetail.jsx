import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BASE_URL } from '../url';
import { getPostBySlug } from './Admin/services/api';
import { useI18n } from '../i18n/I18nProvider.jsx';
import lunarlogo from '../assets/Lunar-logo.png';

const formatDate = (value, locale) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(locale || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
};

const BlogDetail = () => {
  const { slug } = useParams();
  const { lang, t } = useI18n();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contentRef = useRef(null);

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const logoVariants = {
    hidden: {
      y: 100,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        duration: 1.2,
        ease: "easeOut"
      }
    }
  }

  const textVariants = {
    hidden: {
      y: 60,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        duration: 0.9,
        ease: "easeOut",
        delay: 0.4
      }
    }
  }

  useEffect(() => {
    let mounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getPostBySlug(slug);
        if (!mounted) return;
        setPost(data);

        // Scroll to content automatically
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setError(t('blog_detail_failed'));
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
  const publishedText = formatDate(post?.published_at || post?.created_at, lang === 'id' ? 'id-ID' : 'en-US');

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero - matching Home/Project pattern */}
      <motion.div
        className="relative h-screen w-full overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg to-90% to-bgone/80" />

        <div className="absolute inset-0 flex flex-col justify-center items-center z-30 text-white">
          <motion.img
            src={lunarlogo}
            alt="Lunar Interactive"
            className="w-72 sm:w-78 md:w-82 lg:w-[360px] xl:w-[460px] mb-5 drop-shadow-2xl"
            variants={logoVariants}
          />

          <motion.p
            className="text-[18px] sm:text-[19px] md:text-xl lg:text-[23px] xl:text-[28px] font-semibold tracking-wide text-center lg:mt-2"
            variants={textVariants}
          >
            {t('blog_list_title')}
          </motion.p>
        </div>
      </motion.div>

      {/* Blog Detail Content */}
      <div ref={contentRef} className="max-w-4xl mx-auto px-5 py-12 text-white font-heading">
        {loading ? (
          <p className="text-white/70">{t('loading')}</p>
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
                {t('blog_by', { name: authorName })}
                {publishedText ? ` • ${publishedText}` : ''}
              </div>
              {post?.excerpt ? (
                <p className="text-white/80">{post.excerpt}</p>
              ) : null}
            </header>

            <div className="text-white/90 leading-relaxed whitespace-pre-line">
              {post?.content}
            </div>

            <div className="pt-8 mt-8 border-t border-white/10">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('Back') || 'Back to Blog List'}
              </Link>
            </div>
          </article>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
