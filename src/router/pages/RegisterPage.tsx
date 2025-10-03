import { useState } from "react";
import { Grid, FormControl, InputLabel, Input, Button, MenuItem, Select, Typography } from "@mui/material";
import { createUser } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/common/ErrorAlert";

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
        <Grid container spacing={2} padding={2} justifyContent="center">
            <Grid sx={{ xs: 12, sm: 6 }} >
                <Typography variant="h5" align="center" gutterBottom>
                    Registro
                </Typography>
                <form onSubmit={handleRegister}>
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
                        sx={{ mt: 2 }}
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
            </Grid>
        </Grid>
    );
}