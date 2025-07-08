import { FC } from "react";
import { Box, Typography, Stack, Paper, Divider, Icon, IconButton, Tooltip } from "@mui/material";
import { GroupResponseDto } from "@/api/src";
import NoDevices from "../../assets/groups/no-devices.svg";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MutNameCell from "./nut-name.cell";
import { useQ_Device } from "@/hooks/device.query.hook";
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import OrgIdSelect from "./org-id-select";

interface UnitDeviceMngProps {
  deviceId: string;
  groupsData?: GroupResponseDto;
}

const UnitDeviceMng: FC<UnitDeviceMngProps> = ({ deviceId, groupsData }) => {
  const { device } = useQ_Device(deviceId);

  if (!device) return null

  // Find group parent if exists
  const groupParent = device.groupId ? groupsData?.groups[device.groupId] : null;
  // Find device parent if exists
  const deviceParent = device.deviceParentId || null;
  // Related devices (children)
  const relatedDevices = device.devices || [];

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
                // onClick={e => { e.stopPropagation(); setChildInGroupMutation.mutate({ id: device.id, groupId: undefined }) }}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        )}
        {deviceParent && (
          <Paper variant="outlined" sx={{ px: 2, py: 1, borderRadius: 2, background: 'linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Typography variant="body2" color="primary.dark">
              אב: {deviceParent}
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* Middle Section: Device Properties */}
      <Divider sx={{ my: 2 }} />
      <Box mb={2}>
        <Stack spacing={2} alignItems="flex-start" sx={{ mx: 'auto', maxWidth: 400, background: '#f8fafc', borderRadius: 2, p: 2, boxShadow: 1 }}>
          <Stack direction={"row"} alignItems="center" spacing={1} sx={{ mb: 1 }}>
            {/* Device name with edit option */}
            <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 600, color: 'text.secondary' }}>
              שם המכשיר:
            </Typography>
            <MutNameCell deviceId={device.id} name={device.name} editable={true} />
          </Stack>
          {/* UID with edit/add option */}
          <OrgIdSelect
            device={device}
            orgUID={device.uid}
            editable={true}
            groupsData={groupsData}
          />
          {/* Platform name with flag */}
          {device.platformName && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" fontWeight={600} color="success.main" sx={{ border: '1px solid #43a047', borderRadius: 1, px: 1, py: 0.2, background: '#e8f5e9' }}>
                פלטפורמה
              </Typography>
              <Typography variant="body2">{device.platformName}</Typography>
            </Stack>
          )}
          {/* Device type name */}
          {device.deviceTypeName && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ border: '1px solid #1976d2', borderRadius: 1, px: 1, py: 0.2, background: '#e3f2fd' }}>
                סוג אמצעי
              </Typography>
              <Typography variant="body2">{device.deviceTypeName}</Typography>
            </Stack>
          )}
          {/* Only show lastConnectionDate nicely */}
          {device.lastConnectionDate && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" fontWeight={600} color="secondary.main">
                חיבור אחרון:
              </Typography>
              <Typography variant="body2">{new Date(device.lastConnectionDate).toLocaleString('he-IL')}</Typography>
            </Stack>
          )}
          {/* OS line with style and icon */}
          {device.OS && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" fontWeight={600} color="#ad2858" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LaptopMacIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
              </Typography>
              <Typography variant="body2">{device.OS}</Typography>
            </Stack>
          )}
        </Stack>
      </Box>


      {/* Bottom Section: Related Devices */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        אמצעים קשורים
      </Typography>
      {relatedDevices.length > 0 ? (
        <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
          {relatedDevices.map((dvcId: string) => (
            <Paper key={dvcId} variant="outlined" sx={{ px: 2, py: 1, borderRadius: 2 }}>
              <Typography variant="body2">{dvcId}</Typography>
            </Paper>
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
