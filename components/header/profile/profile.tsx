import O_IconButton from "@/ui/o-icon-button";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import ProfileName from "./profile-name";
import ProfileMenu from "./profile-menu";

const Profile: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Fragment>
      <ProfileName setAnchorEl={setAnchorEl} setIsMenuOpen={setIsMenuOpen} shortOnly={true} />
      <ProfileMenu anchorEl={anchorEl} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </Fragment>
  )
}

export default Profile;