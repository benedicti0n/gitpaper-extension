import logo from "data-base64:~images/logo.png"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"

import { Button } from "~components/ui/button"
import Wallpapers from "~components/Wallpapers"
import { checkUser } from "~helpers/checkUserInDb"

import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface UserProps {
  username: String
  password: String
}

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async ({ username, password }: UserProps) => {
    setLoading(true)
    try {
      await checkUser({ username, password })
    } catch (error) {
      alert("Error in login component")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const token = localStorage.getItem("token")

  if (token) {
    return <Wallpapers />
  }

  return (
    <div className="w-full h-full flex justify-center items-center flex-col text-lg px-6 space-y-6">
      <h1 className="text-2xl font-semibold flex justify-center items-center">
        Welcome to <span className="italic font-bold ml-1">Gitpaper</span>
        <img src={logo} alt="gitpaper-logo" className="ml-1 size-10" />
      </h1>
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
        <Label htmlFor="username">Username</Label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          id="username"
          placeholder="Enter your username..."
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          placeholder="password"
        />
      </div>
      <Button
        disabled={loading}
        onClick={() => handleSubmit({ username, password })}
        className="w-1/2">
        {loading ? (
          <div className="flex justify-center items-center gap-1">
            Please wait <Loader2 className="animate-spin h-5 w-5 mr-3" />
          </div>
        ) : (
          "Login"
        )}
      </Button>
    </div>
  )
}
