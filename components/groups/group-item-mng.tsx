import { Box, Card, CardContent, Icon, Stack, Typography } from "@mui/material"
import { FC } from "react"
import { Group } from "@/types/interfaces/devices";
import GroupIcon from "../../assets/groups/users-group.svg";
import GroupParentIcon from "../../assets/groups/users.svg";
import { GroupResponseDto } from "@/api/src";

interface GroupItemMngProps {
  group: Group,
  groupsData?: GroupResponseDto
  type?: "parent" | "child"
}

const GroupItemMng: FC<GroupItemMngProps> = ({ group, groupsData, type }) => {

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
          <Stack direction={"row"} gap={1} >
            <Icon>
              {type && type === "parent" ?
                <GroupParentIcon />
                : <GroupIcon />
              }
            </Icon>
            <Typography>{group.name}</Typography>
          </Stack>
        </CardContent>
      </Box>
    </Card >
  )
}

export default GroupItemMng;