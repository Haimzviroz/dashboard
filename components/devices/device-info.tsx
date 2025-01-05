import { useDeviceMetaData, useMutateDeviceMetaData } from "@/hooks/device.query.hook";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { Dispatch, FC, Fragment, ReactNode, SetStateAction, useEffect, useState } from "react";
import DeviceInfoItem, { InfoItemName, InfoItemProps } from "./device-info-item";
import { DeviceMetaData as DMD } from "@/types/interfaces/devices";

import D_Entity from '../../assets/devices/entity.svg'
import D_Pending from '../../assets/devices/devices-pending.svg'
import D_Data from '../../assets/devices/devices-data.svg'
import D_Updated from '../../assets/devices/devices-updated.svg'
import D_Error from '../../assets/devices/devices-error.svg'
import { NextRouter } from "next/router";
import { RouterHelpers } from "@/utils/helpers/router.helper";
import { Map } from "@/types/interfaces";
import { Software } from "@/types/interfaces/getapp";
import { AppScopeEnum } from "@/types/enum";

interface DeviceMetaDataProps {
  router: NextRouter,
  scope: AppScopeEnum
  cEntity?: Software | Map,
  activeItem: InfoItemName | undefined,
  setActiveItem: Dispatch<SetStateAction<InfoItemName | undefined>>
  setCurrentDevices: Dispatch<SetStateAction<string[] | undefined>>
}

const DeviceMetaData: FC<DeviceMetaDataProps> = ({ router, scope, cEntity, activeItem, setActiveItem, setCurrentDevices }) => {
  const stringParams = scope === AppScopeEnum.getapp
    ? () => RouterHelpers.strParamsByKey(["groups", "software"], router.query)
    : () => RouterHelpers.strParamsByKey(["groups", "map"], router.query)

  const { metaData } = useDeviceMetaData(stringParams, scope)

  useEffect(() => {
    if (activeItem && metaData) {

      setCurrentDevices(metaData[activeItem as unknown as keyof DMD].devices)
    } else {
      setCurrentDevices(undefined)
    }
  }, [activeItem])

  const getItemInfo = (k: keyof DMD, v: number): InfoItemProps => {
    const info: InfoItemProps = {} as InfoItemProps
    switch (k) {
      case "count":
        info.name = InfoItemName.count
        info.caption = "כל האמצעים"
        info.icon = <D_Data />
        break;
      case "updated":
        info.name = InfoItemName.updated
        info.caption = "אמצעים מעודכנים"
        info.icon = <D_Updated />
        break;
      case "onUpdateProcess":
        info.name = InfoItemName.onUpdateProcess
        info.caption = "אמצעים בתהליך עדכון"
        info.icon = <D_Pending />
        break;
      case "updateError":
        info.name = InfoItemName.error
        info.caption = "שגיאת עדכון"
        info.icon = <D_Error />
        break;
      default:
        return info;
    }
    info.value = v
    info.cardSx = {
      cursor: "pointer",
      borderWidth: activeItem === info.name ? 4 : 1,
      borderColor: activeItem === info.name ? "#6f42c1" : undefined
    }
    return info
  }

  const getItemValue = (name: string, version: string): ReactNode => {
    return <Box >
      <Typography variant="h3" marginY={.5} align={"center"} fontWeight={700} fontSize={26}>{name}</Typography>
      <Typography variant="h6" color="textSecondary" align="center">
        גירסה: {version}
      </Typography>
    </Box>
  }

  const getCardInfo = () => {
    const items: InfoItemProps[] = []

    if (cEntity) {
      items.push({
        name: InfoItemName.distItem,
        caption: "פריט נבחר",
        value: 'versionNumber' in cEntity ? getItemValue(cEntity.name, cEntity.versionNumber) : cEntity.name,
        icon: <D_Entity />,
        cardSx: { borderColor: "#4169E1", borderWidth: 4 },
        disabled: true
      })
    }

    if (metaData) {
      items.push(...Object.keys(metaData).map(k => {
        const key = k as keyof DMD;  // Cast k to keyof DeviceSoftwareMetaData
        const itemInfo: InfoItemProps = getItemInfo(key, metaData[key].sum);
        return itemInfo
      }))
    }
    return items
  }

  return (<Fragment>
    <Stack direction={"row"} gap={2} justifyContent={"center"} pb={3}>
      {getCardInfo()?.map(c =>
        <DeviceInfoItem key={c.caption} item={c} activeItem={activeItem} setActive={setActiveItem}></DeviceInfoItem>
      )}
    </Stack>
  </Fragment>);
}

export default DeviceMetaData;