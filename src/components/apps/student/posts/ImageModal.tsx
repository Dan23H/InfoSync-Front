import { Box, Modal, IconButton } from "@mui/material";

interface ImageModalProps {
    images: string[];
    open: boolean;
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    setCurrentIndex: (index: number) => void;
}

export default function ImageModal({
    images,
    open,
    currentIndex,
    onClose,
    onPrev,
    onNext,
    setCurrentIndex,
}: ImageModalProps) {
    if (!images || images.length === 0) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    bgcolor: "rgba(0,0,0,0.9)",
                    position: "relative",
                    p: 2,
                }}
            >
                {/* Botón cerrar */}
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 16, right: 16, color: "white" }}
                >
                    ✕
                </IconButton>

                {/* Botón anterior */}
                {images.length > 1 && (
                    <IconButton
                        onClick={onPrev}
                        sx={{
                            position: "absolute",
                            left: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "white",
                        }}
                    >
                        {"<"}
                    </IconButton>
                )}

                {/* Imagen principal */}
                <Box
                    component="img"
                    src={images[currentIndex]}
                    alt={`expanded-img-${currentIndex}`}
                    sx={{
                        height: "70vh",
                        borderRadius: 2,
                        mb: 2,
                    }}
                />

                {/* Carrusel de miniaturas */}
                {images.length > 1 && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            overflowX: "auto",
                            maxWidth: "90%",
                            p: 1,
                        }}
                    >
                        {images.map((img, i) => (
                            <Box
                                key={i}
                                component="img"
                                src={img}
                                alt={`thumb-${i}`}
                                onClick={() => setCurrentIndex(i)}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    cursor: "pointer",
                                    border: i === currentIndex ? "2px solid white" : "2px solid transparent",
                                    opacity: i === currentIndex ? 1 : 0.7,
                                    transition: "0.2s",
                                    "&:hover": { opacity: 1 },
                                }}
                            />
                        ))}
                    </Box>
                )}

                {/* Botón siguiente */}
                {images.length > 1 && (
                    <IconButton
                        onClick={onNext}
                        sx={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "white",
                        }}
                    >
                        {">"}
                    </IconButton>
                )}
            </Box>
        </Modal>
    );
}
