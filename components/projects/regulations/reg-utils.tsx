import React, { ReactNode } from "react";
import { Box } from "@mui/material";


export const ItemType = 'REGULATION';

export const TableOf = (body: ReactNode, header = false, index?: number) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: ".5fr 2fr 6fr 2fr 1fr 2fr",
      gap: 3,
      alignItems: "center",
      pr: 2,
      pb: header ? 2 : 0,
      pt: header ? 2 : index === 0 ? 0 : 2,
      bgcolor: header ? "#f1f3f5" : "#fff",
      borderTop: !header && index !== 0 ? "1px solid #ddd" : "none",
    }}
  >
    {body}
  </Box>
);

export const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  let oppositeColor = "#";

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);

    // Invert the color: (255 - value)
    const invertedValue = 255 - value;
    oppositeColor += `00${invertedValue.toString(16)}`.slice(-2);
  }

  return { bgcolor: oppositeColor };
}