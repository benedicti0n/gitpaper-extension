import logo from "data-base64:~images/logo.png"
import React, { useEffect, useState } from "react"

import { fetchWallpapers } from "~helpers/fetchWallpapers"
import type { WallpaperCardProps } from "~types/WallpaperProps"

import SkeletonLoader from "./Loader/skeleton-loader"
import WallpaperCard from "./WallpaperCard"
import { Button } from "./ui/button"

export default function Wallpapers() {
  const [wallpapers, setWallpapers] = useState<WallpaperCardProps[]>([])
  const [loading, setloading] = useState(false)

  const userId = localStorage.getItem("userId")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    // Reload the page to reflect the logout state
    window.location.reload()
  }

  const handleRefetch = async () => {
    setloading(true)
    try {
      const data = await fetchWallpapers(userId, true) // Force refresh
      setWallpapers(data)
    } catch (error) {
      alert("error fetching wallpapers")
      console.log(error)
    } finally {
      setloading(false)
    }
  }

  async function fetchHandler() {
    setloading(true)
    try {
      const data = await fetchWallpapers(userId) // Will use cache if available
      setWallpapers(data)
    } catch (error) {
      alert("error fetching wallpapers")
      console.log(error)
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fetchHandler()
  }, [userId])

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <div className="w-full h-full flex items-center flex-col text-lg px-6 space-y-6 relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          onClick={handleRefetch}
          className="px-4 py-2 rounded-lg"
        >
          Refresh
        </Button>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg"
        >
          Logout
        </Button>
      </div>

      <h1 className="text-2xl font-semibold flex justify-center items-center mt-6">
        <span className="font-bold ml-1">Your Wallpapers</span>
        <img src={logo} alt="gitpaper-logo" className="ml-1 size-10" />
      </h1>

      <div className="w-full grid grid-cols-2 gap-4 justify-center items-center mt-6">
        {wallpapers?.map((w, index) => (
          <WallpaperCard
            key={index}
            bentoLink={w?.bentoLink}
            backgroundImageLink={w?.backgroundImageLink}
            theme={w?.theme}
          />
        ))}
      </div>
    </div>
  )
}
