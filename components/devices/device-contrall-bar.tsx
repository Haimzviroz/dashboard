import { Button, Icon, Stack } from "@mui/material";
import { FC, Fragment } from "react";
import SearchBar from "../utils/bars/search.bar";
import SortBar from "../utils/bars/sort.bar";
import FilterBar from "../utils/bars/filter.bar";
import DownloadFile from "../../assets/download-file.svg"
import { pushOffer } from "@/apis/client-side/devices-actions.api";
import { ItemTypeEnum } from '@/types/interfaces/devices';
import { AppScopeEnum } from "@/types/enum";
import { useToast } from "@/providers/toast.provider";
import { useGetApp } from "@/providers/getapp.provider";
import { DeviceDto, PushOfferingDto } from "@/api/src";

interface DeviceControlBarProps {
  selectedDevices: string[]
  devices: DeviceDto[]
  scope: AppScopeEnum,
  distributeEntity: string | undefined
}

const DeviceControlBar: FC<DeviceControlBarProps> = ({ selectedDevices, devices, scope, distributeEntity }) => {

  const { selectedGroup } = useGetApp()
  const { showToast } = useToast();

  const distribute = async (to: "d" | "g") => {
    const pushDto: PushOfferingDto = {
      catalogId: distributeEntity ?? "",
      devices: to == "d" ? selectedDevices : [],
      groups: to == "g" ? selectedGroup : [],
      itemType: (() => {
        switch (scope) {
          case AppScopeEnum.getapp:
            return ItemTypeEnum.SOFTWARE;
          case AppScopeEnum.getmap:
            return ItemTypeEnum.MAP;
          default:
            throw new Error("Invalid scope");
        }
      })()
    }
    try {
      showToast("עדכון נשלח", "info")
      await pushOffer(pushDto)
      showToast("עודכן בהצלחה", "success")
    } catch (error) {
      showToast("שגיאה בעדכון", "error")
    }
  }

  return (
    <Stack direction={"row"} justifyContent={"space-between"} gap={1} alignItems={"center"}>
      <Stack direction={"row"} alignSelf={"start"} gap={1} alignItems={"center"}>
        {distributeEntity &&
          <Fragment>
            <Button variant={"contained"} disabled={selectedDevices.length == 0} onClick={() => distribute("d")}>עדכן נבחרים</Button>
            <Button variant={"contained"} disabled={!selectedGroup.length || !devices.length} onClick={() => distribute("g")}>עדכן קבוצות</Button>
          </Fragment>
        }
      </Stack>
      <Stack direction={"row"} alignSelf={"end"} gap={1} alignItems={"center"}>
        <FilterBar />
        <SortBar />
        <SearchBar />
        <Icon><DownloadFile /></Icon>
      </Stack>
    </Stack>
  );
}

export default DeviceControlBar;