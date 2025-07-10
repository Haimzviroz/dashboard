import { Box, Button, Divider, FormControl, FormHelperText, Input, Stack, Typography } from "@mui/material";
import { ChangeEvent, FC, useState, useEffect } from "react";
import { useMutateDevice } from "@/hooks/device.query.hook";
import AnchorAndPopper from "@/components/utils/collapse/anchor-popper";
import { NextRouter } from "next/router";

interface NameCellProps {
  name?: string
  deviceId: string
  editable?: boolean;
}

const MutNameCell: FC<NameCellProps> = ({ name, deviceId, editable = true }) => {
  const [updatedName, setUpdatedName] = useState<string | undefined>(name ?? "")

  const mutation = useMutateDevice()

  useEffect(() => {
    setUpdatedName(name ?? "");
  }, [name]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedName(e.target.value)
  }


  const handleUpdateName = async (name: string) => {
    mutation.mutate({ deviceId, data: { name } })
  }

  const collapseDisplay = () => {
    return (

      <Box>
        {name ? (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-start"
          >
            <Typography variant="body1" fontWeight={600}>
              {name}
            </Typography>

            <Divider orientation="vertical" flexItem />

            {editable && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: 'italic', fontWeight: 500 }}
              >
                <span style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}>
                  ערוך
                </span>
              </Typography>
            )}
          </Stack>
        ) : editable ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic', fontWeight: 500 }}
          >
            <span style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}>
              הוסף
            </span>
          </Typography>
        ) : null}
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

  if (!editable) {
    // Just show the name, no edit/add UI, no anchor
    return <Typography variant="body1">{name}</Typography>;
  }
  return <AnchorAndPopper collapseDisplay={collapseDisplay()} unCollapseDisplay={unCollapseDisplay()} onSubmit={onSubmit} />
}

export default MutNameCell;
