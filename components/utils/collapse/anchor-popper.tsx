import { Box, ClickAwayListener, Grow, Paper, Popper } from "@mui/material";
import { Dispatch, FC, FormEvent, Fragment, MouseEvent, SetStateAction, useState } from "react";

interface AnchorAndPopperProps {
  collapseDisplay: React.ReactNode
  unCollapseDisplay: React.ReactNode,
  onSubmit?: () => void
}

const AnchorAndPopper: FC<AnchorAndPopperProps> = ({ collapseDisplay, unCollapseDisplay, onSubmit }) => {

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Fragment>
      <CollapsedDisplay display={collapseDisplay} setIsFormOpen={setIsFormOpen} setAnchorEl={setAnchorEl} />
      <UnCollapsedDisplay display={unCollapseDisplay} isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} anchorEl={anchorEl} onSubmit={onSubmit} />
    </Fragment>
  );
}

export default AnchorAndPopper;

interface CollapsedDisplayProps {
  display: React.ReactNode
  setIsFormOpen?: Dispatch<SetStateAction<boolean>>
  setAnchorEl?: Dispatch<SetStateAction<HTMLElement | null>>
}

export const CollapsedDisplay: FC<CollapsedDisplayProps> = ({ display, setIsFormOpen, setAnchorEl }) => {

  const handleNameClick = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    e.stopPropagation()
    setIsFormOpen && setIsFormOpen(isFormOpen => !isFormOpen)
    setAnchorEl && setAnchorEl(e.currentTarget)
  }

  return (
    <Box onClick={handleNameClick}>
      {display}
    </Box>
  );
}


interface UnCollapsedDisplayProps {
  display: React.ReactNode
  isFormOpen: boolean
  setIsFormOpen: Dispatch<SetStateAction<boolean>>
  anchorEl: HTMLElement | null,
  onSubmit?: () => void
}

export const UnCollapsedDisplay: FC<UnCollapsedDisplayProps> = ({ display, isFormOpen, setIsFormOpen, anchorEl, onSubmit }) => {
  const innerOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsFormOpen(false)
    onSubmit && onSubmit()
  }

  return (
    <Fragment>
      <Popper
        open={isFormOpen}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper sx={{
              borderRadius: 1.5,
              boxShadow: "0px 8px 32px 0px rgba(6, 28, 49, 0.12);",
              border: "1px solid var(--border-200, rgba(127, 134, 148, 0.16));",
              mt: .5
            }}>
              <ClickAwayListener onClickAway={() => { setIsFormOpen(false) }}>
                <Box component={"span"}>
                  <form onSubmit={innerOnSubmit}>
                    {display}
                  </form>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  )
}

