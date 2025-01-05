import { Container, Dialog } from "@mui/material";
import { Dispatch, FC, ReactNode, SetStateAction } from "react"

interface ModalProps {
  children: ReactNode
  toggle: boolean
  setToggle: Dispatch<SetStateAction<boolean>>
}

const Modal: FC<ModalProps> = ({children, toggle, setToggle }) => {

  return (
    <Dialog open={toggle} maxWidth="xl" onClick={(e) => {e.stopPropagation(),  setToggle(false) }}>
      <Container sx={{ padding: 4, width: "calc(100vw - 100px)", minHeight: "calc(100vh - 135px)" }} onClick={(e)=>{e.stopPropagation()}}>
       {children}
      </Container>
    </Dialog>
  )
}

export default Modal;