#Descripción del Proyecto
Pagina Web para empresa inmobiliaria, ubicada en el sector del Oriente Antioqueño, con grande cobertura y una cantidad de propiedades a su administración, lo que permite tener un portafolio muy amplio para sus clientes


#Agents Rules
-   Cada función nueva debe incluir una línea de comentario encima en Español.
-   Todas las variables y funciones deben escribirse en camelCase
-   No uses snake_case
-   Trabajar todas las acciones y getters con stores, en la carpeta store
-   Folder /stores, se cargan los nuevos stores creados

## Características Implementadas



### Tablas Supabase
- Profiles (profiles) / Usuarios
- Properties (properties) / Propiedades, Vivienda o Inmueble
- Roles (roles) / Roles creados = Admin, Asesor
- Category (categorias) / Categorías de las propiedades, Apartamento, Casa, Finca, Lote, Local
- Status (status) / Estado de la Propiedad Arriendo/Venta
- Amenities (amenities) / Características de la propiedad

### Funcionalidades Principales

- **Autenticación y gestión de usuarios** 
- **Gestión de de Usuarios** con CRUD completo solo admin
- **Gestión de de Roles** asignación de roles a usuarios
- **Gestión de de Propiedades** con CRUD completo y asignación de información completa de propiedades



### Funcionalidades Especificas

- **Usuario Admin (role_id: 1)**
	-- Crea usuarios con todos los roles
	-- Creación de Propiedades CRUD completo
	-- Creación de Categoría CRUD completo
	-- Creación de Características CRUD Completo
	-- Ve listado de propiedades más visitadas
	-- Panel administrativo completo
	
- **Usuario Asesor (role_id: 2)**
	-- Crea usuarios con todos los roles
	-- Creación de Propiedades CRUD completo
	-- Creación de Categoría CRUD completo
	-- Creación de Características CRUD Completo
	-- Ve listado de propiedades más visitadas
    -- Compartir propiedades
	-- Panel administrativo completo


###  Módulos Implementados

1. **Autenticación** - Login, registro y gestión de perfiles
2. **Gestión de Usuarios** - CRUD de usuarios que crea el admin
3. **Gestión de Propiedades** - CRUD de Propiedades por admin y managers
4. **Gestión de Características** - CRUD de Características por propiedad


##  Stack Tecnológico

- **Frontend**: Nuxt 4
- **Rendering**: SSR
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Estado**: Pinia
- **Base de Datos Local**: IndexedDB
- **PWA**: Workbox (configurado)