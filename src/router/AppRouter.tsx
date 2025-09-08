import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminMain from "./pages/AdminMain"
import { TabsProvider } from "../context/TabsContext";
import { ThemeProvider } from "@mui/material";
import { adminTheme } from "../themes/adminTheme";
import StudentMain from "./pages/StudentMain";
import PostPage from "./pages/PostPage";
import PostsListPage from "./pages/PostsListPage";

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
                <Route path="/student/:plan/:course" element={<PostsListPage />} />
                <Route path="/student/:plan/:course/:post" element={<PostPage />} />
                <Route path="*" element={<h1>404 - Not Found</h1>} />
                
            </Routes>
        </BrowserRouter>
    );
}
