import { Card, CardContent, Icon, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import { Group } from "@/types/interfaces/devices";
import GroupParentIcon from "../../assets/groups/users.svg";
import { GroupResponseDto } from "@/api/src";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useDrag } from "react-dnd";
import { DND_GROUP_UNIT_ITEM } from "./dnd-constants";
import { SelectedItem } from "../pages/groups-management";

interface GroupItemMngProps {
  group: Group;
  groupsData?: GroupResponseDto;
  type?: "parent" | "child";
  setSelectedGroup: Dispatch<SetStateAction<SelectedItem | undefined>>;
  onRemove?: () => void;
}

const GroupItemMng: FC<GroupItemMngProps> = ({ group, type, setSelectedGroup, onRemove }) => {

  const [, drag] = useDrag({
    type: DND_GROUP_UNIT_ITEM,
    item: group,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <Card
      ref={drag}
      variant="outlined"
      sx={{
        borderRadius: 3,
        my: 1,
        minWidth: 200,
        px: 1.5,
        py: 1,
        background: 'background.paper',
        boxShadow: 1,
        textAlign: 'left',
        cursor: 'pointer',
        mx: 0,
      }}
      onClick={() => setSelectedGroup({ t: "g", item: group })}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon>
              {<GroupParentIcon />}
            </Icon>
            <Stack>
              {type === "parent" && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="bold"
                  lineHeight={1}
                >
                  תחת:
                </Typography>
              )}
              <Typography
                variant="body1"
                color="primary.dark"
                fontWeight={700}
                sx={{ letterSpacing: 0.5 }}
              >
                {group.name}
              </Typography>
            </Stack>
          </Stack>

          <Tooltip title={type === "parent" ? `הסר שיוך מ${group.name}` : "הסר קבוצה מקשורים"}>
            <IconButton size="small" color="error" onClick={handleRemove}>
              <RemoveCircleOutlineIcon fontSize="small" sx={{ fontSize: '0.875rem' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GroupItemMng;
