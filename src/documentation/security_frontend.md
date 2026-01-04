# PrediApp Frontend — Seguridad (estado actual) + Plan de mejoras
**Ubicación sugerida:** `src/documentation/security_frontend.md`  
**Fecha:** 2026-01-04  
**Alcance:** Frontend React (carpeta `src/`).  
> Nota honesta: en este chat tengo visibilidad completa de **muchas páginas** bajo `src/pages/` (lo que pegaste), y referencias a `components/`, `hooks/`, `api/`, `utils/` y `contexts/` (vía imports), pero no tengo el contenido completo de esos archivos. Donde falte evidencia directa, lo marco como **“No verificado en snippet”** y lo trato como hipótesis a validar cuando revisemos el repo local.

---

## 1) Mapa funcional (lo que hace el frontend)
### 1.1 Páginas principales
- **Auth**
  - `LoginPage.jsx`, `SignUpPage.jsx`
- **Home / Navegación**
  - `HomePage.jsx` (próximos/pasados)
  - `NavigationBar` (se usa en varias páginas)
- **Pronósticos**
  - `ProdeDispatcher.jsx` (elige Race vs Session por `location.state`)
  - `ProdeRacePage.jsx` (Top5 + VSC/SC + DNF)
  - `ProdeSessionPage.jsx` (Top3)
  - Resultados del prode:
    - `ProdeRaceResultPage.jsx`
    - `ProdeSessionResultPage.jsx`
- **Resultados “reales”**
  - `ResultsPage.jsx` (eventos pasados del año)
  - `SessionResultPage.jsx` (vista robusta con MissingResults)
  - `SessionResults.jsx` (vista alternativa legacy)
- **Ranking / Scoreboard**
  - `RankingPage.jsx` (ranking general + ranking por grupos)
  - `ScoreboardPage.jsx`
- **Grupos**
  - `GroupsPage.jsx`, `GroupPage.jsx`
- **Foro**
  - `ForoPage.jsx`, `PostPage.jsx`
- **Perfil**
  - `MyProfilePage.jsx` (edición de datos + foto)
- **Admin**
  - `AdminDashboardPage.jsx`
  - `AdminUsersManagementPage.jsx`
  - `AdminSessionManagementPage.jsx`
  - `AdminResultsManagementPage.jsx`
  - `AdminDriverManagementPage.jsx`
  - `AdminProdesManagementPage.jsx`
  - `AdminSessionResults.jsx` (carga manual resultados por sesión)

---

## 2) Flujo de seguridad implementado (lo que *sí* existe hoy)
### 2.1 Autenticación centralizada por contexto
**Evidencia:**
- Uso de `AuthContext` en:
  - `ForoPage.jsx` (`user`, `isAuthenticated`)
  - `PostPage.jsx` (`isAuthenticated`)
  - `GroupPage.jsx` (`user`)
  - `GroupsPage.jsx` (`user`)
  - `HomePage.jsx` (`user`)
  - `RankingPage.jsx` (`user`)
  - `MyProfilePage.jsx` (`user`, `isAuthenticated`, `loading`)
  - `ProdeRacePage.jsx`, `ProdeSessionPage.jsx` (`userId`)
  - Páginas de resultados del prode (`ProdeRaceResultPage`, `ProdeSessionResultPage`) usan `AuthContext` para userId

**Qué aporta:**
- Un punto común para saber si el usuario está logueado y quién es.
- Permite gating (mostrar/ocultar) acciones de UI en base a `isAuthenticated`.

**Limitación:**
- **No hay evidencia** (en lo pegado) de que el router tenga **guards** por ruta (por ejemplo, bloquear `/admin/*` a no-admin). El gating parece estar más en la UI que en el enrutado.

---

### 2.2 Bloqueo “suave” (UI gating) de acciones no permitidas
**Evidencia:**
- `ForoPage.jsx`: botón “+” (crear post) se deshabilita si no está autenticado.
- `PostPage.jsx`: componente de comentar `CommentPost` se pasa `isDisabled={!isAuthenticated}`.
- `GroupsPage.jsx`: si no está logueado, muestra warning y deshabilita “Crear grupo” y “Unirme”.
- `MyProfilePage.jsx`: redirecciones seguras si no autenticado o intenta ver perfil ajeno.

**Qué aporta:**
- Reduce acciones por error del usuario.
- Mejora UX.

**Limitación crítica:**
- Esto **no es seguridad real**. Cualquier usuario puede:
  - entrar por URL directamente
  - o disparar requests manuales si no hay control del backend
- La seguridad real debe estar en **backend** y en el **router guard**.

---

### 2.3 Redirecciones “seguras” en páginas sensibles (perfil)
**Evidencia (MyProfilePage.jsx):**
- Si no autenticado ⇒ navega a `/login`
- Si autenticado pero no es el mismo usuario ⇒ navega a su propio perfil `/profile/${authUser.id}`

**Qué aporta:**
- Evita exposición accidental de UI de edición para perfil ajeno.

**Limitación:**
- Si el backend permite actualizar cualquier userId sin validar, esto no protege. (Debe validarlo backend.)

---

### 2.4 Manejo de algunos errores HTTP (parcial)
**Evidencia:**
- `ResultsPage.jsx` detecta `403` y `401` y muestra mensajes específicos.
- Admin drivers/users/sessions manejan `err.message` y en algunos casos `err.response?.data?.message`.

**Qué aporta:**
- Mensajes más claros.

**Limitación:**
- No hay una política unificada (interceptor global). Cada page implementa distinto.

---

## 3) Riesgos de producción detectados (foco seguridad)
> Estos puntos son “banderas rojas” típicas de producción, basadas en lo observado.

### 3.1 Falta de guards de ruta para Admin (riesgo alto)
**Evidencia:**
- Páginas admin se renderizan sin checks visibles de `role`.
- En `AdminDashboardPage.jsx` hay links directos a `/admin/*`.
- En `AdminUsersManagementPage.jsx`, `AdminSessionManagementPage.jsx`, etc., no aparece `AuthContext` ni un chequeo de rol.

**Impacto:**
- Si el backend protege bien, el usuario verá errores 401/403.
- Si el backend tiene un bug de autorización, el frontend no frena nada.
- Aunque el backend bloquee, el UX será “pantalla rota” y repetición de errores.

**Recomendación (mejora a implementar):**
- `RequireAuth` + `RequireAdmin` a nivel router.

---

### 3.2 Dependencia de `location.state` para decidir flujos (riesgo medio/alto)
**Evidencia:**
- `ProdeDispatcher.jsx`: decide si es Race usando `state?.sessionType` y `state?.sessionName`.
- `ProdeRacePage.jsx` y `ProdeSessionPage.jsx` tienen defaults “fake” si no llega state.
- `SessionResultPage.jsx`: si no hay `location.state`, lanza error (“No se encontraron datos”).

**Impacto (seguridad + prod):**
- Deep link / refresh rompe flujos.
- Puede inducir a inconsistencias (ej: ver pantallas equivocadas o con datos “dummy”).
- No es “explotable” como vulnerabilidad clásica, pero sí es un riesgo fuerte de producción y confiabilidad.

**Recomendación:**
- “State optional”: si no hay state ⇒ `fetchSessionById(params.id)` y normalizar.

---

### 3.3 Inconsistencia de naming/DTO (riesgo medio)
**Evidencia:**
- `AdminProdesManagementPage.jsx` hace:
  - `sessionData?.id ?? sessionData?.session_id ?? sessionData?.sessionId`
  - `sessionName ?? session_name`
  - `sessionType ?? session_type`

**Impacto:**
- Errores silenciosos: sessionId inválido, updates que no corren, bugs intermitentes.
- Dificulta hardening de seguridad y validaciones.

**Recomendación:**
- Normalizador único `normalizeSession(raw)` y DTO canónico.

---

### 3.4 Navegación con `<a href>` en SPA (riesgo bajo pero molesto)
**Evidencia:**
- `AdminDashboardPage.jsx` usa `<a href="/admin/users">...`

**Impacto:**
- Full page reload
- Pierde state
- Aumenta probabilidad de “pantallas rotas” y errores de auth si se pierde contexto
- No es un bug de seguridad directo, pero complica la experiencia y el control del flujo.

**Recomendación:**
- Reemplazar por `<Link to="...">`.

---

### 3.5 Falta de política global de 401/403 (riesgo medio)
**Evidencia:**
- Manejo de errores es distinto por página.

**Impacto:**
- Comportamiento inconsistente: algunas pantallas muestran “error”, otras se quedan colgadas, otras no redirigen.
- Si el token expira, no hay un flujo claro.

**Recomendación:**
- Axios instance + interceptor: 401 => logout/redirect; 403 => aviso claro.

---

### 3.6 Subida de imagen de perfil (riesgo a validar)
**Evidencia parcial:**
- `MyProfilePage.jsx` hace `uploadProfilePicture(authUser.id, file)` y luego usa `FileReader` para preview.

**Riesgos típicos:**
- Si backend no valida MIME/size => riesgo DOS o almacenamiento de contenido peligroso.
- Si luego esa URL se renderiza sin control => riesgo XSS/HTML injection (depende cómo se use en `UserCardInfo`).

**Recomendaciones (a implementar, validando backend):**
- Frontend: validar tipo/size (soft check)
- Backend: validar en serio; almacenar seguro; servir con headers correctos.

---

## 4) Flujo de seguridad recomendado (diseño objetivo)
> Lo que debería pasar en producción, de punta a punta.

### 4.1 Flujo de autenticación
1. Usuario entra a `/login`
2. Backend autentica y devuelve sesión (cookie httpOnly o JWT)
3. Frontend actualiza `AuthContext` (user, role)
4. Interceptor captura 401 => “sesión expirada” => logout => `/login`

### 4.2 Flujo de autorización por rutas (router)
- **Rutas Admin**: requieren `role=admin`
- **Rutas Auth-required**: requieren `isAuthenticated`
- **Rutas públicas**: login/signup, home (si tu producto lo permite)

### 4.3 Flujo de protección de requests
- `apiClient` único:
  - inyecta auth (header o cookie según contrato)
  - maneja 401/403 consistentemente
  - normaliza error messages

---

## 5) Mejoras a implementar (roadmap enfocado a seguridad + robustez prod)
> Este es el backlog recomendado, ordenado por prioridad (P0–P2).

### P0 — Bloqueo real de Admin + manejo global de sesión
1. **Route Guards**
   - Implementar `RequireAuth` y `RequireAdmin`
   - Envolver `/admin/*` con `RequireAdmin`
2. **Axios instance global**
   - `src/api/client.js`
   - interceptor para:
     - 401: logout + redirect `/login`
     - 403: mostrar “No autorizado”
3. **UI gating por role**
   - Ocultar links/botones admin si no admin (solo UX)

**Criterio de listo P0:**
- Un user normal no puede ver ninguna página admin (ni por URL).
- Si el backend responde 401, el usuario vuelve a login.

---

### P1 — Estabilización del flujo `sessions` (por cambios backend)
4. **Contrato SessionDTO canónico**
   - Definir `SessionDTO` (camelCase)
5. **Normalizador único**
   - `normalizeSession(raw)` y `normalizeSessions(list)`
   - eliminar `id ?? session_id ?? sessionId` disperso
6. **Eliminar dependencia de `location.state`**
   - Si no hay state => fetch por ID
   - Remover defaults “fake” tipo `Hungary` en producción (usar loading + fetch)

**Criterio de listo P1:**
- Deep links y refresh funcionan en prodes y resultados.
- No hay lógica de mapeo duplicada en páginas.

---

### P2 — Hardening adicional (defensa en profundidad) + limpieza
7. **Layouts**
   - `AppLayout`, `AdminLayout`, `AuthLayout` para eliminar repetición (y bugs)
8. **Unificar Results**
   - Elegir `SessionResultPage` o `SessionResults` (uno solo)
9. **Validaciones de inputs críticos**
   - Upload de imagen: size/mime
   - Forms: números (DNF 0-20 ya está bastante bien), selections completas
10. **Instrumentación y logging controlado**
   - Evitar `console.log` sensibles en prod
   - Manejo de errores centralizado

---

## 6) Hallazgos específicos (por archivo) — Seguridad / Prod
### AdminDashboardPage.jsx
- Usa `<a href>` (recarga completa). Mejor usar `<Link>`.
- No hay guard local ni validación de role.

### AdminUsersManagementPage.jsx
- No hay guard visible.
- Botón “Cambiar rol” y “Eliminar” deben estar protegidos por backend sí o sí.

### AdminSessionManagementPage.jsx
- No hay guard visible.
- `handleEditClick` transforma snake_case -> snake_case (interno). Esto sugiere falta de DTO canónico.

### AdminProdesManagementPage.jsx
- Maneja múltiples variantes de naming. Necesita normalizador.

### ProdeDispatcher.jsx / ProdeRacePage.jsx / ProdeSessionPage.jsx
- Dependencia de `location.state` para decidir tipo de sesión.
- Defaults “dummy” si no hay state => riesgoso en prod.

### SessionResultPage.jsx / SessionResults.jsx
- Duplicación de pantallas de resultados.
- `SessionResultPage` requiere `location.state`; si no, falla.

### ResultsPage.jsx
- Buen manejo de 401/403 (pero aislado).

### GroupsPage.jsx / GroupPage.jsx
- Hay gating básico si no autenticado.
- Acciones “Aceptar/Rechazar” están en console.log (pendiente implementar con control de permisos).

### ForoPage.jsx / PostPage.jsx
- Botón de crear post deshabilitado si no autenticado (bien como UX).
- Igual se requiere protección backend.

### MyProfilePage.jsx
- Buenas redirecciones seguras.
- Upload de imagen: validar size/mime (P2) y backend fuerte.

---

## 7) Recomendación de estructura de documentación (dentro de `src/documentation/`)
**Sugerencia de archivos:**
- `security_frontend.md` (este)
- `auth_contract.md` (cómo se autentica y cómo se obtiene role)
- `session_dto_contract.md` (contrato canónico y normalizador)
- `routing_policy.md` (qué rutas requieren qué permisos)
- `error_handling.md` (política 401/403 + UX)

---

## 8) Próximo paso (sin tocar código todavía)
Para cerrar Etapa 0 y arrancar con cambios recién después:

1) Confirmar (por escrito) el **Auth Contract**:
- ¿JWT en header o cookie httpOnly?
- ¿Cómo se obtiene user y role?

2) Confirmar el **Session DTO** actual del backend:
- campos + naming + tipos (date_start, date_end, session_name, etc.)

3) Definir el comportamiento deseado ante:
- 401 (sesión expirada)
- 403 (rol insuficiente)

> Con esos 3 contratos listos, recién ahí pasamos a implementar P0.

---
**Fin del documento**
