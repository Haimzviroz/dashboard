import { TableRow, TableCell, TableBody, Checkbox, Typography } from "@mui/material";
import { FC } from "react"
import NoDevice from "../../assets/publish-modal/no deivices.svg";
import { useRouter } from "next/router";
import { Device } from "@/types/interfaces/devices";

interface DevicesBodyProps {
  devices: Device[]
}

const DevicesBody: FC<DevicesBodyProps> = ({devices}) => {
 
  const router = useRouter()

  const setRoute = (id: string) => {
    router.push(`/getmap/maps?device=${id}`)
  }

  return (
    <TableBody>
      {
        devices && devices.length > 0 ? devices.map((item, index) =>
          <TableRow key={index} sx={{
            // height: 2,
            '&:hover': {
              backgroundColor: "rgba(136, 177, 246, 0.2)",
            },
          }} onClick={() => { setRoute(item.id) }}>
            <TableCell  width={160} sx={{ padding: 0, width: 160, overflow: "hidden", textOverflow: "ellipsis" }}>
              <Checkbox checked={item.selected}></Checkbox>
              {item.id}
            </TableCell>
            <TableCell width={160} sx={{ padding: 0 }}>{item.OS}</TableCell>
            <TableCell width={132} sx={{ padding: 0 }}>{item.bandwidth}</TableCell>
            <TableCell width={132} sx={{ padding: 0 }}>{item.power}</TableCell>
            <TableCell width={132} sx={{ padding: 0 }}>{item.availableStorage}</TableCell>
          </TableRow>
        ) :
          <TableRow>
            <TableCell colSpan={7} sx={{ padding: 10, border: "none", textAlign: "center" }}>
              <NoDevice />
              <Typography variant="body1">בחר קבוצת אמצעים לעדכון</Typography>
            </TableCell>
          </TableRow>
      }
    </TableBody>
  )
}

export default DevicesBody;