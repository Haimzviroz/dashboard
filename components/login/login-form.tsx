import { FC, useState } from "react";

import s from '../login/login.module.css'

interface LoginFormProps {
  isCorrectUser: boolean;
  loginSubmit: (username: string, password: string) => void;
}

const LoginForm: FC<LoginFormProps> = ({isCorrectUser, loginSubmit}) => {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")


  const onInputValue = (label: string, e: React.ChangeEvent<HTMLInputElement>) => {

    switch (label) {
      case "username":
        setUsername(e.target.value)
        break;
      case "password":
        setPassword(e.target.value)
        break;
      default:
        break;
    }

  }


  return (
    <div>
      <div className={s.input}>
        <label>username
          <input type={"text"} onChange={(e) => onInputValue("username", e)} />
        </label>
      </div>
      <div className={s.input}>
        <label>password
          <input type={"password"} onChange={(e) => onInputValue("password", e)} />
        </label>
      </div>
      <div>
        <button onClick={() => { loginSubmit(username, password) }}>login</button>
      </div>
      {!isCorrectUser && <div>username or password are incorrect</div>}
    </div>
  )

}

export default LoginForm