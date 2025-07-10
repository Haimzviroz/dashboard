import { Box, Card, CardContent, Icon, Stack, SxProps, Typography } from "@mui/material"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import GroupIcon from "../../assets/side-bar/group.svg";
import { DeviceDto } from "@/api/src";
import { SelectedItem } from "../pages/groups-management";
import { useQ_Device } from "@/hooks/device.query.hook";

interface DeviceItemProps {
  device: DeviceDto,
  selectedDevice: SelectedItem | undefined
  setSelectedDevice: Dispatch<SetStateAction<SelectedItem | undefined>>
}

const boxStyle: SxProps = {
  border: 1,
  borderColor: "#DBE1EC",
  borderRadius: 2,
  my: 1,
  padding: 2,
  marginRight: .5,
  width: 300,
  cursor: "pointer"
}

const DeviceParentLabel: FC<{ parentId: string }> = ({ parentId }) => {
  const { device } = useQ_Device(parentId);
  const idDisplay = parentId?.length > 4 ? `#${parentId.slice(-4)}` : `#${parentId}`;

  if (!device) {
    return (
      <Typography variant="caption" color="secondary" sx={{ fontWeight: 600, bgcolor: '#fce4ec', px: 1, borderRadius: 1, ml: 'auto' }}>
        {`משויך למכשיר '${idDisplay}'`}
      </Typography>
    );
  }

  const displayName = device.name || device.uid || (idDisplay);

  return (
    <Typography variant="caption" color="secondary" sx={{ fontWeight: 600, bgcolor: '#fce4ec', px: 1, borderRadius: 1, ml: 'auto' }}>
      {`משויך למכשיר '${displayName}'`}
    </Typography>
  );
};

const DeviceItem: FC<DeviceItemProps> = ({ device, selectedDevice, setSelectedDevice }) => {
  // Prefer name, then uid, then id (last 4 chars if no name/uid)
  let displayName = device.name || device.uid || (device.id?.length > 4 ? device.id.slice(-4) : device.id);


  // Determine parent label (Hebrew, left side)
  let parentLabel = null;
  if (device.groupId && device.groupName) {
    parentLabel = (
      <Typography variant="caption" color="primary" sx={{ fontWeight: 600, bgcolor: '#e3f2fd', px: 1, borderRadius: 1, ml: 'auto' }}>
        {`משויך לקבוצת '${device.groupName}'`}
      </Typography>
    );
  } else if (device.deviceParentId) {
    parentLabel = <DeviceParentLabel parentId={device.deviceParentId} />;
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        my: 1,
        backgroundColor: selectedDevice?.item.id === device.id ? '#e0f7fa' : 'white',
        cursor: 'pointer',
        borderColor: selectedDevice?.item?.id === device.id ? '#00acc1' : 'rgba(0, 0, 0, 0.12)',
      }}
    >
      <Box onClick={() => setSelectedDevice({ t: "d", item: device })}>
        <CardContent>
          <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" gap={1} alignItems="center">
              <Icon>
                <GroupIcon />
              </Icon>
              <Typography>{displayName}</Typography>
            </Stack>
            {parentLabel}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  )
}

export default DeviceItem;