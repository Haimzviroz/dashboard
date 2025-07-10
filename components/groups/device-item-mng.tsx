import { Dispatch, FC, SetStateAction } from "react";
import { IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useQ_Device } from "@/hooks/device.query.hook";
import { SelectedItem } from "../pages/groups-management";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


interface RelatedDeviceCardProps {
  deviceId: string;
  setSelectedDevice: Dispatch<SetStateAction<SelectedItem | undefined>>;
  removable?: boolean;
  onRemove?: () => void;
}

const RelatedDeviceCard: FC<RelatedDeviceCardProps> = ({ deviceId, setSelectedDevice, removable, onRemove }) => {
  const { device } = useQ_Device(deviceId);



  const handleSelect = () => {
    if (device) {
      setSelectedDevice({ t: "d", item: device });
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (removable && onRemove) {
      onRemove();
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ px: 1.5, py: 1, borderRadius: 2, minWidth: 170, maxWidth: 220, boxShadow: 1, background: '#f7fafd', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4, background: '#e3f2fd' } }}
      onClick={handleSelect}
    >
      <Stack direction={"row"} justifyContent={"space-between"} flexGrow={1} width="100%" alignItems="baseline">
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1976d2', mb: 0.5 }}>
          {device?.name || device?.uid || (deviceId?.length > 4 ? `#${deviceId.slice(-4)}` : `#${deviceId}`)}
        </Typography>
        {removable && (
          <Tooltip title="בחר מכשיר">
            <IconButton size="small" color="error" onClick={handleRemove}>
              <RemoveCircleOutlineIcon fontSize="small" sx={{ fontSize: '0.875rem' }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      {device && (
        <>
          {device.uid && (
            <Typography variant="caption" sx={{ color: '#0288d1', fontWeight: 600 }}>
              {`מספר צ': ${device.uid}`}
            </Typography>
          )}
          {device.platformName && (
            <Typography variant="caption" sx={{ color: '#388e3c', fontWeight: 600 }}>
              פלטפורמה: {device.platformName}
            </Typography>
          )}
          {device.deviceTypeName && (
            <Typography variant="caption" sx={{ color: '#512da8', fontWeight: 600 }}>
              סוג: {device.deviceTypeName}
            </Typography>
          )}
          {device.lastConnectionDate && (
            <Typography variant="caption" sx={{ color: '#ad1457', fontWeight: 600 }}>
              חיבור: {new Date(device.lastConnectionDate).toLocaleDateString('he-IL')}
            </Typography>
          )}
          {device.OS && (
            <Typography variant="caption" sx={{ color: '#b71c1c', fontWeight: 600 }}>
              מערכת: {device.OS}
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

export default RelatedDeviceCard;
