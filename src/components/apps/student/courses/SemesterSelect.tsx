import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function SemesterSelect({ semesters, value, onChange }: any) {
  return (
    <FormControl fullWidth>
      <InputLabel>Semestre</InputLabel>
      <Select value={value} label="Semestre" onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="">Todos los semestres</MenuItem>
        {semesters.sort().map((s: number) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
