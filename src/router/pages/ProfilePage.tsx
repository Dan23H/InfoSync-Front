import { useState } from "react";
import { Box, Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { useAuth } from "../../context/AuthContext"; // ajusta la ruta según tu proyecto

export default function ProfilePage() {
    const { user } = useAuth();
    // user = { userId, userEmail, userName, password, role, status }

    const [showEmail, setShowEmail] = useState(false);

    const censorEmail = (email: string) => {
        if (!email) return "";
        const [name, domain] = email.split("@");
        const hidden = name.length > 3 ? name.slice(0, 3) + "******" : "******";
        return `${hidden}@${domain}`;
    };

    return (
        <Grid container direction="column" sx={{ height: "100vh" }}>
            {/* Panel superior - Perfil */}
            <Grid size={{ xs: 12 }} sx={{ height: "50vh" }}>
                <Card
                    sx={{
                        width: "95%",
                        height: "100%",
                        margin: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        boxShadow: 4,
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Perfil de Usuario
                        </Typography>

                        <Typography variant="body1">
                            <strong>Nombre:</strong> {user?.userName ?? "N/A"}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Correo:</strong>{" "}
                            {showEmail ? user?.userEmail : censorEmail(user?.userEmail ?? "")}
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => setShowEmail((prev) => !prev)}
                                sx={{ mt: 1, mb: 2 }}
                            >
                                {showEmail ? "Ocultar correo" : "Mostrar correo"}
                            </Button>
                        </Typography>

                        <Typography variant="body1">
                            <strong>Rol:</strong> {user?.role == "admin" ? "Administrador" : user?.role == "student" ? "Estudiante" : "??"}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Estado:</strong> {user?.status == "active" ? "Activo" : user?.status == "banned" ? "Sancionado" : "N/A"}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Panel inferior - Bookmarks */}
            <Grid size={{ xs: 12 }} sx={{ height: "50vh" }}>
                <Box
                    sx={{
                        width: "95%",
                        height: "100%",
                        margin: "auto",
                        border: "2px dashed grey",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Aquí irán las publicaciones guardadas...
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
}
