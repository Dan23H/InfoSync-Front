import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, FormControlLabel, Grid, Radio, Autocomplete, RadioGroup } from "@mui/material";

interface ModalPostProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
    courses: { name: string; slug: string }[];
}

export default function ModalPost({ open, onClose, onSubmit, courses, initialData }: ModalPostProps) {
    const initialForm = {
        title: initialData?.title || "",
        subject: initialData?.subject || "",
        course: initialData?.course || "",
        type: initialData?.type || "",
        description: initialData?.description || "",
        images: [] as File[],
        files: [] as File[],
    };

    const [form, setForm] = useState(initialForm);

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (field: "images" | "files", files: FileList | null) => {
        if (files) {
            handleChange(field, Array.from(files));
        }
    };

    const handleSubmit = () => {
        console.log(form);
        if (!form.title || !form.subject || !form.type || !form.description) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }
        onSubmit(form);
        onClose();
    };

    useEffect(() => {
        if (!open) {
            setForm(initialForm);
        }
    }, [open, initialData]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Subir publicación</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    {/* Título y Asignatura */}
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Título"
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Autocomplete
                            freeSolo
                            options={courses.map((c) => c.name)}
                            value={form.course}
                            onChange={(_, value) => handleChange("course", value || "")}
                            onInputChange={(_, value) => handleChange("course", value)}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth label="Asignatura" />
                            )}
                        />
                    </Grid>

                    {/* Palabras clave */}
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Palabras clave"
                            value={form.subject}
                            onChange={(e) => handleChange("subject", e.target.value)}
                            helperText="Ejemplo: integrales, límites, cálculo diferencial"
                        />
                    </Grid>

                    {/* Tipo */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <RadioGroup
                                row
                                value={form.type}
                                onChange={(e) => handleChange("type", e.target.value)}
                            >
                                <FormControlLabel value="Q" control={<Radio />} label="Pregunta" />
                                <FormControlLabel value="S" control={<Radio />} label="Sugerencia" />
                            </RadioGroup>
                        </Box>
                    </Grid>

                    {/* Descripción */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Descripción"
                            multiline
                            minRows={4}
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                    </Grid>

                    {/* Imágenes y Archivos */}
                    <Grid size={{ xs: 6 }}>
                        <Button variant="outlined" component="label" fullWidth>
                            Subir Imágenes
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleFileChange("images", e.target.files)}
                            />
                        </Button>
                        <Box sx={{ mt: 1 }}>
                            {form.images.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 0.5,
                                        p: 0.5,
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <span style={{ fontSize: "0.85rem" }}>{file.name}</span>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                images: prev.images.filter((_, i) => i !== index),
                                            }))
                                        }
                                    >
                                        X
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <Button variant="outlined" component="label" fullWidth>
                            Subir Archivos
                            <input
                                hidden
                                type="file"
                                multiple
                                onChange={(e) => handleFileChange("files", e.target.files)}
                            />
                        </Button>
                        <Box sx={{ mt: 1 }}>
                            {form.files.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 0.5,
                                        p: 0.5,
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <span style={{ fontSize: "0.85rem" }}>{file.name}</span>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                files: prev.files.filter((_, i) => i !== index),
                                            }))
                                        }
                                    >
                                        X
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Publicar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
