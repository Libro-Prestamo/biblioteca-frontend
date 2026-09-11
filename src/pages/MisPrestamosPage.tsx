import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import type { Prestamo } from "../types/Prestamo";
import { obtenerMisPrestamos } from "../services/prestamoService";

export function MisPrestamosPage() {

    const { getAccessToken } = useAuth();
    const [ prestamos, setPrestamos ] = useState<Prestamo[]>([]);
    const [ cargando, setCargando ] = useState(true);
    const [ error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAccessToken()
            .then(obtenerMisPrestamos)
            .then(setPrestamos)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    }, []);

    if (cargando) return <p>Cargando tus préstamos...</p>;
    if (error) return <p>Error : {error}</p>

    return (
        <div>
            <h1>Mis préstamos</h1>
            {prestamos.length === 0 ?(
                <p>No tienes préstamos activos.</p>
            ) : (
                <ul>
                    {prestamos.map((p) => (
                        <li key={p.id}>
                            {p.libro.titulo} - {p.estado}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

}