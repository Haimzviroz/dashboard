import { createContext, FC, useEffect, useState, useContext } from "react"
import { SideBarOption } from "@/types/enum";
import { useRouter } from "next/router";
import { R_APP_DEVICES, R_MAP_DEVICES, R_MAPS, R_PROJECTS, R_GET_APP, R_APP_GROUP, R_MAP_GROUP, R_CATALOG } from "@/apis/routes";

import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";

export interface SideBarProviderProps {
	router: NextRouter
	activated: Activate | null
	setActivated: Dispatch<SetStateAction<Activate | null>>;
	sideBarCollapse: boolean
	setSideBarCollapse: Dispatch<SetStateAction<boolean>>;
}

export interface Activate {
	active: SideBarOption
	trigger: "sideBar" | null
}

export const useSideBar = () => useContext(SideBarContext)

export const SideBarContext = createContext({} as SideBarProviderProps)

const SideBarProvider: FC<any> = ({ children }: any) => {
	const router = useRouter()


	const [activated, setActivated] = useState<Activate | null>(null);
	const [sideBarCollapse, setSideBarCollapse] = useState<boolean>(true);

	useEffect(() => {
		const active = getSideBarActivated()
		active && active !== activated?.active && setActivated({ active, trigger: null })
	}, [router])

	const getSideBarActivated = () => {
		if (router.pathname.startsWith(R_MAPS)) return SideBarOption.MAP;
		if (router.pathname.startsWith(R_APP_DEVICES) || router.pathname.startsWith(R_MAP_DEVICES)) return SideBarOption.DEVICES;
		if (router.pathname.startsWith(R_PROJECTS)) return SideBarOption.APPS;
		if (router.pathname.startsWith(R_APP_GROUP) || router.pathname.startsWith(R_MAP_GROUP)) return SideBarOption.GROUPS;
		if (router.pathname.startsWith(R_CATALOG)) return SideBarOption.CATALOG;
	}

	return (
		<SideBarContext.Provider value={{
			router,
			activated,
			setActivated,
			sideBarCollapse,
			setSideBarCollapse,
		}}>
			{children}
		</SideBarContext.Provider>
	)
}

export default SideBarProvider
