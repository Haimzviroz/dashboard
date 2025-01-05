import { FC, useState } from "react"
import { useRouter } from "next/router"
import s from '../login/login.module.css'
import { signIn } from "next-auth/react"

import LoginForm from "./login-form"
import { IUserLogin } from "@/types/interfaces/user-login.interface"

import { login } from "@/apis/client-side/login.api"
import Logger from "@/services/logger"



const Login: FC = () => {
  const logger = Logger(Login.name)
  const [isCorrectUser, setIsCorrectUser] = useState<boolean>(true)
  const router = useRouter()

  const handleSignIn = () => {
    logger.info("Sign in")
    signIn("keycloak")
  }

  const loginSubmit = async (username: string, password: string) => {

    const data: IUserLogin = { username, password }
    try {
      await login(data)
      setIsCorrectUser(true)
      router.push("/management-projects")
    } catch (error) {
      setIsCorrectUser(false)
    }

  }
  
  return (
    <div className={s["login-wrapper"]}>
      <div className={s.content}>
        <div>
          {/* Enter your username and password
          <LoginForm isCorrectUser={isCorrectUser} loginSubmit={loginSubmit} /> */}
          <button onClick={() => { handleSignIn() }}>Login</button>
        </div>
      </div>
    </div>
  )
}
export default Login