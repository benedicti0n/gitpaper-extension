import axios from "axios"

const WEBAPP_URL = process.env.PLASMO_PUBLIC_WEBAPP_URL

export async function fetchWallpapers(userId: string, forceRefresh = false) {
  if (!userId) {
    alert("No userId found in localStorage")
    return
  }

  try {
    // Check if we should use cached wallpapers
    if (!forceRefresh) {
      const cachedWallpapers = localStorage.getItem(`wallpapers_${userId}`)
      if (cachedWallpapers) {
        return JSON.parse(cachedWallpapers)
      }
    }

    // If not cached or forceRefresh is true, fetch from API
    const response = await axios.get(
      `${WEBAPP_URL}/api/v1/extension/wallpapers?userId=${userId}`
    )

    const { wallpapers } = response.data
    
    // Cache the wallpapers
    localStorage.setItem(`wallpapers_${userId}`, JSON.stringify(wallpapers))
    
    return wallpapers
  } catch (error) {
    alert("fetching failed")
    console.log(error, "fetching Error")
  }
}
