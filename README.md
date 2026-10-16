# Sistema de Inventario

Aplicación de escritorio para Windows que gestiona el inventario y las ventas de un negocio. Funciona sin conexión a internet y se instala con un único `.exe`.

## Funcionalidades

- **Productos**: CRUD, búsqueda por código o nombre, alerta de stock bajo y paginación.
- **Categorías**: CRUD y vista de los productos de cada categoría.
- **Ventas**:
  - Venta con varios productos, buscados en vivo por código o nombre.
  - Subtotal y total calculados automáticamente, con descuento.
  - Métodos de pago configurables desde la misma pantalla.
  - Filtros por rango de fechas y método de pago.
  - Detalle de cada venta.
  - La salida de inventario se registra al guardar la venta.
- **Facturación**: factura para impresora térmica de 80 mm, con los datos del negocio.
- **Reporte de ventas**: ticket imprimible con las ventas del periodo y los totales por método de pago.
- **Inventario**: movimientos de entrada, salida y ajuste, con validación de stock.
- **Clientes**: CRUD, número de compras por cliente y filtro por rango de fechas.
- **Proveedores y usuarios**: CRUD completo.
- **Dashboard**: resumen general y lista de productos con stock bajo.
- **Seguridad**: login con contraseñas encriptadas (BCrypt) y roles (Administrador y Empleado).
- **Configuración inicial**: en el primer arranque se crea la cuenta de administrador.
- **Respaldos**: copia automática de la base de datos todos los días a las 11:50 PM y 2 minutos después de abrir la app, además del respaldo manual. Se conservan los últimos 14. La carpeta de destino se puede cambiar, por ejemplo a otro disco.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | Java 17, Spring Boot, Spring Data JPA (Hibernate), Spring Security (BCrypt) |
| Base de datos | SQLite |
| Frontend | Angular (componentes standalone) |
| Escritorio | Electron + electron-builder (instalador NSIS) |
| Runtime Java | JRE mínimo embebido, generado con `jlink` |

## Estructura del proyecto

```
SistemaInventario/
├── backend/     API REST (Spring Boot)
├── frontend/    Interfaz (Angular)
├── desktop/     Empaquetado de escritorio (Electron)
│   └── resources/   backend.jar, jre/ e inventario_vacio.db (se generan, no se versionan)
└── database/
    └── esquema.sql  Esquema de la base de datos y datos base
```

## Requisitos para desarrollo

- JDK 17
- Maven
- Node.js (LTS) y npm
- Angular CLI (`npm install -g @angular/cli`)

## Ejecutar en desarrollo

### 1. Base de datos

Crea un archivo SQLite ejecutando `database/esquema.sql`. El script crea las tablas e inserta los roles, los tipos de movimiento y los métodos de pago base.

Ajusta las rutas en `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:sqlite:RUTA/A/inventario.db
app.database.path=RUTA/A/inventario.db
app.backup.path=RUTA/A/backups
```

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

La API queda en `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
ng serve
```

La interfaz queda en `http://localhost:4200`. En el primer arranque se muestra la pantalla de configuración inicial para crear el administrador.

## Generar el instalador de Windows

Todos los comandos se ejecutan desde la raíz del proyecto.

**1. Compilar el backend**

```bash
cd backend
mvn clean package
```

Copia `target/backend-0.0.1-SNAPSHOT.jar` a `desktop/resources/backend.jar`.

**2. Crear el JRE embebido**

```bash
jlink --module-path "%JAVA_HOME%\jmods" --add-modules java.base,java.compiler,java.desktop,java.instrument,java.logging,java.management,java.naming,java.net.http,java.scripting,java.security.jgss,java.sql,java.transaction.xa,java.xml,jdk.unsupported,jdk.crypto.ec,jdk.crypto.cryptoki --output jre-minimo --strip-debug --no-header-files --no-man-pages --compress=2
```

Copia la carpeta `jre-minimo` a `desktop/resources/jre/`. Para comprobar que funciona:

```bash
jre-minimo\bin\java.exe -jar backend\target\backend-0.0.1-SNAPSHOT.jar
```

**3. Crear la base de datos vacía**

Crea un archivo SQLite nuevo, ejecuta `database/esquema.sql` y guárdalo como `desktop/resources/inventario_vacio.db`. No agregues usuarios, productos ni ventas: el administrador se crea en el primer arranque.

**4. Compilar el frontend**

```bash
cd frontend
ng build --base-href ./
```

Copia el contenido de `dist/frontend/browser/` a `desktop/frontend-dist/`.

**5. Empaquetar**

```bash
cd desktop
npm install
npm run build
```

El instalador queda en `desktop/dist/` como `Sistema de Inventario Setup x.x.x.exe`. Para probar sin generar el instalador, usa `npm start` dentro de `desktop`.

## Datos del usuario

La aplicación instalada guarda sus datos en:

```
%APPDATA%\sistema-inventario-desktop\database\
├── inventario.db
└── backups\
```

La primera vez que se abre, copia `inventario_vacio.db` como base de datos inicial. Los datos no se pierden al actualizar la aplicación.

## Personalización

- **Datos del negocio** (nombre, dirección, teléfono, horario) para las facturas: `frontend/src/app/core/constants/empresa.ts`.
- **Ancho del papel**: las facturas y los reportes usan 80 mm. Para impresoras de 58 mm, cambia `80mm` por `58mm` en `factura.css` y `reporte-ventas.css`.

## Notas de seguridad

- Al ser una aplicación de escritorio, el backend solo escucha en `localhost`. Los endpoints de la API no exigen autenticación y el control de acceso por rol se aplica en la interfaz. Si en el futuro se expone la API en una red, hay que protegerla con tokens (por ejemplo JWT).
- El instalador no está firmado digitalmente, así que Windows SmartScreen puede mostrar una advertencia. Se continúa con **Más información → Ejecutar de todas formas**.

## Licencia

Por definir.