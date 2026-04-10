import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, timeout: 10000 });
api.interceptors.request.use((config) => { const token = localStorage.getItem('nexus_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((res) => res, (err) => { if (err.response?.status === 401) localStorage.removeItem('nexus_token'); return Promise.reject(err); });
export default api;

const MOCK_PRODUCTS = [
  { id: 1, name: 'Enterprise Suite Pro', sku: 'ESP-001', category: 'Software', description: 'Complete enterprise management suite with advanced analytics, reporting, and team collaboration tools.', price: 2499, original_price: 2999, stock: 150, img: '💼', rating: 4.8, reviews: 124, badge: 'bestseller' },
  { id: 2, name: 'CloudSync Manager', sku: 'CSM-002', category: 'Cloud', description: 'Real-time cloud synchronization across all your devices and teams with zero latency and 99.9% uptime.', price: 1299, original_price: 1599, stock: 300, img: '☁️', rating: 4.6, reviews: 89, badge: 'new' },
  { id: 3, name: 'Analytics Dashboard', sku: 'ADM-003', category: 'Analytics', description: 'Deep insights and predictive analytics powered by AI. Make data-driven decisions faster than ever.', price: 899, original_price: null, stock: 500, img: '📊', rating: 4.7, reviews: 203, badge: null },
  { id: 4, name: 'Security Shield Elite', sku: 'SSE-004', category: 'Security', description: 'Military-grade encryption and real-time threat detection to protect your entire digital infrastructure.', price: 3999, original_price: 4999, stock: 80, img: '🛡️', rating: 4.9, reviews: 67, badge: 'premium' },
  { id: 5, name: 'API Gateway Pro', sku: 'AGP-005', category: 'Infrastructure', description: 'High-performance API gateway with rate limiting, caching, load balancing, and real-time monitoring.', price: 1799, original_price: 2199, stock: 200, img: '🔌', rating: 4.5, reviews: 156, badge: null },
  { id: 6, name: 'Data Vault Storage', sku: 'DVS-006', category: 'Infrastructure', description: 'Encrypted cloud storage with automatic backup, version control, and instant one-click restore.', price: 599, original_price: null, stock: 450, img: '💾', rating: 4.4, reviews: 312, badge: 'new' },
  { id: 7, name: 'AI Assistant SDK', sku: 'AIS-007', category: 'AI & ML', description: 'Embed intelligent AI capabilities into your applications with our developer-friendly SDK and APIs.', price: 2199, original_price: 2799, stock: 0, img: '🤖', rating: 4.8, reviews: 45, badge: 'coming soon' },
  { id: 8, name: 'DevOps Pipeline', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 9, name: 'DevOps Pipeline9', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 10, name: 'DevOps Pipeline10', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 11, name: 'DevOps Pipeline11', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 12, name: 'DevOps Pipeline12', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 13, name: 'DevOps Pipeline13', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 14, name: 'DevOps Pipeline14', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 15, name: 'DevOps Pipeline15', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 16, name: 'DevOps Pipeline16', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 17, name: 'DevOps Pipeline17', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 18, name: 'DevOps Pipeline18', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 19, name: 'DevOps Pipeline19', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null },
  { id: 20, name: 'DevOps Pipeline20', sku: 'DOP-008', category: 'DevOps', description: 'Automate your entire CI/CD pipeline with one-click deployments, rollback, and environment management.', price: 1499, original_price: 1899, stock: 175, img: '⚙️', rating: 4.6, reviews: 78, badge: null }
];
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms + Math.random() * 300));

export const authService = {
  register: async (d) => { await delay(900); return { data: { message: 'Registered. Check email.', user_id: 1 } }; },
  login: async (d) => { await delay(800); return { data: { token: 'mock_' + Date.now(), user: { id: 1, name: d.name || 'Demo User', email: d.email, role: 'customer' } } }; },
  verify: async (d) => { await delay(700); return { data: { token: 'mock_verified_' + Date.now(), user: { id: 1, name: 'Verified User', email: d.email, role: 'customer' } } }; },
  resend: async () => { await delay(500); return { data: { message: 'Code resent.' } }; },
  logout: async () => { await delay(300); return { data: {} }; },
  me: async () => { await delay(400); return { data: { id: 1, name: 'Demo User', email: 'demo@nexus.io', role: 'customer' } }; },
};

export const productService = {
  getAll: async (params = {}) => {
    await delay();
    let data = [...MOCK_PRODUCTS];
    if (params.search) data = data.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()) || p.description.toLowerCase().includes(params.search.toLowerCase()));
    if (params.category) data = data.filter(p => p.category === params.category);
    return { data: { data, meta: { total: data.length } } };
  },
  getById: async (id) => { await delay(400); const p = MOCK_PRODUCTS.find(p => p.id === Number(id)); return { data: p }; },
};

export const orderService = {
  create: async (d) => { await delay(1000); return { data: { order: { id: Date.now(), order_number: 'ORD-2024-' + Math.floor(Math.random() * 9000 + 1000), status: 'pending', ...d } } }; },
};

export const paymentService = {
  createStripeIntent: async () => { await delay(700); return { data: { client_secret: 'pi_mock_' + Date.now() } }; },
  confirmStripe: async () => { await delay(800); return { data: { status: 'success' } }; },
  createRazorpay: async () => { await delay(700); return { data: { razorpay_order_id: 'order_mock_' + Date.now() } }; },
  verifyRazorpay: async () => { await delay(600); return { data: { status: 'success' } }; },
  createPaypal: async () => { await delay(700); return { data: { id: 'PAYPAL-' + Date.now() } }; },
  capturePaypal: async () => { await delay(800); return { data: { status: 'COMPLETED' } }; },
};

export const dashboardService = { getStats: async () => { await delay(400); return { data: { totalCustomers: 12400, productsDelivered: 48000, uptime: '99.9%', countries: 42, monthlyRevenue: 72840 } }; } };
export const contactService = { send: async () => { await delay(900); return { data: { message: 'Sent!' } }; } };

// Promise.all helpers
export const fetchHomeData = () => Promise.all([productService.getAll({ per_page: 6 }), dashboardService.getStats()]).then(([p, s]) => ({ products: p.data.data, stats: s.data }));
export const fetchProductsPage = (params = {}) => Promise.all([productService.getAll(params), Promise.resolve({ data: { categories: ['Software', 'Cloud', 'Analytics', 'Security', 'Infrastructure', 'AI & ML', 'DevOps'] } })]).then(([p, c]) => ({ products: p.data.data, meta: p.data.meta, categories: c.data.categories }));
