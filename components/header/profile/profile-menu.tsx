import { ClickAwayListener, Divider, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import { Dispatch, FC, Fragment, MutableRefObject, Ref, RefObject, SetStateAction, forwardRef, useEffect } from "react";
import ProfileName from "./profile-name";
import React from "react";
import { handleSignOut } from "@/apis/client-side/login.api";

interface ProfileMenuProps {
  isMenuOpen: boolean
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
  anchorEl: HTMLElement | null
}

const ProfileMenu: FC<ProfileMenuProps> = ({ isMenuOpen, setIsMenuOpen, anchorEl }) => {

  return (
    <Fragment>
      <Popper
        open={isMenuOpen}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 1100 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper sx={{
              width: 250,
              borderRadius: 1.5,
              boxShadow: "0px 8px 32px 0px rgba(6, 28, 49, 0.12);",
              border: "1px solid var(--border-200, rgba(127, 134, 148, 0.16));",
              mt: .5
            }}>
              <ClickAwayListener onClickAway={() => { setIsMenuOpen(false) }}>
                <MenuList sx={{ p: 1.5 }}>
                  <MenuItem sx={{ width: "100%" }}><ProfileName /></MenuItem>
                  <Divider />
                  <MenuItem sx={{ width: "100%" }} onClick={() => handleSignOut()}>יציאה</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  )
}

export default ProfileMenu