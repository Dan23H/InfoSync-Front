import { useState } from "react";
import { Box, Paper, FormControl, InputLabel, Input, Button, MenuItem, Select, Typography } from "@mui/material";
import { createUser } from "../../api";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/common/ErrorAlert";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import InputAdornment from "@mui/material/InputAdornment";
import { motion } from "framer-motion";
// Si existe un logo, importar aquí:
// import Logo from "../../assets/logo.png";

const formVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.8 } },
};

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [role, setRole] = useState<"student" | "admin">("student");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
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

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const togglePasswordConfirmVisibility = () => setShowPasswordConfirm((prev) => !prev);

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    minHeight: "100vh",
                    minWidth: "100vw",
                    height: "100%",
                    width: "100%",
                    backgroundImage: "url('/Vive-la-UAO.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    overflow: "hidden",
                    zIndex: -1,
                }}
            ></Box>
            <Box
                sx={{
                    minHeight: "90vh",
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
                        <Typography variant="h5" fontWeight={700} color="red" mb={2}>
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
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="passwordConfirm">Confirmar contraseña</InputLabel>
                                <Input
                                    id="passwordConfirm"
                                    type={showPasswordConfirm ? "text" : "password"}
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {showPasswordConfirm ? (
                                                <AiFillEyeInvisible
                                                    style={{ cursor: "pointer" }}
                                                    onClick={togglePasswordConfirmVisibility}
                                                />
                                            ) : (
                                                <AiFillEye
                                                    style={{ cursor: "pointer" }}
                                                    onClick={togglePasswordConfirmVisibility}
                                                />
                                            )}
                                        </InputAdornment>
                                    }
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
                                color="error"
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
                        <Typography variant="body2" mt={2} sx={{ cursor: "default" }}>
                            ¿Ya tienes una cuenta?{" "}
                            <span
                                style={{ color: "blue", cursor: "pointer" }}
                                onClick={() => navigate("/login")}
                            >
                                Inicia sesión aquí.
                            </span>
                        </Typography>
                    </Paper>
                </motion.div>
            </Box>
        </>
    );
}