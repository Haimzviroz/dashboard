import { Box, Card, CardContent, Icon, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import { FC } from "react"
import { Group } from "@/types/interfaces/devices";
import GroupIcon from "../../assets/groups/users-group.svg";
import GroupParentIcon from "../../assets/groups/users.svg";
import { GroupResponseDto } from "@/api/src";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useSetChildInGroup } from "@/hooks/group.query.hook";

interface GroupItemMngProps {
  group: Group,
  groupsData?: GroupResponseDto
  type?: "parent" | "child"
}

const GroupItemMng: FC<GroupItemMngProps> = ({ group, groupsData, type }) => {
  const setChildInGroupMutation = useSetChildInGroup();

  // Remove group from parent handler
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChildInGroupMutation.mutate({ id: group.id, parent: null });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        my: 1,
        minWidth: 200
      }}
    >
      <Box>
        <CardContent >
          <Stack direction={"row"} gap={1} alignItems="center" justifyContent={"space-between"}>

            <Stack direction={"row"} gap={1} alignItems="center">
              <Icon>
                {type && type === "parent" ?
                  <GroupParentIcon />
                  : <GroupIcon />
                }
              </Icon>
              <Typography>{group.name}</Typography>
            </Stack>
            <Tooltip title="הסר קבוצה מקשורים">
              <IconButton size="small" color="error" onClick={handleRemove}>
                <RemoveCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </Box>
    </Card >
  )
}

export default GroupItemMng;