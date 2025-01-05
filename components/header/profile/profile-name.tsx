import O_IconButton from "@/ui/o-icon-button";
import { Avatar, Box, ClickAwayListener, Fade, Grow, MenuItem, MenuList, Paper, Popper, Stack, Typography } from "@mui/material";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Dispatch, FC, Fragment, MouseEvent, Ref, SetStateAction, forwardRef, useEffect, useRef, useState } from "react";

interface ProfileNameProps {
  shortOnly?: boolean
  setIsMenuOpen?: Dispatch<SetStateAction<boolean>>
  setAnchorEl?: Dispatch<SetStateAction<HTMLElement | null>>
}

const ProfileName: FC<ProfileNameProps> = ({ shortOnly, setIsMenuOpen, setAnchorEl }) => {

  const { data: session, status } = useSession()
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    !name && session && setName(extractAcronyms(session))
  }, [session])

  const handleProfileClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    setIsMenuOpen && setIsMenuOpen(isMenuOpen => !isMenuOpen)
    setAnchorEl && setAnchorEl(e.currentTarget)
  }

  const extractAcronyms = (user: Session) => {
    const fullName = user.user?.name
    if (fullName) {
      const splitName = fullName.split(" ");
      const firstName = splitName[0].charAt(0)
      const lastName = splitName[splitName.length - 1].charAt(0)
      return firstName + lastName
    }
    return null
  }
  return (
    <Fragment>
      <O_IconButton onClick={(e) => { handleProfileClick(e) }}>
        <Avatar sx={{ bgcolor: "#EA9010", width: 32, height: 32 }}>{name && name}</Avatar>
      </O_IconButton>
      {!shortOnly && <Stack alignItems={"start"} px={.5}>
        <Typography variant="body1" fontWeight={700} >{session?.user?.name}</Typography>
        <Typography variant="body2" color={"#7F8694"}>{session?.user?.email}</Typography>
      </Stack>}
    </Fragment>
  )
}

export default ProfileName;