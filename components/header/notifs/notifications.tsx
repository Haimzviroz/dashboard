import { Icon } from "@mui/material";
import { Fragment } from "react";
import Bell from '../../../assets/logos/bell.svg'

const Notification = ({}) => {
  return (
    <Fragment>
      <Icon>
        <Bell/>
      </Icon>
    </Fragment>
  );
}

export default Notification;