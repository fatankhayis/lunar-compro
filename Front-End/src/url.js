const normalizeOrigin = (value) => {
	if (!value || typeof value !== 'string') return '';
	return value.replace(/\/+$/, '');
};

// Default: same-origin (works when React build is served by Laravel)
// Override for separate dev servers via: VITE_BACKEND_URL=http://127.0.0.1:8000
export const BASE_URL = normalizeOrigin(import.meta.env.VITE_BACKEND_URL);