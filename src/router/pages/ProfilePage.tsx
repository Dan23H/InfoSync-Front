import { useState } from "react";
import { Box, Card, CardContent, Typography, Button, Grid, IconButton, Divider, Avatar, TextField } from "@mui/material";
import { useAuth } from "../../context/AuthContext"; // ajusta la ruta según tu proyecto
import { EditSVG } from "../../assets";
import { useMatch, useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { user } = useAuth();
    // user = { userId, userEmail, userName, password, role, status }

    const [showEmail, setShowEmail] = useState(false);
    const navigate = useNavigate();
    const isEditing = useMatch("/student/profile/edit");

    const censorEmail = (email: string) => {
        if (!email) return "";
        const [name, domain] = email.split("@");
        const hidden = name.length > 3 ? name.slice(0, 3) + "******" : "******";
        return `${hidden}@${domain}`;
    };

    return (
        <Grid container direction="column" sx={{ height: "100vh" }}>
            {/* Panel superior - Perfil */}
            <Grid size={{ xs: 12 }} sx={{ height: "25vh" }}>
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
                    <CardContent sx={{ height: "100%", display: "flex", position: "relative", p: 2 }}>
                        {/* Mitad izquierda */}
                        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>

                            {/* Avatar */}
                            <Avatar
                                src={user?.avatar || ""}
                                alt={user?.userName || "Perfil"}
                                sx={{ width: 100, height: 100, fontSize: 40 }}
                            >
                                {!user?.avatar && user?.userName ? user.userName[0] : ""}
                            </Avatar>

                            {/* Datos */}
                            <Grid sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                {isEditing ? (
                                    <>
                                        <Grid display="flex" justifyContent="center" sx={{ width: "100%" }}>
                                            <TextField
                                                label="Nombre"
                                                defaultValue={user?.userName}
                                                sx={{ mb: 2, width: "75%" }}
                                            />
                                        </Grid>
                                        <Grid display="flex" justifyContent="center" sx={{ width: "100%" }}>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate("/student/profile");
                                                }}
                                            >
                                                Guardar cambios
                                            </Button>
                                        </Grid>
                                    </>
                                ) : (
                                    <Grid>
                                        <Typography variant="body1"><strong>Nombre:</strong> {user?.userName ?? "N/A"}</Typography>
                                        <Typography variant="body1">
                                            <strong>Correo:</strong>{" "}
                                            {showEmail ? user?.userEmail : censorEmail(user?.userEmail ?? "")}
                                            <Button
                                                variant="text"
                                                color="primary"
                                                size="small"
                                                onClick={() => setShowEmail((prev) => !prev)}
                                                sx={{ ml: 1 }}
                                            >
                                                {showEmail ? "Ocultar" : "Mostrar"}
                                            </Button>
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Rol:</strong>{" "}
                                            {user?.role === "admin"
                                                ? "Administrador"
                                                : user?.role === "student"
                                                    ? "Estudiante"
                                                    : "??"}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Estado:</strong>{" "}
                                            {user?.status === "active"
                                                ? "Activo"
                                                : user?.status === "banned"
                                                    ? "Sancionado"
                                                    : "N/A"}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>

                            {/* Botón editar */}
                            {isEditing ? <></> : <IconButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/student/profile/edit");
                                }}
                                sx={{ ml: "auto" }}
                            >
                                <img src={EditSVG} alt="editar-perfil" width={20} height={20} />
                            </IconButton>}
                        </Box>

                        {/* Divider central */}
                        <Divider
                            orientation="vertical"
                            sx={{
                                position: "absolute",
                                left: "49.89%",
                                top: 0,
                                bottom: 0,
                                height: "100%",
                                borderColor: "grey.300",
                                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                            }}
                        />
                        <Divider
                            orientation="vertical"
                            sx={{
                                position: "absolute",
                                left: "50.11%",
                                top: 0,
                                bottom: 0,
                                height: "100%",
                                borderColor: "grey.300",
                                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                            }}
                        />

                        {/* Mitad derecha */}
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", pl: 4 }}>
                            <Typography variant="body1">
                                Cantidad de Publicaciones: {user?.postCount ?? 0}
                            </Typography>
                            <Typography variant="body1">
                                Cantidad de Comentarios: {user?.commentCount ?? 0}
                            </Typography>
                            <Typography variant="body1">
                                {`Fecha de Registro: ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}`}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <br />
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
