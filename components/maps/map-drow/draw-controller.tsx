import { DrawMapStatus, MapDrawForm } from "@/types/interfaces";
import { Card, Typography, Box, SelectChangeEvent, Button, Stack } from "@mui/material";
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import SelectFormControl, { SelectOptionValue } from "./form-cntrl-select";
import { useProducts } from "@/hooks";
import InputFormControl from "./form-cntrl-input";

interface DrawControllerProps {
  mapForm: MapDrawForm,
  setMapForm: Dispatch<SetStateAction<MapDrawForm>>,
  mapStatus: DrawMapStatus
  setMapStatus: Dispatch<SetStateAction<DrawMapStatus>>,
  handleSubmit: () => Promise<void>
}

const DrawController: FC<DrawControllerProps> = ({ mapForm, setMapForm, mapStatus, setMapStatus, handleSubmit }) => {
  const productsMap = useProducts()
  const [products, setProducts] = useState<SelectOptionValue[]>([])

  useEffect(() => {
    if (productsMap?.products) {
      setProducts(Object.values(productsMap.products).map(product => ({ name: product.productName, value: product.id })))
    }
  }, [productsMap?.products])

  useEffect(() => {
    // console.log(products, productsMap);

  }, [products])

  return (
    <form>
      <Card sx={{ borderRadius: 2.5, px: 2, width: 300, zIndex: 1001, position: "relative", m: 1 }}>
        <Box mt={2}>
          <Typography variant="subtitle1" fontWeight={700}>
            יצירת שטח חדש
          </Typography>
        </Box>
        {/* <SelectFormControl
          title="מפות"
          name={mapForm.productName}
          value={mapForm.id}
          onChange={(e: SelectChangeEvent) => {
            const id = e.target.value
            !Array.isArray(productsMap?.products) &&
              setMapForm({
                ...mapForm,
                id,
                productName: productsMap?.products[id].productName ?? ""
              })
          }}
          values={products}
        ></SelectFormControl> */}

        <InputFormControl
          name="שם"
          value={mapForm.name ? mapForm.name : ""}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setMapForm({ ...mapForm, name: e.target.value })
          }}
        ></InputFormControl>

        {/* <SelectFormControl
          title="רזולוציה"
          name={mapForm.resolution.toString()}
          value={mapForm.resolution.toString()}
          onChange={(e: SelectChangeEvent) => {
            setMapForm({ ...mapForm, resolution: Number(e.target.value) })
          }}
          values={Array.from({ length: 18 }, (_, index) => ({ name: index.toString(), value: index }))}
        ></SelectFormControl> */}

        <Stack direction={"row"} mt={3} mb={2} justifyContent={"space-between"}>
          <Button variant="text" onClick={() => setMapStatus(DrawMapStatus.start)}>נקה בחירה</Button>
          <Stack direction={"row"} gap={1}>
            <Button
              variant="outlined"
              disabled={mapStatus < DrawMapStatus.edited}
            >חזור</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mapStatus < DrawMapStatus.created || mapStatus == DrawMapStatus.error}
              onClick={(e) => {
                e.preventDefault()
                if (mapStatus < DrawMapStatus.finished) {
                  setMapStatus(DrawMapStatus.finished)
                } else if (mapStatus != DrawMapStatus.error) {
                  handleSubmit()
                }
              }
              }
            >{mapStatus < DrawMapStatus.finished ? "סיום" : "קבל עדכונים"}</Button>
          </Stack>
        </Stack>
      </Card >
    </form>
  );
}

export default DrawController;