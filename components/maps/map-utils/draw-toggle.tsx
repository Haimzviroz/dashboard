import { ToggleButton, ToggleButtonGroup, Typography, styled } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import Control from "react-leaflet-custom-control";

import Move from '../../../assets/maps/move.svg'
import MoveWhite from '../../../assets/maps/move-white.svg'
import Draw from '../../../assets/maps/polygon.svg'
import DrawWhite from '../../../assets/maps/polygon-white.svg'
import { MapPurpose } from "@/types/interfaces";

interface DrawToggleProps {
  purpose: MapPurpose
  setPurpose: Dispatch<SetStateAction<MapPurpose>>
}

const DrawToggle: FC<DrawToggleProps> = ({ purpose, setPurpose }) => {

  const T_Button = styled(ToggleButton)({
    border: "none",
    borderRadius: 2,
    padding: "2px 16px",
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white",
      backgroundColor: '#2979FF',
    }
  });


  const handlePurpose = (
    event: React.MouseEvent<HTMLElement>,
    newPurpose: MapPurpose,
  ) => {
    setPurpose(newPurpose);
  };

  return (
    <Control position="topleft">
      <ToggleButtonGroup
        value={purpose}
        exclusive
        onChange={handlePurpose}
        sx={{ bgcolor: "#FFF", padding: 1, borderRadius: 2, gap: .5 }}

      >
        <T_Button value={"draw"} disabled={purpose == "draw"}>
          {purpose == "draw" ? <DrawWhite /> : <Draw />}
          <Typography variant="body1" paddingLeft={.5}>סימון</Typography>
        </T_Button>
        <T_Button value={"nav"} disabled={purpose == "nav"}>
          {purpose == "nav" ? <MoveWhite /> : <Move />}
          <Typography variant="body1" paddingLeft={.5}>ניווט</Typography>
        </T_Button>
      </ToggleButtonGroup>
    </Control>
  );
}

export default DrawToggle;