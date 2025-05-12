import axios from "axios"

const WEBAPP_URL = process.env.PLASMO_PUBLIC_WEBAPP_URL

interface UserProps {
  username: String
  password: String
}

export async function checkUser({ username, password }: UserProps) {
  try {
    const response = await axios.post(
      `${WEBAPP_URL}/api/v1/extension/login`,
      {
        username,
        password
      }
    )

    const { user, token } = response.data
    console.log("User:", user)
    console.log("Token:", token)

    localStorage.setItem("token", token)
    localStorage.setItem("userId", user?.id)
  } catch (error) {
    alert("Login failed")
    console.log(error, "Login Error")
  }
}
