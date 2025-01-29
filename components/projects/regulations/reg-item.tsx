import React, { FC, Fragment } from "react";
import { Typography, IconButton, Chip, Stack } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { RegulationDto } from "@/api/src";

interface RegItemProps {
  reg: RegulationDto
}

const RegItem: FC<RegItemProps> = ({ reg }) => {

  return (
    <Fragment>
      <Typography variant="body1">{reg.name}</Typography>
      <Typography variant="body2" color="textSecondary">{reg.description}</Typography>
      <Chip
        label={reg.type.name}
        sx={{
          width: 100,
          // backgroundColor: reg.type === "Type 1" ? "#d1fae5" : "#e0e7ff",
          // color: reg.type === "Type 1" ? "#065f46" : "#3730a3",
          fontWeight: "bold",
        }}
      />
      <Typography textAlign={"center"} variant="body2">{reg.order}</Typography>
      <Stack direction="row" spacing={1}>
        <IconButton sx={{ color: "#1e88e5" }}>
          <Edit />
        </IconButton>
        <IconButton sx={{ color: "#e53935" }}>
          <Delete />
        </IconButton>
      </Stack>
    </Fragment>
  )
};

export default RegItem;