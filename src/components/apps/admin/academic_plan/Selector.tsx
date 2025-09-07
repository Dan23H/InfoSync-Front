import { Button, ButtonGroup, Grid } from "@mui/material";
import type { SelectorProps } from "../../../../models/types";

export default function Selector({
    semestre,
    setSemestre,
    seleccion,
    setSeleccion,
}: SelectorProps) {
    const handleRemove = () => {
        if (semestre > 1) {
            setSemestre(semestre - 1);
            if (seleccion > semestre - 1) {
                setSeleccion(semestre - 1); // mover selección si se borra el último
            }
        }
    };

    return (
        <Grid style={{ marginBottom: "15px" }}>
            <ButtonGroup>
                {semestre > 9 && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleRemove}
                    >
                        –
                    </Button>
                )}

                {[...Array(semestre)].map((_, i) => (
                    <Button
                        key={i + 1}
                        variant={seleccion === i + 1 ? "contained" : "outlined"}
                        color={seleccion === i + 1 ? "primary" : "inherit"}
                        size="small"
                        onClick={() => setSeleccion(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}

                {semestre < 12 && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSemestre(semestre + 1)}
                    >
                        +
                    </Button>
                )}
            </ButtonGroup>
        </Grid>
    );
}
