import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminMain from "./pages/AdminMain"
import { TabsProvider } from "../context/TabsContext";
import { ThemeProvider } from "@mui/material";
import { adminTheme } from "../themes/adminTheme";
import StudentMain from "./pages/StudentMain";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element="" />
                {/* Rutas Administrador */}
                <Route
                    path="/main"
                    element={
                        <ThemeProvider theme={adminTheme}>
                            <TabsProvider>
                                <AdminMain />
                            </TabsProvider>
                        </ThemeProvider>
                    }
                />

                {/* Rutas Estudiante */}
                <Route
                    path="/student"
                    element={
                        <StudentMain />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
