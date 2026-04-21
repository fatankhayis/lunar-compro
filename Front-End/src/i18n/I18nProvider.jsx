import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'lunar_lang';
const SUPPORTED_LANGS = ['en', 'id'];

const DICT = {
  en: {
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_projects: 'Projects',
    nav_project: 'Project',
    nav_blog: 'Blog',

    header_collaborate: 'Collaborate with us',

    footer_company: 'Company',
    footer_request_quote: 'Request a Quote',
    footer_placeholder_name: 'Name',
    footer_placeholder_email: 'Email',
    footer_placeholder_message: 'Message',
    footer_send: 'Send',
    footer_sending: 'Sending…',
    footer_or_email_us: 'Or email us:',
    footer_toast_request_sent: 'Request sent. Thank you!',
    footer_toast_request_failed: 'Failed to send request. Try again.',
    footer_copyright: '© Lunar Interactive 2025. All rights reserved',

    blog_list_title: 'All Latest News',
    loading: 'Loading…',
    blog_list_failed: 'Failed to load blog posts.',
    blog_empty: 'No posts yet.',
    blog_read_more: 'Read more',
    pagination_prev: 'Prev',
    pagination_next: 'Next',
    pagination_of: '{current} of {last}',

    blog_detail_failed: 'Post not found or failed to load.',
    blog_by: 'By {name}',
  },
  id: {
    nav_home: 'Beranda',
    nav_about: 'Tentang Kami',
    nav_projects: 'Proyek',
    nav_project: 'Proyek',
    nav_blog: 'Blog',

    header_collaborate: 'Kolaborasi bersama kami',

    footer_company: 'Perusahaan',
    footer_request_quote: 'Minta Penawaran',
    footer_placeholder_name: 'Nama',
    footer_placeholder_email: 'Email',
    footer_placeholder_message: 'Pesan',
    footer_send: 'Kirim',
    footer_sending: 'Mengirim…',
    footer_or_email_us: 'Atau email kami:',
    footer_toast_request_sent: 'Permintaan terkirim. Terima kasih!',
    footer_toast_request_failed: 'Gagal mengirim permintaan. Coba lagi.',
    footer_copyright: '© Lunar Interactive 2025. Seluruh hak cipta dilindungi',

    blog_list_title: 'Semua Berita Terkini',
    loading: 'Memuat…',
    blog_list_failed: 'Gagal memuat postingan blog.',
    blog_empty: 'Belum ada postingan.',
    blog_read_more: 'Baca selengkapnya',
    pagination_prev: 'Sebelumnya',
    pagination_next: 'Berikutnya',
    pagination_of: '{current} dari {last}',

    blog_detail_failed: 'Postingan tidak ditemukan atau gagal dimuat.',
    blog_by: 'Oleh {name}',
  },
};

const getInitialLang = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  } catch {
    // ignore
  }
  return 'en';
};

const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export const I18nProvider = ({ children }) => {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((nextLang) => {
    const normalized = SUPPORTED_LANGS.includes(nextLang) ? nextLang : 'en';
    setLangState(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, normalized);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key, vars) => {
      const base = DICT[lang] || DICT.en;
      let text = base[key] ?? DICT.en[key] ?? key;

      if (vars && typeof vars === 'object') {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replaceAll(`{${k}}`, String(v));
        });
      }

      return text;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
