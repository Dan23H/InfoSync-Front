  import * as React from 'react';
  import Tabs from '@mui/material/Tabs';
  import Tab from '@mui/material/Tab';
  import Box from '@mui/material/Box';
  import { useTabs } from '../../../context/TabsContext';

  export default function ColorTabs() {
    const { value, setValue } = useTabs();

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
    };

    return (
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
        >
          <Tab value="stats" label="Estadísticas" />
          <Tab value="activity" label="Registro de actividad" />
          <Tab value="modding" label="Panel de moderación" />
          <Tab value="plans" label="Planes de estudio" />
        </Tabs>
      </Box>
    );
  }
