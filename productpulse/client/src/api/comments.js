import api from './axios';

// GET /comments/product/:productId -> { comments (nested tree), count }.
export const fetchComments = async (productId) => {
  const { data } = await api.get(`/comments/product/${productId}`);
  return data.data;
};

// POST /comments/product/:productId -> the created comment.
// payload: { body, parent? }
export const addComment = async (productId, payload) => {
  const { data } = await api.post(`/comments/product/${productId}`, payload);
  return data.data.comment;
};

// DELETE /comments/:id -> { id }.
export const deleteComment = async (id) => {
  const { data } = await api.delete(`/comments/${id}`);
  return data.data;
};
