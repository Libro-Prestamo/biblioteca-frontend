import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../auth/useAuth";
import type { Libro } from "../types/Libro";
import { crearLibro, eliminarLibro, obtenerLibrosPublicos, type NuevoLibroRequest } from "../services/libroService";

export function AdminLibrosPage() {
    const { isAuthenticated, tieneRolAdmin, getAccessToken, login } = useAuth();

    const [libros, setLibros] = useState<Libro[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<NuevoLibroRequest>({
        titulo : "",
        autor : "",
        isbn : "",
        stock : 1,
    });

    function cargarLibros() {
        setCargando(true);
        obtenerLibrosPublicos()
            .then(setLibros)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    }

    useEffect(() => {
        cargarLibros();
    }, []);

    async function handleCrear(e : FormEvent) {
        e.preventDefault();
        setError(null);
    
        try {
            const token = await getAccessToken();
            await crearLibro(form, token);
            setForm({ titulo : "", autor : "", isbn : "", stock : 1});
            cargarLibros();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al crear libro");
        }
        
    }

    async function handleEliminar(id : number) {
        try {
            const token = await getAccessToken();
            await eliminarLibro(id, token);
            cargarLibros();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al eliminar el libro");            
        }
    }

    if (!isAuthenticated) {
        return (
            <section>
                <p>Debes iniciar sesion para administrar el catálogo</p>
                <button type="button" onClick={() => void login()}>
                    Iniciar sesión
                </button>
            </section>
        );
    }

    if (!tieneRolAdmin()) {
        return <p>No tienes permisos de administrador para ver esta página.</p>;
    }

    return (
        <div>
            <h1>Administrar catálogo</h1>

            <form onSubmit={(e) => void handleCrear(e)} style={{ marginBottom : "1.5rem"}}>
                <input
                    placeholder="Titulo"
                    value={form.titulo}
                    onChange={(e) => setForm({...form, titulo : e.target.value})}
                    required
                />
                <input
                    placeholder="Autor"
                    value={form.autor}
                    onChange={(e) => setForm({...form, autor : e.target.value})}
                    required
                />
                <input
                    placeholder="ISBN"
                    value={form.isbn}
                    onChange={(e) => setForm({...form, isbn : e.target.value})}
                    required
                />
                <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({...form, stock : Number(e.target.value)})}
                    required
                />
                <button type="submit">Agregar Libro</button>
            </form>

                {error && <p style={{color : 'red'}}>{error}</p> }
                {cargando ? (
                    <p>Cargano...</p>
                ) : (
                    <ul>
                        {libros.map((libro) => (
                            <li key={libro.id}>
                                {libro.titulo} - stock : {libro.stock}{" "}
                                <button type="button" onClick={() => void handleEliminar(libro.id)}>
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    )

}