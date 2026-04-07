import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BASE_URL } from '../url';
import { getPublicPostsPage } from './Admin/services/api';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 9;
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: perPage, total: 0 });

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
        setError('Gagal memuat blog.');
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
    return `${current} of ${last}`;
  }, [meta]);

  const canPrev = (meta?.current_page || 1) > 1;
  const canNext = (meta?.current_page || 1) < (meta?.last_page || 1);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-5 pt-28 pb-12 text-white font-heading">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">Semua Berita Terkini</h1>
          <div className="mt-3 h-[3px] w-16 bg-white/60" />
        </div>

        {loading ? (
          <p className="text-white/70">Loading…</p>
        ) : error ? (
          <p className="text-white/70">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-white/70">Belum ada post.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => {
                const coverUrl = post.cover_image ? `${BASE_URL}/storage/${post.cover_image}` : null;
                const caption =
                  post.excerpt ||
                  (post.content || '').slice(0, 110) + ((post.content || '').length > 110 ? '…' : '');

                return (
                  <Link
                    key={post.post_id}
                    to={`/blog/${post.slug}`}
                    className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md overflow-hidden block hover:bg-white/10 transition"
                  >
                    {coverUrl ? (
                      <img src={coverUrl} alt={post.title} className="w-full h-44 object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-44 bg-white/10" />
                    )}

                    <div className="p-5">
                      <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
                      <p className="text-white/70 text-sm mt-2 line-clamp-2">{caption}</p>
                      <div className="text-[11px] uppercase tracking-wide text-white/60 mt-4">
                        Baca selengkapnya
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between text-white/70 text-sm">
              <button
                type="button"
                onClick={() => canPrev && setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 disabled:opacity-50"
              >
                Prev
              </button>

              <div>{pageText}</div>

              <button
                type="button"
                onClick={() => canNext && setPage((p) => p + 1)}
                disabled={!canNext}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogList;
