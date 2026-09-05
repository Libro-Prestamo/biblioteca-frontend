import { useEffect, useState } from "react";
import type { Libro } from "../types/Libro";
import { obtenerLibrosPublicos } from "../services/libroService";
import { Link } from "react-router-dom";



export function CatalogoPage() {
    
    const [libros, setLibros] = useState<Libro[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        obtenerLibrosPublicos()
        .then(setLibros)
        .catch((err) => setError(err.mesagge))
        .finally(() => setCargando(false));
    }, []);

    if (cargando) return <p>Cargando catalogo...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Catálogo de libros</h1>
            <ul>
                {libros.map((libro) => (
                    <li key={libro.id}>
                        <Link to={`/libros/${libro.id}`}>
                            <strong>{libro.titulo}</strong>
                        </Link>
                        {" "} - {libro.autor} ({libro.disponible ? "disponible" : "sin stock"} )
                    </li>
                ))}
            </ul>
        </div>
    )

}