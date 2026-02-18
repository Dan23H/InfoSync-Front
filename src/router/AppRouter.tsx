import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TabsProvider } from "../context/TabsContext";
import { ThemeProvider } from "@mui/material";
import { adminTheme } from "../themes/adminTheme";
import { AdminMainPage, PostPage, PostsListPage, StudentMainPage, LoginPage, ProfilePage, RegisterPage, IndexPage } from "./pages";
import PrivateRoute from "../components/apps/auth/PrivateRoute";
import StudentLayout from "../components/layouts/StudentLayout";
import { studentTheme } from "../themes/studentTheme";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <main role="main">
                <Routes>
                    {/* Público - General Theme */}
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/register" element={<RegisterPage />} />
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

                    {/* Student - Student Theme */}
                    <Route
                        path="/student"
                        element={
                            <PrivateRoute allowedRoles={["student", "admin"]}>
                                <ThemeProvider theme={studentTheme}>
                                    <StudentLayout />
                                </ThemeProvider>
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<StudentMainPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="profile/edit" element={<ProfilePage />} />
                        {/* Route for plan-level listing/search; queries are read from location.search inside the page */}
                        <Route path=":plan" element={<PostsListPage />} />
                        <Route path=":plan/:course" element={<PostsListPage />} />
                        <Route path=":plan/:course/:post" element={<PostPage />} />
                    </Route>

                    {/* Not Found */}
                    <Route path="*" element={<h1>404 - Not Found</h1>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}
