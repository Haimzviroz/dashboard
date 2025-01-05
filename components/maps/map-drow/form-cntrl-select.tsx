import { FormControl, FormHelperText, Select, MenuItem, SelectChangeEvent, TextField } from "@mui/material";
import { ChangeEvent, FC, Fragment } from "react";
export interface SelectOptionValue {
  name: string,
  value: string | number
}

interface SelectFormControlProps {
  title: string,
  name: string,
  value: string
  onChange: (e: SelectChangeEvent) => void
  values?: SelectOptionValue[]
}

const SelectFormControl: FC<SelectFormControlProps> = ({ title, name, value, onChange, values }) => {
  return (
    <FormControl fullWidth size="small" variant="filled" sx={{ my: .5 }}>
      <FormHelperText variant="standard" sx={{ fontSize: 16, fontWeight: 400 }}>{title}</FormHelperText>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        sx={{
          borderRadius: 2,
          '&::before': { content: "none" },
          '& .MuiSelect-select': { py: 1 },
        }}
        displayEmpty={false}
        renderValue={() => <span>{name}</span>}
      >
        {values && values.map(item => <MenuItem key={item.value} value={item.value} sx={{width: "100%"}}>{item.name}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

export default SelectFormControl;