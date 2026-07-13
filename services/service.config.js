import axios from "axios"

// base url for the server
const service = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
})

// uses the token (if logged in), to attach it to the outgoing axios request, so if verification is needed it can check the local storage token
service.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken")
  if (authToken) {
    config.headers.authorization = `Bearer ${authToken}`
  }
  return config
})

export default service
