import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CatalogoPage } from "./pages/CatalogoPage"
import { NavBar } from "./components/NavBar"
import { LibroDetallePage } from "./pages/LibroDetallePage"
import { MisPrestamosPage } from "./pages/MisPrestamosPage"
import { AdminLibrosPage } from "./pages/AdminLibrosPage"
import { AuthProvider } from "./auth/AuthProvider"
import { ProtectedRoute } from "./auth/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
            <NavBar/>
            <Routes>
              <Route path="/" element={<CatalogoPage/>}></Route>
              <Route path="/libros/:id" element={<LibroDetallePage/>}></Route>
              <Route 
                path="/prestamos" 
                element={
                  <ProtectedRoute>
                      <MisPrestamosPage/>
                  </ProtectedRoute>
                }/>
              <Route path="/admin/libros" element={<AdminLibrosPage/>}></Route>
            </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  )
}

export default App
