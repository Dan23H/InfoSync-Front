import { Button, Grid, Typography } from "@mui/material";
import { Typewriter } from "react-simple-typewriter";

export default function IndexPage() {
    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
            <Grid size={{ xs: 12 }} textAlign="center" mb={2}>
                <Typography variant="h1" align="center">
                    <Typewriter
                        words={["Welcome to InfoSync", "Your Academic Hub", "Improve Your Knowledge", "Share with Peers", "Welcome to InfoSync"]}
                        cursor
                        cursorStyle="|"
                        typeSpeed={70}
                        loop={1}
                        deleteSpeed={50}
                        delaySpeed={2000}
                    />
                </Typography>
                <Button variant="contained" color="error" href="/login" sx={{ mt: 4 }}>
                    Get Started
                </Button>
                <Button variant="text" color="error" href="/register" sx={{ mt: 4, ml: 2 }}>
                    Register
                </Button>
            </Grid>
        </Grid>
    );
}
