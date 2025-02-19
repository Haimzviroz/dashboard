import React, { FC, useRef } from "react";
import { Box } from "@mui/material";
import { RegulationDto } from "@/api/src";
import { useDrop } from "react-dnd";
import { ItemType } from "./reg-utils";

interface RegBetItemProps {
  reg: RegulationDto;
  index: number;
  moveOrder: (itemIndex: number, item: RegulationDto) => void
}

const RegBetItem: FC<RegBetItemProps> = ({ reg, index, moveOrder }) => {
  const ref = useRef<HTMLElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemType,
    canDrop: (item: RegulationDto & { index: number }) => item.name !== reg.name && item.index != index + 1,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.getItem()?.name !== reg.name && monitor.getItem()?.index != index + 1
    }),
    drop(item) {      
      if (item.index < index) {
        console.log(index);
        moveOrder(index, item)
      } else {
        console.log(index + 1);
        moveOrder(index + 1, item)
      }
    },
  });

  drop(ref);

  return (
    <Box
      ref={ref}
      sx={{
        minHeight: 10, // Ensures the box is always rendered
        height: isOver && canDrop ? 50 : 16, // Expands when hovered
        transition: "height 0.2s ease-in-out", // Smooth animation
        border: "none",
        borderTop: isOver && canDrop ? "1px solid #ddd" : "none",
        borderBottom: isOver && canDrop && index === -1 ? "1px solid #ddd" : "none",
      }}
    />
  );
};


export default RegBetItem;