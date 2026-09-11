export interface Prestamo {
    id : number;
    libro : {
        id : number;
        titulo : string;
        autor : string;
        isbn : string;
        stock : number;
        disponible : boolean;
    };
    usuario : string;
    fechaPrestamo : string;
    fechaDevolucion : string | null;
    estado : "ACTIVO" | "DEVUELTO";
}