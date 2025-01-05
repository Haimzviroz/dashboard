import { Box, Card, CardContent, Icon, Stack, SxProps, Typography } from "@mui/material";
import { Dispatch, FC, ReactNode, SetStateAction } from "react";

export enum InfoItemName {
  distItem = "distItem",
  count = "count",
  updated = "updated",
  onUpdateProcess = "onUpdateProcess",
  error = "updateError"
}


export interface InfoItemProps {
  name: InfoItemName
  caption: string
  value: number | string | ReactNode,
  icon: ReactNode,
  cardSx?: SxProps,
  disabled?: boolean
}

export interface DeviceInfoItemProps {
  item: InfoItemProps,
  activeItem: InfoItemName | undefined
  setActive: Dispatch<SetStateAction<InfoItemName | undefined>>
}

const DeviceInfoItem: FC<DeviceInfoItemProps> = ({ item, activeItem, setActive }) => {
  const onClickItem = () => {
    if (activeItem == item.name) {
      setActive(undefined)
    } else {
      setActive(item.name)
    }
  }

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 2, minWidth: 200, ...item.cardSx }}>
      <Box onClick={() => !item.disabled ? onClickItem() : () => { }}>
        <CardContent sx={{ padding: 1 }}>
          <Stack direction={"row"} gap={2}>
            <Icon>
              {item.icon}
            </Icon>
            <Typography variant="body1">{item.caption}</Typography>
          </Stack>
        </CardContent>
        <CardContent sx={{ paddingY: 0 }}>
          {typeof item.value === "string" || typeof item.value === "number" ? (
            <Typography variant="h3" align="center" fontWeight={700} fontSize={typeof item.value === "number" ? 48 : 26}>
              {item.value}
            </Typography>
          ) : (
            item.value
          )}
        </CardContent>
      </Box>
    </Card>
  );
}

export default DeviceInfoItem;