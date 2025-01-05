import { createContext, FC, useState } from "react"
import { Device, DevicesProviderProps } from "@/types/interfaces/devices";

export const DevicesContext = createContext({} as DevicesProviderProps)

const DevicesProvider: FC<any> = ({ children }: any) => {
	const [devices, setDevices] = useState<Device[]>([])


	return (
		<DevicesContext.Provider value={{
			devices,
			setDevices
		}}>
			{children}
		</DevicesContext.Provider>
	)
}

export default DevicesProvider
