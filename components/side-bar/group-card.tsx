import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { ListItem, ListItemIcon, ListItemText, SxProps } from "@mui/material";

import GroupIcon from "../../assets/side-bar/group.svg";
import ArrowDown from "../../assets/arrows/single-arrow-down.svg";
import ArrowLeft from "../../assets/arrows/single-arrow-Left.svg";
import O_IconButton from "@/ui/o-icon-button";
import { Group } from "@/types/interfaces/devices";
import { useGroupSelection } from "@/providers/group-selection.provider";

interface GroupCardProps {
  group: Group,
  isCollapse: boolean,
  setIsCollapse: Dispatch<SetStateAction<boolean>>
}

const sListItemIcon: SxProps = {
  minWidth: 0,
  width: 16,
  margin: .5
}

const GroupCard: FC<GroupCardProps> = ({ group, isCollapse, setIsCollapse }) => {  

  const [isSelected, setIsSelected] = useState(false)

  const { setGroupInSelectedGroup, selectedGroup } = useGroupSelection()  
  
  useEffect(() => {
    if (selectedGroup.find(g => g === group.id)) {
      setIsSelected(true)
    } else {
      setIsSelected(false)
    }
  }, [selectedGroup])

  const onClickGroup = () => {
    setGroupInSelectedGroup(group)
  }

  return (
    <ListItem
      sx={{
        padding: 0,
        borderRadius: '8px',
        backgroundColor: isSelected ? '#0000000A' : 'transparent',  // Highlight if selected
        '&:hover': {
          backgroundColor: 'lightgray',  // Hover effect
        },
      }}>
      <O_IconButton onClick={() => { setIsCollapse(!isCollapse) }}>
        <ListItemIcon sx={sListItemIcon}>
          {group.groups && group.groups.length > 0 && (isCollapse ? <ArrowDown /> : <ArrowLeft />)}
        </ListItemIcon>
      </O_IconButton>
      <ListItemIcon sx={sListItemIcon}><GroupIcon /></ListItemIcon>
      <ListItemText onClick={onClickGroup} sx={{ marginX: .5 }}>{group.name}</ListItemText>
    </ListItem>
  )
}

export default GroupCard;