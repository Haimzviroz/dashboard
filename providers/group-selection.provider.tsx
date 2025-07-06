import { createContext, FC, useEffect, useState, useRef, useContext, Dispatch, SetStateAction } from "react"
import { useRouter } from "next/router";
import { Group } from "@/types/interfaces/devices";
import { useGroups } from "@/hooks/group.query.hook";
import { RouterHelpers } from "@/utils/helpers/router.helper";
import { GroupResponseDto } from "@/api/src";


export interface GroupSelectionProviderProps {
	groups: GroupResponseDto
	selectedGroup: number[],
	setSelectedGroup: Dispatch<SetStateAction<number[]>>,
	setGroupInSelectedGroup: (group: Group) => void,

}

export const useGroupSelection = (): GroupSelectionProviderProps => useContext(GroupSelectionContext)

export const GroupSelectionContext = createContext({} as GroupSelectionProviderProps)

const GroupSelectionProvider: FC<any> = ({ children }: any) => {
	const router = useRouter()

	const getSelectedGroups = () => {
		const groups = router.query?.groups
		if (groups) {
			return Array.isArray(groups) ? groups.map(g => Number(g)) : [Number(groups)]
		}
		else return []
	}

	const [selectedGroup, setSelectedGroup] = useState<number[]>(getSelectedGroups())

	const isFirstLoad = useRef(true); // useRef to track first load without causing re-render

	const { groups } = useGroups()

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
		<GroupSelectionContext.Provider value={{
			groups,
			selectedGroup,
			setSelectedGroup,
			setGroupInSelectedGroup,
		}}>
			{children}
		</GroupSelectionContext.Provider>
	)
}

export default GroupSelectionProvider
