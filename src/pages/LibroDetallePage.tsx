import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useEffect, useState } from "react";
import type { Libro } from "../types/Libro";
import { obtenerLibroPorId } from "../services/libroService";
import { solicitarPrestamo } from "../services/prestamoService";

export function LibroDetallePage() {
    const { id } = useParams();
    const { isAuthenticated, getAccessToken, login } = useAuth();

    const [libro, setLibro] = useState<Libro | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [solicitando, setSolicitando] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);

    useEffect(() => {
        if(!id) return;

        if(!isAuthenticated) { 
            setCargando(false);
            return;
        }

        getAccessToken()
            .then((token) => obtenerLibroPorId(id,token))
            .then(setLibro)
            .catch((err) => setError(err.mensaje))
            .finally(() => setCargando(false));
    }, [id, isAuthenticated]);

    async function handleSolicitarPrestamo() {
        if(!libro) return;

        setSolicitando(true);
        setMensaje(null);

        try {
            const token = await getAccessToken();
            await solicitarPrestamo(libro.id, token);
            setMensaje('Prestamo solicitado con exito');
            setLibro({...libro, stock : libro.stock - 1, disponible : libro.stock - 1 > 0});
        } catch (error) {
            setMensaje(error instanceof Error ? `Error: ${error.message}` : "Error desconocido");            
        } finally {
            setSolicitando(false);
        }
    }


        if(!isAuthenticated) {
            return (
                <section>
                    <p>Debes iniciar sesión para ver el detalle del libro.</p>
                    <button type="button" onClick={() => void login()}>
                        Iniciar sesión
                    </button>
                </section>
            );
        }

        if (cargando) return <p>Cargando libro...</p>
        if (error) return <p>Error: {error}</p>
        if (!libro) return <p>Libro no encontrado.</p>

        return (
            <div>
                <h1>{libro.titulo}</h1>
                <p>Autor : {libro.autor}</p>
                <p>ISBN : {libro.isbn}</p>
                <p>Stock : {libro.stock}</p>
            
                <button
                    type="button"
                    disabled={!libro.disponible || solicitando}
                    onClick={() => void handleSolicitarPrestamo()}
                >
                    {solicitando ? "Solicitando..." : "Solicitar prestamo"}
                </button>

                {mensaje && <p>{mensaje}</p> }
            </div>
        );



}