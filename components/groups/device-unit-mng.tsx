import { Dispatch, FC, SetStateAction } from "react";
import { Box, Typography, Stack, Paper, Divider, Icon, IconButton, Tooltip } from "@mui/material";
import { GroupResponseDto } from "@/api/src";
import { SelectedItem } from "../pages/groups-management";
import NoDevices from "../../assets/groups/no-devices.svg";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MutNameCell from "./device-mut-name";
import { useMutateDevice, useQ_Device } from "@/hooks/device.query.hook";
import OrgIdSelect from "./device-org-id-select";
import RelatedDeviceCard from "./device-item-mng";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"


interface UnitDeviceMngProps {
  deviceId: string;
  groupsData?: GroupResponseDto;
  setSelectedDevice: Dispatch<SetStateAction<SelectedItem | undefined>>
}

const UnitDeviceMng: FC<UnitDeviceMngProps> = ({ deviceId, groupsData, setSelectedDevice }) => {
  const { device } = useQ_Device(deviceId);
  const mutDevice = useMutateDevice()

  if (!device) return null

  // Find group parent if exists
  const groupParent = device.groupId ? groupsData?.groups[device.groupId] : null;
  // Find device parent if exists
  const deviceParent = device.deviceParentId || null;
  // Related devices (children)
  const relatedDevices = device.devices || [];


  const handleRmDevice = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutDevice.mutate({ deviceId, data: { groupId: null } })

  }

  return (
    <Box sx={{ flexGrow: 1, textAlign: "center", px: 2, py: 4 }}>
      {/* Top Section */}
      <Stack spacing={2} alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
          {device.name
            ? (/[\u0590-\u05FF]/.test(device.name) && /[a-zA-Z]/.test(device.name) && device.name.includes(' ')
              ? device.name.split(' ').map((part, i) => <span key={i}>{part}<br /></span>)
              : device.name)
            : device.uid || <span>{'\u200F#'}{device.id?.slice(-4)}</span>}
        </Typography>

        {(groupParent || deviceParent) &&
          <ArrowDownwardIcon
            sx={{
              fontSize: 32,
              color: "primary.main",
              mb: -1,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
              background: 'white',
              borderRadius: '50%',
              border: '2px solid #e0e0e0',
              p: 0.5
            }}
          />}

        {groupParent && (
          <Paper
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: '1.5px solid #b0bec5',
              textAlign: 'center',
              width: 'fit-content',
              mx: 'auto',
              boxShadow: 2,
              cursor: 'pointer'
            }}
            onClick={() => groupParent && groupsData && groupsData.groups && groupsData.groups[groupParent.id] && window.dispatchEvent(new CustomEvent('selectGroup', { detail: groupParent }))}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography variant="body2" color="primary.dark">
                קבוצה: {groupParent.name}
              </Typography>
              <Tooltip title={`הסר שיוך מ${groupParent.name}`}>
                <IconButton size="small" color="error"
                  onClick={handleRmDevice}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        )}
        {deviceParent && (
          <RelatedDeviceCard deviceId={deviceParent} setSelectedDevice={setSelectedDevice} />
        )}
      </Stack>

      {/* Middle Section: Device Properties */}
      <Divider sx={{ my: 2 }} />
      <Paper elevation={4} sx={{ mb: 2, mx: 'auto', maxWidth: 480, borderRadius: 3, background: '#fafbfc', boxShadow: 6, p: 0 }}>
        <Stack spacing={2} alignItems="stretch" sx={{ p: 3 }}>
          {/* Device Name */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight={700} sx={{ minWidth: 120, color: '#1565c0', letterSpacing: 0.5, px: 1.5, py: 0.5, borderRadius: 2, background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)', boxShadow: 1, border: '1px solid #bbdefb', display: 'inline-block' }}>
              שם המכשיר:
            </Typography>
            <MutNameCell deviceId={device.id} name={device.name} editable={true} />
          </Stack>
          {/* Org ID */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight={700} sx={{ minWidth: 120, color: '#0277bd', letterSpacing: 0.5, px: 1.5, py: 0.5, borderRadius: 2, background: 'linear-gradient(90deg, #e1f5fe 60%, #fff 100%)', boxShadow: 1, border: '1px solid #b3e5fc', display: 'inline-block' }}>
              {`מספר צ':`}
            </Typography>
            <OrgIdSelect
              device={device}
              orgUID={device.uid}
              editable={true}
              groupsData={groupsData}
            />
          </Stack>
          {/* Platform */}
          {device.platformName && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" fontWeight={700} sx={{ minWidth: 120, color: '#2e7d32', letterSpacing: 0.5, px: 1.5, py: 0.5, borderRadius: 2, background: 'linear-gradient(90deg, #e8f5e9 60%, #fff 100%)', boxShadow: 1, border: '1px solid #c8e6c9', display: 'inline-block' }}>
                פלטפורמה:
              </Typography>
              <Typography variant="body2">{device.platformName}</Typography>
            </Stack>
          )}
          {/* Device Type */}
          {device.deviceTypeName && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" fontWeight={700} sx={{ minWidth: 120, color: '#4527a0', letterSpacing: 0.5, px: 1.5, py: 0.5, borderRadius: 2, background: 'linear-gradient(90deg, #ede7f6 60%, #fff 100%)', boxShadow: 1, border: '1px solid #d1c4e9', display: 'inline-block' }}>
                סוג אמצעי:
              </Typography>
              <Typography variant="body2">{device.deviceTypeName}</Typography>
            </Stack>
          )}
          {/* Last Connection */}
          {device.lastConnectionDate && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" fontWeight={700} sx={{ minWidth: 120, color: '#ad1457', letterSpacing: 0.5, px: 1.5, py: 0.5, borderRadius: 2, background: 'linear-gradient(90deg, #fce4ec 60%, #fff 100%)', boxShadow: 1, border: '1px solid #f8bbd0', display: 'inline-block' }}>
                חיבור אחרון:
              </Typography>
              <Typography variant="body2">{new Date(device.lastConnectionDate).toLocaleString('he-IL')}</Typography>
            </Stack>
          )}
          {/* OS */}
          {device.OS && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" fontWeight={700} sx={{ minWidth: 120, color: '#b71c1c', letterSpacing: 0.5, px: 1.5, py: 0.5, borderRadius: 2, background: 'linear-gradient(90deg, #ffebee 60%, #fff 100%)', boxShadow: 1, border: '1px solid #ffcdd2', display: 'inline-block' }}>
                מערכת הפעלה:
              </Typography>
              <Typography variant="body2">{device.OS}</Typography>
            </Stack>
          )}
        </Stack>
      </Paper>


      {/* Bottom Section: Related Devices */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        אמצעים קשורים
      </Typography>
      {relatedDevices.length > 0 ? (
        <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
          {relatedDevices.map((dvcId: string) => (
            <RelatedDeviceCard key={dvcId} deviceId={dvcId} setSelectedDevice={setSelectedDevice} />
          ))}
        </Stack>
      ) : (
        <Box p={3}>
          <Stack alignItems="center" spacing={1}>
            <Icon sx={{ width: 120, height: 90, alignSelf: "center" }}><NoDevices /></Icon>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              לא קיימים אמצעים קשורים
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default UnitDeviceMng;
