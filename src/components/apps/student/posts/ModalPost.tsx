import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, FormControlLabel, Grid, Radio, Autocomplete, RadioGroup, Typography, FormControl, FormHelperText, Divider } from "@mui/material";
import { useAuth } from "../../../../context/AuthContext";
import { usePlan } from "../../../../context/PlanContext";

interface ModalPostProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
    courses: { name: string; slug: string }[];
}

export default function ModalPost({ open, onClose, onSubmit, courses, initialData }: ModalPostProps) {
    const { user } = useAuth();
    const { planId } = usePlan();

    const initialForm = {
        title: initialData?.title || "",
        subject: initialData?.subject || "",
        course: initialData?.course || (courses[0]?.name ?? ""),
        type: (initialData?.type as "Q" | "S") || "Q", // default válido
        description: initialData?.description || "",
        images: [] as File[],
        files: [] as File[],
        commentCount: initialData?.commentCount || 0,
        likeCount: initialData?.likeCount || 0,
        dislikeCount: initialData?.dislikeCount || 0
    };

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (field: "images" | "files", files: FileList | null) => {
        if (files) {
            setForm((prev) => ({
                ...prev,
                [field]: [...prev[field], ...Array.from(files)],
            }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.title || form.title.trim().length < 5) {
            newErrors.title = "El título debe tener al menos 5 caracteres.";
        }

        if (!form.subject) {
            newErrors.subject = "Las palabras clave son obligatorias.";
        } else if (form.subject.endsWith(" ")) {
            newErrors.subject = "Las palabras clave no deben terminar en espacio.";
        }

        if (!form.description || form.description.trim().length < 10) {
            newErrors.description = "La descripción debe tener al menos 10 caracteres.";
        }

        if (!form.course) {
            if (courses.length > 0) {
                handleChange("course", courses[0].name); // fallback al primero
            } else {
                newErrors.course = "Debes seleccionar una asignatura.";
            }
        }

        if (!form.type) {
            newErrors.type = "Debes seleccionar un tipo de publicación.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const payload = {
            userId: user._id,
            pensumId: planId,
            title: form.title.trim(),
            subject: form.subject.split(" ")[0].toLowerCase(),
            description: form.description.trim(),
            course: form.course.trim(),
            type: form.type as "Q" | "S",
            images: form.images?.length ? form.images : [],
            files: form.files?.length ? form.files : []
        };

        onSubmit(payload);
        onClose();
    };

    useEffect(() => {
        if (!open) {
            setForm(initialForm);
            setErrors({});
        }
    }, [open, initialData, courses]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth sx={{ maxWidth: "100%", userSelect: "none" }} >
            <DialogTitle>Subir publicación</DialogTitle>
            <DialogContent dividers sx={{ maxHeight: "60vh", overflowY: "auto" }}>
                <Grid container spacing={2}>
                    {/* Título y Asignatura */}
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Título"
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            error={!!errors.title}
                            helperText={errors.title}
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
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Asignatura"
                                    error={!!errors.course}
                                    helperText={errors.course}
                                />
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
                            helperText={errors.subject || "Ejemplo (una sola palabra): integrales"}
                            error={!!errors.subject}
                        />
                    </Grid>

                    {/* Tipo */}
                    <Grid size={{ xs: 6 }} >
                        <FormControl error={!!errors.type} sx={{ width: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: -0.5}}>
                                <Divider sx={{ flex: 1, borderColor: "rgba(0, 0, 0, 0.15)", borderBottomWidth: 2 }} />
                                <Typography sx={{ mx: 2, whiteSpace: "nowrap", color: "rgba(0, 0, 0, 0.5)", ":hover": { color: "rgba(0, 0, 0, 0.7)" } }}>Tipo</Typography>
                                <Divider sx={{ flex: 1, borderColor: "rgba(0, 0, 0, 0.15)", borderBottomWidth: 2 }} />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                <RadioGroup
                                    row
                                    value={form.type}
                                    onChange={(_, v) => handleChange("type", v as "Q" | "S")}
                                    sx={{ justifyContent: "center", width: "100%" }}
                                >
                                    <FormControlLabel value="Q" control={<Radio />} label="Pregunta" />
                                    <FormControlLabel value="S" control={<Radio />} label="Sugerencia" />
                                </RadioGroup>
                            </Box>
                            {!!errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    {/* Descripción */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Descripción"
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                    </Grid>


                    {/* Imágenes */}
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
                        <Box sx={{ mt: 1, maxHeight: 120, overflowY: "auto" }}>
                            {form.images ? <Typography variant="subtitle2">Subiendo {form.images.length} imágenes:</Typography> : null}
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
                                    <Typography style={{ fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>
                                        {file.name}
                                    </Typography>
                                    <Typography style={{ fontSize: "0.75rem", color: "gray", alignItems: "right" }}>
                                        {file.size < 1000000 ? `${(file.size / 1024).toFixed(2)} KB` : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                    </Typography>
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
                                        x
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Archivos */}
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
                        <Box sx={{ mt: 1, maxHeight: 120, overflowY: "auto" }}>
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
                                    <span style={{ fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>
                                        {file.name}
                                    </span>
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
                                        x
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
