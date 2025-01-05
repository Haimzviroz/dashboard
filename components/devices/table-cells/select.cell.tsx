import { Checkbox } from "@mui/material";
import { FC } from "react";

interface SelectCellProps {
  isSelect?: boolean, 
  onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void
}

const SelectCell: FC<SelectCellProps> = ({ isSelect, onChange }) => {


  return (
    <Checkbox checked={isSelect} onChange={onChange}></Checkbox>
  );
}

export default SelectCell;