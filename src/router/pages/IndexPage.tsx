import { Button, Grid, Typography } from "@mui/material";
import { Typewriter } from "react-simple-typewriter";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();

    const buttonVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        exitLeft: { opacity: 0, x: -100, transition: { duration: 1 } },
        exitRight: { opacity: 0, x: 100, transition: { duration: 1 } },
        exitTop: { opacity: 0, transition: { duration: 1 } }
    };

    const handleNavigation = (path: string) => {
        setIsExiting(true);
        setTimeout(() => navigate(path), 1000);
    };

    return (
        <motion.div
            initial="initial"
            animate={isExiting ? "exit" : "initial"}
        >
            <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
                <Grid size={{ xs: 12 }} textAlign="center" mb={2}>
                    <motion.div
                        initial="hidden"
                        animate={isExiting ? "exitTop" : "visible"}
                        variants={buttonVariants}
                    >
                        <Typography variant="h1" align="center">
                            <Typewriter
                                words={["Bienvenid@ a InfoSync", "Mejora tu conocimiento", "Comparte con tus compañeros", "Tu espacio de aprendizaje", "Bienvenid@ a InfoSync"]}
                                cursor
                                cursorStyle="|"
                                typeSpeed={70}
                                loop={1}
                                deleteSpeed={50}
                                delaySpeed={2000}
                            />
                        </Typography>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        animate={isExiting ? "exitLeft" : "visible"}
                        variants={buttonVariants}
                        style={{ display: "inline-block", marginRight: "50px" }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ mt: 4 }}
                            onClick={() => handleNavigation("/login")}
                        >
                            Inicia sesión
                        </Button>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        animate={isExiting ? "exitRight" : "visible"}
                        variants={buttonVariants}
                        style={{ display: "inline-block" }}
                    >
                        <Button
                            variant="text"
                            color="error"
                            sx={{ mt: 4 }}
                            onClick={() => handleNavigation("/register")}
                        >
                            Registrarse
                        </Button>
                    </motion.div>
                </Grid>
            </Grid>
        </motion.div>
    );
}
