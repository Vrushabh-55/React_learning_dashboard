import axios from 'axios'

/**
 * API SERVICE LAYER
 * 
 * Centralizing all API calls in a /services folder is a best practice.
 * Benefits:
 * - Base URL defined once
 * - Easy to swap endpoints or add auth headers later
 * - Components don't need to know URL details
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Create a reusable axios instance with shared config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export const apiService = {
  // Fetch all users
  getUsers: () => api.get('/users'),

  // Fetch all posts (or posts by userId)
  getPosts: (userId) =>
    userId ? api.get(`/posts?userId=${userId}`) : api.get('/posts'),

  // Fetch a single post
  getPost: (id) => api.get(`/posts/${id}`),

  // Fetch comments for a post
  getComments: (postId) => api.get(`/comments?postId=${postId}`),
}

export default api
