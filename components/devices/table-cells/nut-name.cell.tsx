import O_IconButton from "@/ui/o-icon-button";
import { Box, Button, FormControl, FormHelperText, Icon, Input, Stack, Typography } from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import SettingDots from "../../../assets/inputs/dots-vertical.svg"
import Writing from "../../../assets/inputs/writing.svg"
import { useMutateDeviceName } from "@/hooks/device.query.hook";
import AnchorAndPopper from "@/components/utils/collapse/anchor-popper";

interface NameCellProps {
  name?: string
  deviceId: string
  mapId?: string
}

const MutNameCell: FC<NameCellProps> = ({ name, deviceId, mapId }) => {

  const [updatedName, setUpdatedName] = useState<string | undefined>(name ?? "")
  const mutation = useMutateDeviceName(mapId)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedName(e.target.value)
  }


  const handleUpdateName = async (name: string) => {
    mutation.mutate({ deviceId, name })
  }

  const collapseDisplay = () => {
    return (
      <Box >
        {name ?
          <Stack direction={"row"} gap={1} justifyContent={"flex-start"}>
            <O_IconButton>
              <Icon>
                <SettingDots />
              </Icon>
            </O_IconButton>
            <Typography variant="body1">{name}</Typography>
          </Stack>
          :
          <Button variant="outlined" >
            <Stack direction={"row"} gap={1} alignItems={"center"}>
              <Writing />
              <Typography variant="button">{"הזן שם"}</Typography>
            </Stack>
          </Button>}
      </Box>
    )
  }

  const unCollapseDisplay = () => {
    return (
      <FormControl size="small" variant="filled" sx={{ p: 1 }}>
        <FormHelperText variant="standard" sx={{ fontSize: 16, fontWeight: 400 }}>{"באפשרותך לעדכן שם למכשיר"}</FormHelperText>
        <Input
          autoFocus
          value={updatedName}
          placeholder={"הזן שם"}
          onChange={handleInputChange}
          sx={{
            borderRadius: 2,
            backgroundColor: "#0001",
            '&.MuiInput-root:before': { content: "none" },
            '&.MuiInput-root:after': { content: "none" },
            '&.MuiInput-root': { pt: 0, px: .6 },
          }}
        />
        <Box display={"flex"} justifyContent={"flex-end"} mt={1}>
          <Button
            variant="contained"
            type="submit"
            disabled={name == updatedName}
            sx={{ width: "fit-content", lineHeight: 1 }}>שלח</Button>
        </Box>
      </FormControl>
    )
  }
  const onSubmit = () => {
    handleUpdateName(updatedName ?? "")
  }

  return <AnchorAndPopper collapseDisplay={collapseDisplay()} unCollapseDisplay={unCollapseDisplay()} onSubmit={onSubmit} />
}

export default MutNameCell;
