import axios from "axios"

export async function fetchWallpapers(userId: string) {
  if (!userId) {
    alert("No userId found in localStorage")
    return
  }

  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/extension/wallpapers?userId=${userId}`
    )

    const { wallpapers } = response.data
    console.log(wallpapers, "wallpapers")
    return wallpapers
  } catch (error) {
    alert("fetching failed")
    console.log(error, "fetching Error")
  }
}
