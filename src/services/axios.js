import axios from "axios"

// axios setup
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
})

// handle response and errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // check for session expiry
    if (error.response?.status === 401) {
      console.warn("Session expired or unauthorized")
    }

    return Promise.reject(error)
  }
)

export default api