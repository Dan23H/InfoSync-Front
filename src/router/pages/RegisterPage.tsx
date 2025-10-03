import { useState } from "react";
import { Box, Paper, FormControl, InputLabel, Input, Button, MenuItem, Select, Typography } from "@mui/material";
import { createUser } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/common/ErrorAlert";
// Si tienes un logo, importa aquí:
// import Logo from "../../assets/logo.png";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [role, setRole] = useState<"student" | "admin">("student");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordConfirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setLoading(true);
        try {
            await createUser({ userEmail: email, userName: userName, password, role });
            navigate("/login");
        } catch (err: any) {
            setError("Error al registrar usuario. Intenta con otro correo o nombre.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 3,
                    minWidth: { xs: "90vw", sm: 400 },
                    maxWidth: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Logo y título */}
                {/* <img src={Logo} alt="Logo" style={{ width: 80, marginBottom: 16 }} /> */}
                <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
                    Registro
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3} align="center">
                    Crea tu cuenta académica para acceder a la plataforma
                </Typography>
                <form onSubmit={handleRegister} style={{ width: "100%" }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="userName">Nombre de usuario</InputLabel>
                        <Input
                            id="userName"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="password">Contraseña</InputLabel>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="passwordConfirm">Confirmar contraseña</InputLabel>
                        <Input
                            id="passwordConfirm"
                            type="password"
                            value={passwordConfirm}
                            onChange={e => setPasswordConfirm(e.target.value)}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Rol</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            value={role}
                            label="Rol"
                            onChange={e => setRole(e.target.value as "student" | "admin")}
                        >
                            <MenuItem value="student">Estudiante</MenuItem>
                            <MenuItem value="admin">Administrador</MenuItem>
                        </Select>
                    </FormControl>
                    {error && (
                        <ErrorAlert
                            message={error}
                            actionLabel="Intentar de nuevo"
                            onAction={() => setError(null)}
                        />
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2, py: 1.2, fontWeight: 600, fontSize: "1rem" }}
                        disabled={
                            !email ||
                            !userName ||
                            !password ||
                            !passwordConfirm ||
                            loading
                        }
                    >
                        Registrarse
                    </Button>
                </form>
                <Typography variant="body2" mt={2}>
                    ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
                </Typography>
            </Paper>
        </Box>
    );
}