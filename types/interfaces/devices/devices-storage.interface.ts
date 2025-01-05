import { Dispatch, SetStateAction } from "react";
import { Device } from ".";

export interface DevicesProviderProps{
  devices: Device[],
  setDevices: Dispatch<SetStateAction<Device[]>>,
}