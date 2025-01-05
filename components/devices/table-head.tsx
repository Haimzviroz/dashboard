import { TableHead, TableRow, TableCell, Checkbox } from "@mui/material";
import { FC } from "react"

interface DevicesHeadProps {
}

const DevicesHead: FC<DevicesHeadProps> = () => {
  return (
    <TableHead>
      <TableRow sx={{ height: 3 }}>
        <TableCell width={160} sx={{ padding: 0 }}>
          <Checkbox></Checkbox>
          מספר צ
        </TableCell>
        <TableCell width={160} sx={{ padding: 0}}>מערכת הפעלה</TableCell>
        {/* <TableCell width={130} sx={{ padding: 0 }}>אמצעי</TableCell> */}
        {/* <TableCell width={130} sx={{ padding: 0 }}>יחידה</TableCell> */}
        <TableCell width={130} sx={{ padding: 0 }}>חיבור לרשת</TableCell>
        <TableCell width={130} sx={{ padding: 0 }}>מצב סוללה</TableCell>
        <TableCell width={130} sx={{ padding: 0 }}>זיכרון פנוי</TableCell>
      </TableRow>
    </TableHead>
  )
}

export default DevicesHead;