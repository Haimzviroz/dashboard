import { Box, Typography } from "@mui/material";
import { FC, Fragment } from "react";
import TextCell from "./text.cell";

interface DateTimeCellProps {
  date: string | undefined
}

const DateTimeCell: FC<DateTimeCellProps> = ({ date }) => {
  const getDateFormat = () => {
    if (date) {
      const dateObj = new Date(date)
      return `${dateObj.getHours()}:${getNumberFormat(dateObj.getMinutes())} ${getNumberFormat(dateObj.getDate())}/${getNumberFormat(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`
    }
    return "- - / - - / - -"
  }

  const getNumberFormat = (n: number) => {
    if (n > 9) return n;
    return '0' + n
  }


  return (
    <TextCell text={getDateFormat()} />
  );
}

export default DateTimeCell;