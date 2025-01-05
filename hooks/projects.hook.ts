import { useContext } from 'react';
import { GlobalContext } from '@/storage/global.storage';
import { GetAppContext } from '@/storage/getmap.storage';
import { DevicesContext } from '@/storage/devices.storage';

export const useGlobal = ()  => useContext(GlobalContext)
export const useGetApp = ()  => useContext(GetAppContext)
export const useDevices = ()  => useContext(DevicesContext)
