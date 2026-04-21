import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BASE_URL } from '../url';
import { getPublicPostsPage } from './Admin/services/api';
import { useI18n } from '../i18n/I18nProvider.jsx';

const BlogList = () => {
  const { t } = useI18n();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 9;
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: perPage, total: 0 });

  const heroTitleVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 18,
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const heroLineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 20,
        duration: 0.9,
        ease: 'easeOut',
        delay: 0.1,
      },
    },
  };

  useEffect(() => {
    let mounted = true;

    const fetchPage = async () => {
      try {
        setLoading(true);
        setError('');

        const { data, meta: respMeta } = await getPublicPostsPage(page, perPage);
        if (!mounted) return;

        setPosts(Array.isArray(data) ? data : []);
        setMeta({
          current_page: respMeta?.current_page ?? page,
          last_page: respMeta?.last_page ?? 1,
          per_page: respMeta?.per_page ?? perPage,
          total: respMeta?.total ?? 0,
        });
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setPosts([]);
        setError(t('blog_list_failed'));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPage();

    return () => {
      mounted = false;
    };
  }, [page]);

  const pageText = useMemo(() => {
    const last = meta?.last_page || 1;
    const current = meta?.current_page || 1;
    return t('pagination_of', { current, last });
  }, [meta, t]);

  const canPrev = (meta?.current_page || 1) > 1;
  const canNext = (meta?.current_page || 1) < (meta?.last_page || 1);

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 18,
      },
    },
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero (match Home/Project top section) */}
      <div className="relative h-screen flex justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-bg to-90% to-bgone/80" />

        <div className="relative text-center text-white font-semibold font-heading tracking-wide px-5">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl"
            initial="hidden"
            animate="visible"
            variants={heroTitleVariants}
          >
            {t('blog_list_title')}
          </motion.h1>
          <motion.div
            className="mt-5 h-[3px] w-20 bg-white/60 mx-auto"
            initial="hidden"
            animate="visible"
            variants={heroLineVariants}
          />
        </div>
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-5 py-12 text-white font-heading"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={listContainerVariants}
      >

        {loading ? (
          <p className="text-white/70">{t('loading')}</p>
        ) : error ? (
          <p className="text-white/70">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-white/70">{t('blog_empty')}</p>
        ) : (
          <>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={gridVariants}>
              {posts.map((post) => {
                const coverUrl = post.cover_image ? `${BASE_URL}/storage/${post.cover_image}` : null;
                const caption =
                  post.excerpt ||
                  (post.content || '').slice(0, 110) + ((post.content || '').length > 110 ? '…' : '');

                return (
                  <motion.div key={post.post_id} variants={itemVariants}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md overflow-hidden block hover:bg-white/10 transition"
                    >
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={post.title}
                          className="w-full h-44 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-44 bg-white/10" />
                      )}

                      <div className="p-5">
                        <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
                        <p className="text-white/70 text-sm mt-2 line-clamp-2">{caption}</p>
                        <div className="text-[11px] uppercase tracking-wide text-white/60 mt-4">
                          {t('blog_read_more')}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="mt-10 flex items-center justify-between text-white/70 text-sm">
              <button
                type="button"
                onClick={() => canPrev && setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 disabled:opacity-50"
              >
                {t('pagination_prev')}
              </button>

              <div>{pageText}</div>

              <button
                type="button"
                onClick={() => canNext && setPage((p) => p + 1)}
                disabled={!canNext}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 disabled:opacity-50"
              >
                {t('pagination_next')}
              </button>
            </div>
          </>
        )}
      </motion.div>

      <Footer />
    </div>
  );
};

export default BlogList;
