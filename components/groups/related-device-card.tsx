import { Dispatch, FC, SetStateAction } from "react";
import { Paper, Typography } from "@mui/material";
import { useQ_Device } from "@/hooks/device.query.hook";
import { SelectedItem } from "../pages/groups-management";

interface RelatedDeviceCardProps {
  deviceId: string;
  setSelectedDevice: Dispatch<SetStateAction<SelectedItem | undefined>>
}

const RelatedDeviceCard: FC<RelatedDeviceCardProps> = ({ deviceId, setSelectedDevice }) => {
  const { device } = useQ_Device(deviceId);

  const handleSelect = () => {
    if (device) {
      setSelectedDevice({ t: "d", item: device });
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ px: 1.5, py: 1, borderRadius: 2, minWidth: 170, maxWidth: 220, boxShadow: 1, background: '#f7fafd', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4, background: '#e3f2fd' } }}
      onClick={handleSelect}
    >
      <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1976d2', mb: 0.5 }}>
        {device?.name || device?.uid || deviceId}
      </Typography>
      {device ? (
        <>
          {device.uid && (
            <Typography variant="caption" sx={{ color: '#0288d1', fontWeight: 600 }}>
              מזהה ארגון: {device.uid}
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
      ) : (
        <Typography variant="caption" sx={{ color: '#bdbdbd', fontWeight: 600 }}>
          מזהה: {deviceId}
        </Typography>
      )}
    </Paper>
  );
};

export default RelatedDeviceCard;
