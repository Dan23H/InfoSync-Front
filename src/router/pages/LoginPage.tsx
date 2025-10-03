import { Button, FormControl, Grid, Input, InputLabel } from "@mui/material";
import { login } from "../../api/endpoints";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorAlert from "../../components/common/ErrorAlert";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login: loginUser } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const result = await login({ userEmail: email, password: password });
            const { access_token: token, user } = result;
            loginUser(token, user);
            user.role === "admin" ? navigate("/admin") : navigate("/student");
        } catch (err: any) {
            setError("Credenciales incorrectas o error de servidor.");
        }
    };

    return (
        <Grid container spacing={2} padding={2} justifyContent="center">
            <Grid sx={{ xs: 12, sm: 6 }} >
                <form onSubmit={handleLogin}>
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
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
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
                        disabled={!email || !password}
                    >
                        Iniciar sesión
                    </Button>
                </form>
            </Grid>
        </Grid>
    );
}