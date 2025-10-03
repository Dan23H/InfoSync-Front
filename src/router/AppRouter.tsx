import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TabsProvider } from "../context/TabsContext";
import { ThemeProvider } from "@mui/material";
import { adminTheme } from "../themes/adminTheme";
import { AdminMainPage, PostPage, PostsListPage, StudentMainPage, LoginPage, ProfilePage } from "./pages";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "../components/apps/auth/PrivateRoute";
import StudentLayout from "../components/layouts/StudentLayout";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Público */}
                <Route path="/" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Admin */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute allowedRoles={["admin"]}>
                            <ThemeProvider theme={adminTheme}>
                                <TabsProvider>
                                    <AdminMainPage />
                                </TabsProvider>
                            </ThemeProvider>
                        </PrivateRoute>
                    }
                />

                {/* Student */}
                <Route
                    path="/student"
                    element={
                        <PrivateRoute allowedRoles={["student", "admin"]}>
                            <StudentLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<StudentMainPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="profile/edit" element={<ProfilePage />} />
                    <Route path=":plan/:course" element={<PostsListPage />} />
                    <Route path=":plan/:course/:post" element={<PostPage />} />
                </Route>

                {/* Not Found */}
                <Route path="*" element={<h1>404 - Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}
