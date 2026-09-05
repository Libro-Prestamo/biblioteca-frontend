import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";


export function NavBar() {

    const { isAuthenticated, account, login, logout } = useAuth();

    return (
        <nav style={{ display : "flex", gap : '1rem', padding : '1rem', borderBottom : '1px solid #ccc'}}>
            <Link to="/">Catálogo</Link>
            <Link to="/prestamos">Mis Prestamos</Link>
            <Link to="/admin/libros">Administrar</Link>

            <div style={{marginLeft : "auto"}}>
                { isAuthenticated ? (
                    <>
                        <span style={{ marginRight : "0.5rem"}}>{account?.username}</span>
                        <button type="button" onClick={() => void logout()}>
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <button type="button" onClick={() => void login()}>
                        Iniciar sesión
                    </button>
                )}
            </div>
        </nav>
    )
}