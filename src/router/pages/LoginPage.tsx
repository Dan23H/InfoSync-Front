import { Button, FormControl, Input, InputLabel, Paper, Typography, Box } from "@mui/material";
import { login } from "../../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorAlert from "../../components/common/ErrorAlert";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import InputAdornment from "@mui/material/InputAdornment";
import { motion } from "framer-motion";
// Existe un logo, importar aquí:
// import Logo from "../../assets/logo.png";

const formVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.8 } },
};

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
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

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
        <Box
            sx={{
                position: "fixed", // Ensure the background stays fixed
                top: 0,
                left: 0,
                minHeight: "100vh",
                minWidth: "100vw",
                height: "100%",
                width: "100%",
                backgroundImage: "url('/Vive-la-UAO.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden", // Prevent scrollbars
                zIndex: -1, // Ensure it stays behind other content
            }}
        >
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={formVariants}
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
                        <Typography variant="h5" fontWeight={700} color="red" mb={2}>
                            Iniciar sesión
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3} align="center">
                            Accede a tu cuenta académica para continuar
                        </Typography>
                        <form onSubmit={handleLogin} style={{ width: "100%" }}>
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
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {showPassword ? (
                                                <AiFillEyeInvisible
                                                    style={{ cursor: "pointer" }}
                                                    onClick={togglePasswordVisibility}
                                                />
                                            ) : (
                                                <AiFillEye
                                                    style={{ cursor: "pointer" }}
                                                    onClick={togglePasswordVisibility}
                                                />
                                            )}
                                        </InputAdornment>
                                    }
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
                                color="error"
                                fullWidth
                                sx={{ mt: 2, py: 1.2, fontWeight: 600, fontSize: "1rem" }}
                                disabled={!email || !password}
                            >
                                Iniciar sesión
                            </Button>
                        </form>
                        <Typography variant="body2" mt={2}>
                            ¿No tienes una cuenta?{" "}
                            <span
                                style={{ color: "blue", cursor: "pointer" }}
                                onClick={() => navigate("/register")}
                            >
                                Entra aquí para registrarte.
                            </span>
                        </Typography>
                    </Paper>
                </motion.div>
            </Box>
        </Box>
    );
}