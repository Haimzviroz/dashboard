import React from "react";
import GroupBar from "./groups.side-bar";
import SearchBar from "./search.side-bar";
import { GroupRes } from "@/types/interfaces/devices";
import GroupSelectionProvider, { useGroupSelection } from "@/providers/group-selection.provider";
import { Box } from "@mui/material";

interface GroupBarSectionProps {
  groupList: GroupRes;
  sideBarCollapse: boolean;
}

const GroupBarSection: React.FC<GroupBarSectionProps> = ({ groupList, sideBarCollapse }) => {
  const { groups: groupsResult } = useGroupSelection()
  const groups = groupList ?? groupsResult

  if (sideBarCollapse && groupList) {
    return <GroupSelectionProvider>
      <Box mt={3}>
      {/* {sideBarCollapse && <SearchBar />} */}
      <GroupBar groupIdList={groups.roots} />
      </Box>
    </GroupSelectionProvider>;
  }
  return null;
};

export default GroupBarSection;
