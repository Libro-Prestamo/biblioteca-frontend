export interface Prestamo {
    id : number;
    libroId : number;
    tituloLibro : string;
    usuario : string;
    fechaPrestamo : string;
    fechaDevolucion : string | null;
    estado : "ACTIVO" | "DEVUELTO";
}