import axios from 'axios'

// Talks to the Flask backend (proxied via vite.config.js -> http://localhost:5001).
export const loadDemoData = () => axios.get('/api/demo')

export const uploadCSV = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/api/upload', formData)
}
