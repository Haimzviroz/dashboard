import { FormControl, FormHelperText, Select, MenuItem, SelectChangeEvent, TextField, Input } from "@mui/material";
import { ChangeEvent, FC, Fragment } from "react";

interface InputFormControlProps {
  name: string,
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const InputFormControl: FC<InputFormControlProps> = ({ name, value, onChange }) => {
  return (
    <FormControl fullWidth size="small" variant="filled" sx={{ my: .5 }}>
      <FormHelperText variant="standard" sx={{ fontSize: 16, fontWeight: 400 }}>{name}</FormHelperText>
      <Input
        required
        placeholder={" בחר " + name}
        onChange={onChange}
        sx={{
          borderRadius: 2,
          backgroundColor: "#0001",
          '&.MuiInput-root:before': { content: "none" },
          '&.MuiInput-root': { pt: 0, p: .6 },
        }}
      />
    </FormControl>
  );
}

export default InputFormControl;