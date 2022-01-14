import api from './axios';

// GET /products?sort&page&limit&category&q
// Returns { products, page, limit, total, totalPages, sort }.
export const fetchProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data.data;
};

// GET /products/:id -> the shaped product object.
export const fetchProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data.product;
};

// POST /products -> the created product.
export const createProduct = async (payload) => {
  const { data } = await api.post('/products', payload);
  return data.data.product;
};

// POST /products/:id/upvote -> { id, voteCount, hasVoted } for reconciliation.
export const upvoteProduct = async (id) => {
  const { data } = await api.post(`/products/${id}/upvote`);
  return data.data;
};

// DELETE /products/:id -> { id }.
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data.data;
};
