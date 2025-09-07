import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminMain from "./pages/AdminMain"
import { TabsProvider } from "../context/TabsContext";
import { ThemeProvider } from "@mui/material";
import { adminTheme } from "../themes/adminTheme";
import StudentMain from "./pages/StudentMain";
import PostsPage from "./pages/PostListPage";
import PostPage from "./pages/PostPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element="" />
                {/* Rutas Administrador */}
                <Route
                    path="/admin"
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
                <Route path="/student/:plan/:course" element={<PostsPage />} />
                <Route path="/student/:plan/:course/:post" element={<PostPage />} />
            </Routes>
        </BrowserRouter>
    );
}
