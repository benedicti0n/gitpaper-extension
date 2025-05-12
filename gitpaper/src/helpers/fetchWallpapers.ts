import axios from "axios"

const WEBAPP_URL = process.env.PLASMO_PUBLIC_WEBAPP_URL

export async function fetchWallpapers(userId: string) {
  if (!userId) {
    alert("No userId found in localStorage")
    return
  }

  try {
    const response = await axios.get(
      `${WEBAPP_URL}/api/v1/extension/wallpapers?userId=${userId}`
    )

    const { wallpapers } = response.data
    console.log(wallpapers, "wallpapers")
    return wallpapers
  } catch (error) {
    alert("fetching failed")
    console.log(error, "fetching Error")
  }
}
