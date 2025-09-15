import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

export default function RouterPage() {
    return (
        <Grid container spacing={2} padding={2}>
            <Grid size={{ xs: 12 }}>
                <h1>Router Page</h1>
                <Link to="/admin">Go to Admin</Link>
                <br />
                <Link to="/student">Go to Student</Link>
            </Grid>
        </Grid>
    );
}