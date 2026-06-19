# Flicacha — Frontend (React Native + Expo)

Frontend funcional y extensivo para **Flicacha**, una red social tipo microblogging, construido a partir del MER (`mer.puml`) que define: usuarios, posts, comentarios, likes (posts y comentarios), follows, hashtags, notificaciones y archivos multimedia.

> Este repositorio contiene **únicamente el frontend**. No implementa lógica de servidor; consume una API REST que debe ser construida por el equipo de backend siguiendo el contrato descrito más abajo.

---

## 🏗️ Arquitectura

El proyecto combina **Feature-based Design** con **Clean Architecture**, en 3 capas por feature:

```
src/
├── core/                          # Código compartido transversal (no es un "feature")
│   ├── domain/
│   │   ├── entities/               # Entidades de negocio (User, Post, Comment, ...) → 1:1 con el MER
│   │   └── repositories/           # Interfaces de repositorio (contratos, sin implementación)
│   └── infrastructure/
│       ├── api/                    # Cliente HTTP (axios), interceptores, manejo de 401
│       ├── storage/                 # SecureStore (tokens, sesión)
│       └── mappers/                 # snake_case <-> camelCase (opcional, ver abajo)
│
├── shared/                         # UI/lógica reutilizable entre features
│   ├── components/ui/              # Avatar, HashtagText, etc.
│   ├── components/layout/          # ErrorBoundary
│   ├── theme/                      # Design tokens (colores, tipografía, espaciados)
│   ├── navigation/                  # RootNavigator (stack + tabs)
│   └── utils/                       # timeAgo, formatDate, etc.
│
└── features/
    ├── auth/            (login, registro, sesión persistente)
    ├── feed/             (timeline principal, likes de posts)
    ├── post/             (crear post, detalle de post + comentarios)
    ├── profile/          (perfil propio/ajeno, editar perfil, follow/unfollow)
    ├── notifications/    (lista de notificaciones, marcar leídas)
    └── search/           (buscar posts/usuarios/hashtags, trending)
```

Cada feature sigue la misma subestructura **Clean Architecture**:

```
features/<feature>/
├── domain/
│   ├── entities/        # (si el feature necesita tipos propios además de los de core)
│   ├── repositories/    # Interfaces específicas del feature (si aplica)
│   └── usecases/        # Reglas de negocio puras, sin saber nada de UI ni HTTP
├── data/
│   ├── datasources/      # (si se requiere una fuente además de la API REST)
│   └── repositories/     # Implementación concreta del repositorio (llama a @core/infrastructure/api)
└── presentation/
    ├── screens/          # Pantallas (componentes "smart")
    ├── components/        # Componentes de UI propios del feature
    └── hooks/             # Hooks que conectan usecases + estado (Zustand/useState) a la UI
```

**Regla de dependencia:** `presentation` → `domain` ← `data`. La capa de dominio nunca importa de `data` ni de `presentation`; las pantallas nunca llaman a `axios` directamente, siempre pasan por un hook que usa un *usecase*.

### ¿Por qué esto importa para el backend?
Las interfaces en `core/domain/repositories/index.ts` son el **contrato exacto** que el frontend espera. Si el backend respeta los endpoints y formas de respuesta descritos abajo, el frontend funciona sin tocar una sola línea de UI.

---

## 🔌 Contrato de API esperado

Base URL configurable vía `EXPO_PUBLIC_API_URL` (ver `.env.example`).

### Convención de nombres (snake_case vs camelCase)
El MER usa `snake_case` (`user_id`, `created_at`...). El frontend trabaja internamente en `camelCase` (`userId`, `createdAt`...).

Hay dos formas de resolver esto (a elegir con tu compañero de backend):

1. **Recomendado:** el backend normaliza sus respuestas a `camelCase` antes de responder. El frontend no necesita hacer nada.
2. **Alternativa:** el backend responde tal cual el MER (`snake_case`). En ese caso, activa `EXPO_PUBLIC_API_SNAKE_CASE=true` en `.env` y el cliente HTTP (`src/core/infrastructure/api/apiClient.ts`) convertirá automáticamente snake_case ↔ camelCase en cada request/response usando `src/core/infrastructure/mappers/caseMapper.ts`.

### Paginación
Todos los listados devuelven:
```json
{
  "data": [ /* array de items */ ],
  "total": 120,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```
Query params: `?page=1&limit=20`

### Autenticación
Header: `Authorization: Bearer <accessToken>`

| Método | Endpoint              | Body                              | Respuesta                              |
|--------|------------------------|------------------------------------|------------------------------------------|
| POST   | `/auth/register`       | `{ name, email, password }`        | `{ user, tokens: { accessToken, refreshToken } }` |
| POST   | `/auth/login`          | `{ email, password }`              | `{ user, tokens }`                       |
| POST   | `/auth/logout`         | —                                   | `204`                                    |
| POST   | `/auth/refresh`        | `{ refreshToken }`                 | `{ accessToken, refreshToken }`          |

### Usuarios (`users`)
| Método | Endpoint                          | Body / Query             | Respuesta             |
|--------|-------------------------------------|---------------------------|-------------------------|
| GET    | `/users/:id`                        | —                          | `User`                  |
| PATCH  | `/users/:id`                        | `{ name?, avatarUrl? }`   | `User`                  |
| GET    | `/users/search?q=`                  | paginación                | `Paginated<User>`       |
| GET    | `/users/:id/followers`              | paginación                | `Paginated<User>`       |
| GET    | `/users/:id/following`              | paginación                | `Paginated<User>`       |
| POST   | `/users/:id/follow`                 | —                          | `204` (crea `user_follows`) |
| DELETE | `/users/:id/follow`                 | —                          | `204` (borra `user_follows`) |
| GET    | `/users/:id/is-following`           | —                          | `{ isFollowing: boolean }` |
| GET    | `/users/:id/posts`                  | paginación                | `Paginated<Post>`       |
| GET    | `/users/:id/liked`                  | paginación                | `Paginated<Post>` (vía `post_likes`) |

**Entidad `User`:**
```ts
{
  userId: number; name: string; email: string;
  avatarUrl: string | null; isActive: boolean;
  createdAt: string; updatedAt: string;
  followersCount?: number; followingCount?: number;
  postsCount?: number; isFollowing?: boolean;
}
```

### Feed y posts (`posts`, `media_files`, `post_hashtags`)
| Método | Endpoint                  | Body                                            | Respuesta        |
|--------|----------------------------|--------------------------------------------------|---------------------|
| GET    | `/feed`                    | paginación                                        | `Paginated<Post>`   |
| GET    | `/posts/:id`                | —                                                   | `Post`              |
| GET    | `/hashtags/:tag/posts`     | paginación                                        | `Paginated<Post>`   |
| POST   | `/posts`                   | `multipart/form-data`: `content, hashtags[], media[]` ó JSON `{ content, hashtags }` | `Post` |
| DELETE | `/posts/:id`               | —                                                   | `204`               |
| POST   | `/posts/:id/like`           | —                                                   | `204` (crea `post_likes`) |
| DELETE | `/posts/:id/like`           | —                                                   | `204` (borra `post_likes`) |

**Entidad `Post`:**
```ts
{
  postId: number; userId: number; content: string;
  isVisible: boolean; createdAt: string; updatedAt: string;
  user?: User; media?: MediaFile[]; hashtags?: Hashtag[];
  likesCount?: number; commentsCount?: number; isLiked?: boolean;
}
```
> El frontend extrae hashtags del texto (`#ejemplo`) y los envía en `hashtags[]`; el backend debe resolver/crear filas en `hashtags` + `post_hashtags`.

### Comentarios (`comments`, `comment_likes`)
| Método | Endpoint                          | Body                | Respuesta          |
|--------|--------------------------------------|------------------------|------------------------|
| GET    | `/posts/:postId/comments`           | paginación            | `Paginated<Comment>`  |
| POST   | `/posts/:postId/comments`           | `{ content }`          | `Comment`              |
| DELETE | `/comments/:id`                     | —                       | `204`                  |
| POST   | `/comments/:id/like`                | —                       | `204`                  |
| DELETE | `/comments/:id/like`                | —                       | `204`                  |

### Notificaciones (`notifications`)
| Método | Endpoint                          | Respuesta                  |
|--------|--------------------------------------|-------------------------------|
| GET    | `/notifications`                    | `Paginated<Notification>`     |
| GET    | `/notifications/unread-count`       | `{ count: number }`           |
| PATCH  | `/notifications/:id/read`           | `204`                          |
| PATCH  | `/notifications/read-all`           | `204`                          |

`type` ∈ `like_post | like_comment | comment | follow | mention` — debe generarse server-side cuando ocurre el evento correspondiente (p.ej. al crear un `post_like`, insertar una `notification` con `actor_id` = quien dio like).

### Búsqueda y hashtags
| Método | Endpoint                  | Respuesta                |
|--------|----------------------------|------------------------------|
| GET    | `/search/posts?q=`         | `Paginated<Post>`            |
| GET    | `/search/users?q=`         | `Paginated<User>`            |
| GET    | `/search/hashtags?q=`      | `Paginated<Hashtag>`         |
| GET    | `/hashtags/trending`       | `Hashtag[]`                  |

---

## 🚀 Cómo correr el proyecto

```bash
npm install
cp .env.example .env     # ajusta EXPO_PUBLIC_API_URL a tu backend local
npm start                # abre Expo Dev Tools
```

- `npm run android` / `npm run ios` / `npm run web`
- `npm run type-check` — valida TypeScript sin emitir
- `npm run lint` — ESLint

Requiere tener el backend corriendo (o un mock) en la URL configurada para que el feed, login, etc. respondan.

## 🎨 Sistema de diseño

Tema oscuro con acento "flame" (`#FF4500`), tipografías Syne (display) + DM Sans (cuerpo) + JetBrains Mono. Todo centralizado en `src/shared/theme/index.ts` — cambiar un color o tamaño ahí se propaga a toda la app.

## 📱 Pantallas implementadas

- **Auth:** Login, Registro (con validaciones de dominio en `usecases`)
- **Feed:** timeline infinito con pull-to-refresh, like optimista, FAB para crear post
- **Crear post:** composer con contador de 280 caracteres, selector de hasta 4 imágenes/videos, extracción automática de hashtags
- **Detalle de post:** vista completa + comentarios con like, envío de nuevo comentario
- **Perfil:** propio y de terceros, stats (posts/seguidores/siguiendo), follow/unfollow optimista, editar perfil (nombre + avatar)
- **Notificaciones:** lista con iconos por tipo, contador de no leídas, marcar todas como leídas
- **Búsqueda:** tabs Posts/Personas/Hashtags con debounce, sección de trending hashtags

## 🔐 Sesión y seguridad

- Tokens guardados en `expo-secure-store` (cifrado nativo), nunca en `localStorage`/AsyncStorage plano.
- Interceptor axios añade `Authorization` automáticamente y limpia la sesión ante un `401`.
- Estado global de auth en Zustand (`useAuthStore`), hidratado al abrir la app desde el storage seguro.

## 🧩 Extensibilidad

Para agregar un nuevo feature (p.ej. "mensajes directos"):
1. Crea `src/features/messages/{domain,data,presentation}`.
2. Define entidades/interfaces en `domain` (o reutiliza las de `core/domain/entities` si aplica).
3. Implementa el repositorio concreto en `data/repositories` llamando a `core/infrastructure/api`.
4. Crea un hook en `presentation/hooks` que use el repositorio vía un *usecase*.
5. Construye la pantalla en `presentation/screens` y regístrala en `shared/navigation/RootNavigator.tsx`.

Ningún feature existente necesita modificarse para que esto funcione — esa es la garantía de la arquitectura feature-based.
