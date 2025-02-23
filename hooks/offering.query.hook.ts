import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Q_DEVICE_SOFTWARE } from "../apis/query-keys";
import { getOffering, pushOffer } from "@/apis/client-side/devices-actions.api";
import { DeviceSoftWare } from "@/types/interfaces/devices";
import { DeviceSoftwareStateEnum } from "@/types/interfaces/getapp";
import { PushOfferingDto } from "@/api/src";

export const useMutateDeviceSoftware = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (pushMag: { mes: PushOfferingDto, parentCatalogId: string }) => pushOffer(pushMag.mes),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: any, pushMag: { mes: PushOfferingDto, parentCatalogId: string }) => {

      const offeredSoftware = await getOffering(pushMag.mes.catalogId)

      if (offeredSoftware) {
        pushMag.mes.devices?.forEach(d => {
          client.setQueryData([Q_DEVICE_SOFTWARE, d], (preData: DeviceSoftWare) => {
            const copyData = { ...preData }
            copyData.softwares = [...preData.softwares, { software: offeredSoftware, state: DeviceSoftwareStateEnum.PUSH }]
            const softI = copyData.softwares.findIndex(s => s.software.catalogId == pushMag.parentCatalogId)
            copyData.softwares[softI].offering = copyData.softwares[softI].offering?.filter(o => o.catalogId != pushMag.mes.catalogId)            
            return copyData
          })
        })
      }
    },
    onError: (error => alert(error))
  })
}
