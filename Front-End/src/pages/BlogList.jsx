import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BASE_URL } from '../url';
import { getPublicPostsPage } from './Admin/services/api';
import { useI18n } from '../i18n/I18nProvider.jsx';
import lunarlogo from '../assets/Lunar-logo.png';

const BlogList = () => {
  const { t } = useI18n();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 9;
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: perPage, total: 0 });

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
                      className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md overflow-hidden hover:bg-white/10 transition flex flex-col h-full"
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

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold line-clamp-2" title={post.title}>{post.title}</h3>
                        <p className="text-white/70 text-sm mt-2 line-clamp-3">{caption}</p>
                        <div className="text-[11px] uppercase tracking-wide text-white/60 mt-auto pt-4">
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
