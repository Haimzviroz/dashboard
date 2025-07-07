import { createContext, FC, useEffect, useState, useContext } from "react"
import { DashNavBarOption, ProNavBarOption } from "@/types/enum";
import { GetAppProviderProps } from "@/types/interfaces";
import { useRouter } from "next/router";
import { R_PROJECTS, R_GET_APP } from "@/apis/routes";

export const useGetApp = () => useContext(GetAppContext)

export const GetAppContext = createContext({} as GetAppProviderProps)

const GetAppProvider: FC<any> = ({ children }: any) => {
	const router = useRouter()
	
	const [proNavBarActive, setProNavBarActive] = useState<ProNavBarOption | null>(ProNavBarOption.OVERVIEW);
	const [dashNavBarActive, setDashNavBarActive] = useState<DashNavBarOption | null>(DashNavBarOption.PRODUCTS);

	useEffect(() => {
		const proNavActive = getProNavBarActivated()
		proNavActive && proNavActive !== proNavBarActive && setProNavBarActive(proNavActive)
		const dashNavActive = getDashNavBarActivated()
		dashNavActive && dashNavActive !== dashNavBarActive && setDashNavBarActive(dashNavActive)
	}, [router])

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
