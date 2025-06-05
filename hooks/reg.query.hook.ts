import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Q_REGULATIONS, Q_REGULATIONS_STATUS, Q_REG_TYPES, Q_RELEASE } from "../apis/query-keys";
import { addRegulation, deleteRegulation, getProjectRegulations, getRegulationsTypes, updateRegulation, updateRegulations } from "@/apis/client-side/projects-actions.api";
import { CreateRegulationDto, RegulationDto, RegulationStatusDto, RegulationTypeDto, SetRegulationStatusDto, UpdateOneOfManyRegulationDto, UpdateRegulationDto } from "@/api/src";
import { getRegulationsStatus, setRegulationsStatus } from "@/apis/client-side/regs-actions.api";

export const useRegulationsTypes = () => {
  const { data: regTypes, refetch } = useQuery<RegulationTypeDto[]>({
    queryKey: [Q_REG_TYPES],
    queryFn: () => getRegulationsTypes(),
  })
  return { regTypes, refetch }
}

export const useReg = (projectName: string) => {
  const { data: regulations, refetch } = useQuery<RegulationDto[]>({
    queryKey: [Q_REGULATIONS, projectName],
    queryFn: () => getProjectRegulations(projectName),
  })
  return { regulations, refetch }
}

export const useAddReg = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (addMes: { projectName: string, data: CreateRegulationDto }) =>
      addRegulation(addMes.projectName, addMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: RegulationDto, addMes: { projectName: string, data: CreateRegulationDto }) => {

      client.setQueryData([Q_REGULATIONS, addMes.projectName], (preData: RegulationDto[]) => {
        return [...preData, data]
      })
    },
    onError: (error => alert(error))
  })
}

export const useUpdateReg = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (updateMes: { projectName: string, regId: string, data: UpdateRegulationDto }) =>
      updateRegulation(updateMes.projectName, updateMes.regId, updateMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: RegulationDto, updateMes: { projectName: string, regId: string, data: UpdateRegulationDto }) => {
      client.setQueryData([Q_REGULATIONS, updateMes.projectName], (preData: RegulationDto[]) => {
        const copyData = [...preData]
        if (copyData) {
          const currentR = copyData.findIndex(r => r.name === updateMes.regId)
          if (currentR !== -1) {
            copyData[currentR] = { ...copyData[currentR], ...data }
          }
        }
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}

export const useDeleteReg = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (delMes: { projectName: string, regId: string }) =>
      deleteRegulation(delMes.projectName, delMes.regId),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: void, delMes: { projectName: string, regId: string }) => {

      client.setQueryData([Q_REGULATIONS, delMes.projectName], (preData: RegulationDto[]) => {
        return preData.filter(r => r.name !== delMes.regId)
      })
    },
    onError: (error => alert(error))
  })
}

export const useSetRegOrder = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (updateMes: { projectName: string, regs: RegulationDto[] }) =>
      updateRegulations(updateMes.projectName, updateMes.regs.map(r => {
        (r as unknown as UpdateOneOfManyRegulationDto).regulation = r.name
        return r as unknown as UpdateOneOfManyRegulationDto
      })),
    // Notice the second argument is the variables object that the `mutate` function receives
    onMutate: async (updateMes: { projectName: string, regs: RegulationDto[] }) => {
      client.setQueryData([Q_REGULATIONS, updateMes.projectName], () => {
        return [...updateMes.regs]
      })
    },
    onError: (error => alert(error))
  })
}

// Regulation statuses

type SetRegMes = { projectName: string, version: string, regulation: string, data: SetRegulationStatusDto }

export const useRegsStatus = (projectId: string, version: string) => {
  const { data: regsStatus, refetch } = useQuery<RegulationStatusDto[]>({
    queryKey: [Q_REGULATIONS_STATUS, projectId, version],
    queryFn: () => getRegulationsStatus(projectId, version),
  })
  return { regsStatus, refetch }
}

export const useSetRegsStatus = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (setMes: SetRegMes) =>
      setRegulationsStatus(setMes.projectName, setMes.version, setMes.regulation, setMes.data),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: (data: RegulationStatusDto, setMes: SetRegMes) => {
      client.refetchQueries({queryKey:[Q_RELEASE, setMes.version]})      
      client.setQueryData([Q_REGULATIONS_STATUS, setMes.projectName, setMes.version], (preData: RegulationStatusDto[]) => {
        const copyData = [...preData]
        const currentR = copyData.findIndex(r => r.regulation === setMes.regulation)

        if (currentR !== -1) {
          copyData[currentR] = data
        } else {
          copyData.push(data)
        }
        return copyData
      })
    },
    onError: (error => alert(error))
  })
}
