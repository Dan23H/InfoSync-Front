import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function PlanSelect({ plans, value, onChange }: any) {
  return (
    <FormControl fullWidth>
      <InputLabel>Plan</InputLabel>
      <Select value={value ?? ""} label="Plan" onChange={(e) => onChange(e.target.value)}>
        {plans.map((p: any) => (
          <MenuItem key={p._id} value={p._id}>
            {p.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
