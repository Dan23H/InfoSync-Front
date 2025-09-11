import { useEffect, useState, useMemo } from "react";
import { usePensums } from "./usePensums";

export function useCourses() {
    const { data, loading, error } = usePensums();

    const latest = data.length > 0 ? data[data.length - 1]._id : null;
    const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(latest);
    const [semestreSeleccionado, setSemestreSeleccionado] = useState<number | "">("");
    const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

    // asegurar que siempre haya plan seleccionado cuando hay datos
    useEffect(() => {
        if (data.length > 0 && !planSeleccionado) {
            setPlanSeleccionado(data[data.length - 1]._id);
        }
    }, [data, planSeleccionado]);

    const asignaturasFiltradas = useMemo(() => {
        return data
            .filter((p) => p._id === planSeleccionado)
            .flatMap((p) =>
                p.semesters.flatMap((s) =>
                    s.courses.map((c) => ({
                        ...c,
                        semesterNumber: s.semesterNumber,
                        planId: p._id,
                        planName: p.name,
                        type: c.type,
                    }))
                )
            )
            .filter((c) => (semestreSeleccionado !== "" ? c.semesterNumber === semestreSeleccionado : true))
            .filter((c) =>
                asignaturaSeleccionada
                    ? c.name.toLowerCase().includes(asignaturaSeleccionada.toLowerCase())
                    : true
            );
    }, [data, planSeleccionado, semestreSeleccionado, asignaturaSeleccionada]);

    const sugerencias = useMemo(() => {
        return [
            ...new Set(
                data
                    .filter((p) => p._id === planSeleccionado)
                    .flatMap((p) => p.semesters.flatMap((s) => s.courses.map((c) => c.name)))
                    .filter((name) =>
                        asignaturaSeleccionada
                            ? name.toLowerCase().includes(asignaturaSeleccionada.toLowerCase())
                            : false
                    )
            ),
        ].slice(0, 10);
    }, [data, planSeleccionado, asignaturaSeleccionada]);

    const cursosPorSemestre = useMemo(() => {
        return asignaturasFiltradas.reduce((acc: Record<number, any[]>, curso: any) => {
            if (!acc[curso.semesterNumber]) acc[curso.semesterNumber] = [];
            acc[curso.semesterNumber].push(curso);
            return acc;
        }, {});
    }, [asignaturasFiltradas]);

    return {
        data: data,
        loading: loading,
        error: error,
        planSeleccionado: planSeleccionado,
        setPlanSeleccionado: setPlanSeleccionado,
        semestreSeleccionado: semestreSeleccionado,
        setSemestreSeleccionado: setSemestreSeleccionado,
        asignaturaSeleccionada: asignaturaSeleccionada,
        setAsignaturaSeleccionada: setAsignaturaSeleccionada,
        mostrarSugerencias: mostrarSugerencias,
        setMostrarSugerencias: setMostrarSugerencias,
        asignaturasFiltradas: asignaturasFiltradas,
        sugerencias: sugerencias,
        cursosPorSemestre: cursosPorSemestre,
    };
}
