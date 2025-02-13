import { createContext, FC, useEffect, useState, useRef, useContext } from "react"
import { DashNavBarOption, ProNavBarOption, SideBarOption } from "@/types/enum";
import { Activate, GetAppProviderProps } from "@/types/interfaces";
import { useRouter } from "next/router";
import { R_APP_DEVICES, R_MAP_DEVICES, R_DEVICES, R_MAPS, R_PROJECTS, R_GET_APP } from "@/apis/routes";
import { Group } from "@/types/interfaces/devices";
import { useGroups } from "@/hooks/group.query.hook";
import { RouterHelpers } from "@/utils/helpers/router.helper";

export const useGetApp = ()  => useContext(GetAppContext)

export const GetAppContext = createContext({} as GetAppProviderProps)

const GetAppProvider: FC<any> = ({ children }: any) => {
	const router = useRouter()

	const getSelectedGroups = () => {
		const groups = router.query?.groups
		if (groups) {
			return Array.isArray(groups) ? groups.map(g => Number(g)) : [Number(groups)]
		}
		else return []
	}

	const [selectedGroup, setSelectedGroup] = useState<number[]>(getSelectedGroups())
	const [activated, setActivated] = useState<Activate | null>(null);
	const [proNavBarActive, setProNavBarActive] = useState<ProNavBarOption | null>(ProNavBarOption.OVERVIEW);
	const [dashNavBarActive, setDashNavBarActive ] = useState<DashNavBarOption | null>(DashNavBarOption.PRODUCTS);
	const [sideBarCollapse, setSideBarCollapse] = useState<boolean>(true);

	const isFirstLoad = useRef(true); // useRef to track first load without causing re-render

	const { groups } = useGroups()

	useEffect(() => {
		const active = getSideBarActivated()
		active && active !== activated?.active && setActivated({ active, trigger: null })
		const proNavActive = getProNavBarActivated()
		proNavActive && proNavActive !== proNavBarActive && setProNavBarActive(proNavActive)
		const dashNavActive = getDashNavBarActivated()
		dashNavActive && dashNavActive !== dashNavBarActive && setDashNavBarActive(dashNavActive)
	}, [router])

	// useEffect(() => {
	// 	if (activated?.trigger) {
	// 		const href = `${getRoute()}`;
	// 		router.push(href, undefined, { shallow: true })
	// 	}
	// }, [activated])


	useEffect(() => {
		if (!isFirstLoad.current) {
			const queryParams = RouterHelpers.convertQueryObjToStringParams({ ...router.query, groups: selectedGroup.map(g => g.toString()) }, router.asPath, "groups")
			const path = router.pathname
			let pushUrl = queryParams ? `${path}?${queryParams}` : path
			const hash = window.location.hash
			pushUrl = pushUrl + `${hash ? hash : ""}`
			router.push(pushUrl, undefined, { shallow: true })
		}

		isFirstLoad.current = false
	}, [selectedGroup])

	const getRoute = () => {
		switch (activated?.active) {
			case SideBarOption.MAP:
				return R_MAPS
			case SideBarOption.DEVICES:
				return R_DEVICES
			default:
				break;
		}
	}

	const getSideBarActivated = () => {
		if (router.pathname.startsWith(R_MAPS)) return SideBarOption.MAP;
		if (router.pathname.startsWith(R_APP_DEVICES) || router.pathname.startsWith(R_MAP_DEVICES)) return SideBarOption.DEVICES;
		if (router.pathname.startsWith(R_PROJECTS)) return SideBarOption.APPS;
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

	const checkIfParentSelected = (id: number): number => {
		const group = groups?.groups[id];
		const parentI = selectedGroup.findIndex(gid => gid == group?.parent)
		return parentI >= 0 ? parentI : group?.parent ? checkIfParentSelected(group?.parent) : -1
	}

	const checkIfChildSelected = (childIds: number[] | undefined): Set<number> | undefined => {
		if (!childIds) return
		const childSet = new Set<number>
		for (let index = 0; index < childIds.length; index++) {
			const cI = selectedGroup.findIndex(gid => gid == childIds[index])
			if (cI >= 0) {
				childSet.add(cI)
			}
			const group = groups?.groups[childIds[index]]
			checkIfChildSelected(group?.groups)?.forEach(nc => {
				childSet.add(nc)
			})
		}
		return childSet

	}

	const setGroupInSelectedGroup = (group: Group) => {
		const gI = selectedGroup.findIndex(g => g === group.id)
		if (gI >= 0) {
			setSelectedGroup(groups => {
				const copyG = [...groups]
				copyG.splice(gI, 1)
				return [...copyG]
			})
		} else {
			const parentI = checkIfParentSelected(group.id)
			const childI = checkIfChildSelected(group.groups)
			setSelectedGroup(groups => {
				let copyG = [...groups]
				if (parentI >= 0) {
					copyG.splice(parentI, 1, group.id)
				} else if (childI) {
					const gToRemove = new Set<number>();
					childI.forEach(ci => gToRemove.add(selectedGroup[ci]));
					copyG = copyG.filter(g => !gToRemove.has(g));
					copyG.push(group.id);
				} else {
					copyG.push(group.id)
				}
				return [...copyG].sort()
			})
		}
	}


	return (
		<GetAppContext.Provider value={{
			router,
			selectedGroup,
			setSelectedGroup,
			setGroupInSelectedGroup,
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
