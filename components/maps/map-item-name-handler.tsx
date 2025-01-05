import O_IconButton from "@/ui/o-icon-button";
import { Box, Button, FormControl, FormHelperText, Icon, Input } from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import SettingDots from "../../assets/inputs/dots-vertical.svg"
import AnchorAndPopper from "@/components/utils/collapse/anchor-popper";
import { useMutateMapName } from "@/hooks/maps.query.hook";
import { useRouter } from "next/router";

interface MapNameHandlerProps {
  name: string
  mapId: string
}

const MapNameHandler: FC<MapNameHandlerProps> = ({ name, mapId }) => {

  const [updatedName, setUpdatedName] = useState<string | undefined>(name ?? "")
  const router = useRouter()
  const mutation = useMutateMapName(router.query.device as string)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedName(e.target.value)
  }


  const handleUpdateName = async (name: string) => {
    mutation.mutate({ catalogId: mapId, name })
  }

  const collapseDisplay = () => {
    return (
      <O_IconButton>
        <Icon>
          <SettingDots />
        </Icon>
      </O_IconButton>
    )
  }

  const unCollapseDisplay = () => {
    return (
      <FormControl size="small" variant="filled" sx={{ p: 1 }}>
        <FormHelperText variant="standard" sx={{ fontSize: 16, fontWeight: 400 }}>{"באפשרותך לעדכן שם למפה"}</FormHelperText>
        <Input
          autoFocus
          required
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

export default MapNameHandler;
