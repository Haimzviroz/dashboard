import { createContext, FC, useEffect, useState, useContext } from "react"
import { DashNavBarOption, ProNavBarOption, SideBarOption } from "@/types/enum";
import { Activate, GetAppProviderProps } from "@/types/interfaces";
import { useRouter } from "next/router";
import { R_APP_DEVICES, R_MAP_DEVICES, R_MAPS, R_PROJECTS, R_GET_APP, R_APP_GROUP, R_MAP_GROUP, R_CATALOG } from "@/apis/routes";

export const useGetApp = () => useContext(GetAppContext)

export const GetAppContext = createContext({} as GetAppProviderProps)

const GetAppProvider: FC<any> = ({ children }: any) => {
	const router = useRouter()

	
	const [activated, setActivated] = useState<Activate | null>(null);
	const [proNavBarActive, setProNavBarActive] = useState<ProNavBarOption | null>(ProNavBarOption.OVERVIEW);
	const [dashNavBarActive, setDashNavBarActive] = useState<DashNavBarOption | null>(DashNavBarOption.PRODUCTS);
	const [sideBarCollapse, setSideBarCollapse] = useState<boolean>(true);

	useEffect(() => {
		const active = getSideBarActivated()
		active && active !== activated?.active && setActivated({ active, trigger: null })
		const proNavActive = getProNavBarActivated()
		proNavActive && proNavActive !== proNavBarActive && setProNavBarActive(proNavActive)
		const dashNavActive = getDashNavBarActivated()
		dashNavActive && dashNavActive !== dashNavBarActive && setDashNavBarActive(dashNavActive)
	}, [router])

	const getSideBarActivated = () => {
		if (router.pathname.startsWith(R_MAPS)) return SideBarOption.MAP;
		if (router.pathname.startsWith(R_APP_DEVICES) || router.pathname.startsWith(R_MAP_DEVICES)) return SideBarOption.DEVICES;
		if (router.pathname.startsWith(R_PROJECTS)) return SideBarOption.APPS;
		if (router.pathname.startsWith(R_APP_GROUP) || router.pathname.startsWith(R_MAP_GROUP)) return SideBarOption.GROUPS;
		if (router.pathname.startsWith(R_CATALOG)) return SideBarOption.CATALOG;
	}

	const getProNavBarActivated = () => {
		if (router.pathname.startsWith(R_PROJECTS)) {
			if (router.pathname.includes(ProNavBarOption.OVERVIEW)) return ProNavBarOption.OVERVIEW;
			if (router.pathname.includes(ProNavBarOption.RELEASES)) return ProNavBarOption.RELEASES;
			if (router.pathname.includes(ProNavBarOption.REGULATION)) return ProNavBarOption.REGULATION;
			if (router.pathname.includes(ProNavBarOption.POLICY)) return ProNavBarOption.POLICY;
			if (router.pathname.includes(ProNavBarOption.DOCS)) return ProNavBarOption.DOCS;
			if (router.pathname.includes(ProNavBarOption.SETTINGS)) return ProNavBarOption.SETTINGS;
		}
	}

	const getDashNavBarActivated = () => {
		if (router.pathname.startsWith(R_GET_APP)) {
			if (router.pathname.endsWith(DashNavBarOption.PRODUCTS)) return DashNavBarOption.PRODUCTS;
			if (router.pathname.endsWith(DashNavBarOption.FORMATIONS)) return DashNavBarOption.FORMATIONS;
		}
	}

	return (
		<GetAppContext.Provider value={{
			router,
			activated,
			setActivated,
			sideBarCollapse,
			setSideBarCollapse,
			proNavBarActive,
			setProNavBarActive,
			dashNavBarActive,
			setDashNavBarActive
		}}>
			{children}
		</GetAppContext.Provider>
	)
}

export default GetAppProvider
