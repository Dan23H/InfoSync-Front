import { Box } from '@mui/material';
import { useTabs } from "../../context/TabsContext";
import PlansViewer from '../../components/apps/admin/academic_plan/PlanViewer';
import RegActivity from '../../components/apps/admin/auditor/RegActivity';
import ColorTabs from '../../components/apps/admin/ColorTabs';
import Stats from '../../components/apps/admin/stats/Stats';
import Modding from '../../components/apps/admin/moderation/Modding';

export default function AdminMain() {
  const { value } = useTabs();
  return (
    <Box>
      <ColorTabs />
      <Box style={{ marginTop: "20px" }}>
        {value === "stats" && <Stats/>}
        {value == "plans" && <PlansViewer/>}
        {value === "activity" && <RegActivity />}
        {value === "modding" && <Modding/>}
      </Box>
    </Box>
  );
}
