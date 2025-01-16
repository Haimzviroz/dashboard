import Popup from "@/ui/popup";
import { FC, Fragment, useState } from "react"

import s from '../../styles/management-project.module.css';

interface TokensProps {
  token: string,
}

const Tokens: FC<TokensProps> = ({ token }) => {
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const [copiedMes, setCopiedMes] = useState<boolean>(false)

  const copyHandler = () => {
    try {
      navigator.clipboard.writeText(token)
    } catch (error) {
      console.error(error);  
    }
    
    setCopiedMes(true)
    setTimeout(() => {
      setCopiedMes(false)
    }, 1000)
  }

  const getToken = () => {
    if (isFocus) {
      return <textarea onBlur={() => { setIsFocus(false) }} autoFocus className={s.token}>{token}</textarea>
    }
    return (
      <Fragment>
        <div onClick={() => setIsFocus(true)} className={s.token}>{token}</div>
        <div>
          <button
            className={`${s.button} ${s["edit-button"]}`}
            onClick={() => { copyHandler() }}>copy</button>
          {copiedMes && <Popup body="copied" style={{ bottom: "60px", left: "40px" }} ></Popup>}
        </div>
      </Fragment>
    )
  }

  return (
    <div className={`${s["token-wrap"]} ${s["item-wrap"]}`}>
      {getToken()}
    </div>

  )
}

export default Tokens