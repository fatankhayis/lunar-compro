import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../url';
import { getPublicPostsPage } from '../../Admin/services/api';

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data } = await getPublicPostsPage(1, 6);
        if (!mounted) return;
        setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load posts:', e);
        if (!mounted) return;
        setPosts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full pt-6 pb-10 md:pt-10 md:pb-14 lg:pt-12 lg:pb-16 px-5 relative z-10 text-white font-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-semibold text-[24px] md:text-[28px] lg:text-[31px] xl:text-[33px]">
            Blog / News
          </h2>
          <p className="text-white/70 mt-2">Insights & updates from Lunar.</p>
        </div>

        {loading ? (
          <p className="text-center text-white/60">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-white/60">Belum ada post.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const caption =
                post.excerpt ||
                (post.content || '').slice(0, 120) + ((post.content || '').length > 120 ? '…' : '');

              const coverUrl = post.cover_image ? `${BASE_URL}/storage/${post.cover_image}` : null;

              return (
                <Link
                  key={post.post_id}
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
                    <p className="text-white/70 text-sm mt-2 line-clamp-3">{caption}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Link
            to="/blog"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm text-white/90 hover:bg-white/10 transition"
          >
            Lihat semua berita
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
