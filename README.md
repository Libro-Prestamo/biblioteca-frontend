# Biblioteca · Frontend

SPA en React para el sistema de gestión de biblioteca (dominio **Libro–Préstamo**), desarrollada para la Evaluación Parcial N°1/N°2 de **DSY1107 - Desarrollo Cloud Native I**.

Implementa el flujo de autenticación **OAuth 2.0 / OpenID Connect (Authorization Code + PKCE)** contra **Microsoft Entra ID**, y consume la API del backend a través de un **API Gateway** que valida los tokens JWT.

## Stack

- React 18 + TypeScript + Vite
- React Router (navegación SPA)
- `@azure/msal-browser` + `@azure/msal-react` (autenticación)

## Arquitectura

```
Este frontend → API Gateway (AWS, valida JWT) → Backend Spring Boot (EC2) → RDS MySQL
       ↓
Microsoft Entra ID (login, emite Access Token)
```

El frontend nunca gestiona contraseñas ni valida tokens por sí mismo — obtiene el Access Token de Entra ID vía MSAL y lo adjunta en cada llamada protegida (`Authorization: Bearer ...`).

## Estructura del proyecto

```
src/
├── auth/           → integración MSAL: AuthProvider, useAuth, ProtectedRoute, msalConfig
├── types/          → interfaces TypeScript (Libro, Prestamo)
├── services/       → funciones fetch hacia el backend (vía API Gateway)
├── pages/          → CatalogoPage, LibroDetallePage, MisPrestamosPage, AdminLibrosPage
├── components/     → NavBar y componentes reutilizables
```

## Páginas y niveles de acceso

| Página | Ruta | Acceso |
|---|---|---|
| Catálogo | `/` | Público |
| Detalle de libro / solicitar préstamo | `/libros/:id` | Autenticado |
| Mis préstamos | `/prestamos` | Autenticado (`ProtectedRoute`) |
| Administrar catálogo | `/admin/libros` | Autenticado + rol `ADMIN` |

La verificación de rol en el frontend (`tieneRolAdmin()`) es solo de UX (oculta opciones que igualmente fallarían) — la autorización real la aplican el API Gateway y el backend.

## Configuración (variables de entorno)

Crea un archivo `.env.local` en la raíz del proyecto (no se versiona):

```dotenv
VITE_ENTRA_CLIENT_ID=<client-id-de-la-app-SPA-en-Entra-ID>
VITE_ENTRA_TENANT_ID=<tenant-id>
VITE_API_SCOPE=api://<api-client-id>/prestamo.write
VITE_API_BASE_URL=<url-del-api-gateway>
```

**Importante:** la URL de redirección (`window.location.origin`, ej. `http://localhost:5173` o el dominio de producción) debe estar registrada como *Redirect URI* tipo **SPA** en la App Registration de Entra ID — si no, el login falla con `AADSTS50011 (redirect_uri_mismatch)`.

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. El catálogo carga sin necesitar login; el resto de las páginas requieren autenticarse con un usuario del tenant de Entra ID del proyecto.

## Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos estáticos listos para servir.

## Despliegue

- **Hosting**: instancia EC2 (Nginx sirviendo los archivos de `dist/`), con la misma instancia donde corre el backend.
- **HTTPS**: Amazon CloudFront como CDN y terminador TLS, con origen apuntando al Nginx de la EC2 vía HTTP.
- **Nginx** configurado con fallback (`try_files ... /index.html`) para que las rutas de React Router funcionen al recargar la página.

## Notas de seguridad

- El Access Token se guarda en `sessionStorage` (se borra al cerrar la pestaña), no en `localStorage`.
- El flujo usa **Authorization Code con PKCE**, apropiado para clientes públicos como una SPA (sin `client_secret`).
- Los roles de Entra ID (`ROLE_ADMIN`) viajan en el **Access Token**, no en el ID Token — por eso `tieneRolAdmin()` decodifica el Access Token, no `account.idTokenClaims`.

## Repos relacionados

- Backend: [biblioteca-backend](https://github.com/Libro-Prestamo/biblioteca-backend)
