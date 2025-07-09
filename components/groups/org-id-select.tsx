import { FC, useState } from "react";
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  IconButton,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useOrgIds, useCreateOrgId } from "@/hooks/org.query.hook";
import { DeviceDto, GroupResponseDto } from "@/api/src";
import { useMutateDevice } from "@/hooks/device.query.hook";

interface OrgIdSelectProps {
  device: DeviceDto;
  orgUID?: number;
  editable?: boolean;
  groupsData?: GroupResponseDto;
}

const OrgIdSelect: FC<OrgIdSelectProps> = ({ orgUID, editable = true, device, groupsData }) => {
  const { data: orgs, isLoading, refetch: orgIdRefetch } = useOrgIds({ emptyDevice: true });
  const editOrgId = useMutateDevice()
  const createOrgId = useCreateOrgId();

  const [newOrgId, setNewOrgId] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempOrgId, setTempOrgId] = useState<number | null>(orgUID ?? null);

  const handleAdd = () => {
    const parsed = Number(newOrgId);
    if (!parsed || orgs?.some(org => org.orgId === parsed)) return;
    parsed && createOrgId.mutate(parsed, {
      onSuccess: (created) => {
        onSaveEdit(created.orgId);
        setAdding(false);
        setNewOrgId("");
      },
    });
  };

  const onSaveEdit = (orgUID: number | null) => {
    editOrgId.mutate({ deviceId: device.id, data: { orgUID } }, {
      onSuccess: () => orgIdRefetch()
    })
  }

  const handleEditSave = () => {
    onSaveEdit(tempOrgId === -1 ? null : tempOrgId);
    setEditing(false);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setTempOrgId(orgUID ?? null);
  };

  if (isLoading) return <CircularProgress size={20} />;

  return (
    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
      {editing ? (
        <>
          <Select
            size="small"
            value={tempOrgId ?? orgUID ?? -1}
            onChange={(e) => setTempOrgId(Number(e.target.value))}
            sx={{ minWidth: 100, fontSize: '0.875rem' }}
            renderValue={(selected) => {
              if (selected === -1) return "ללא שיוך";
              return selected;
            }}
          >
            <MenuItem value={orgUID} sx={{ display: "none" }}>{orgUID}</MenuItem>
            <MenuItem value={-1}>ללא שיוך</MenuItem>

            {/* Only show orgs with no group parent if device has a parent, otherwise show all */}
            {orgs?.filter(org => device.deviceParentId ? org.group === null : true).map((org, index) => (
              <MenuItem
                key={org.orgId}
                value={org.orgId}
                sx={{
                  borderBottom: index < orgs.length - 1 ? '1px solid #eee' : 'none',
                  py: 1
                }}
              >
                <Box>
                  <Typography variant="body2">{org.orgId}</Typography>
                  {org.group && groupsData?.groups[org.group] && (
                    <Typography variant="caption" color="text.secondary">
                      {groupsData.groups[org.group].name}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton size="small" onClick={handleEditSave} sx={{ p: 0.25 }}>
              <CheckIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" onClick={handleEditCancel} sx={{ p: 0.25 }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </>
      ) : (
        <>
          <Typography variant="body2" fontWeight={600}>
            {orgUID ?? "אין"}
          </Typography>
          {editable && !adding && (
            <IconButton size="small" onClick={() => setEditing(true)} sx={{ p: 0.25 }}>
              <EditIcon fontSize="inherit" />
            </IconButton>
          )}
        </>
      )}

      {editable && adding && !editing && (
        <Box display="flex" alignItems="center" gap={0.5}>
          <TextField
            size="small"
            value={newOrgId}
            onChange={(e) => {
              const raw = e.target.value;
              const numeric = raw.replace(/\D/g, ""); // keep only digits

              // Keep a single "0", but prevent leading zeros in multi-digit numbers
              const cleaned = numeric.length > 1 ? numeric.replace(/^0+/, "") : numeric;

              setNewOrgId(cleaned);
            }}
            placeholder="הכנס מספר"
            sx={{ width: 120 }}
            inputProps={{
              style: { fontSize: '0.875rem' },
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            error={!!newOrgId && !/^\d+$/.test(newOrgId)}
          />

          <IconButton size="small" onClick={handleAdd} disabled={!newOrgId} sx={{ p: 0.25 }}>
            <CheckIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setAdding(false);
              setNewOrgId("");
            }}
            sx={{ p: 0.25 }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      )}

      {editable && !editing && !adding && (
        <IconButton size="small" onClick={() => setAdding(true)} sx={{ p: 0.25 }}>
          <AddIcon fontSize="inherit" />
        </IconButton>
      )}
    </Stack>
  );
};

export default OrgIdSelect;
