# 🧪 El Economista – Technical Test

Proyecto técnico basado en Laravel 10, con Filament, Inertia.js y React, que permite la creación y gestión de formularios dinamicos por parte de usuarios normales y  administración de respuestas por parte de usuarios administradores.

---

## ✅ Requerimientos

- **Composer** `>= 2.8.9`
- **PHP** `>= 8.1`
- **Laravel** `v10.0+`
- **Node.js** (recomendado >= v20.x)

---

## 🚀 Instalación

```bash
git clone https://github.com/anber-02/elconomista-technical-test.git
cd elconomista-technical-test

composer install

cp .env.example .env
```

### 📦 Base de datos

Por defecto se usa **SQLite**.

Si deseas utilizar otro motor como **MySQL**, modifica el archivo `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

---

## 🛠️ Configuración

```bash
php artisan key:generate
php artisan migrate
php artisan db:seed
npm install
```

---

## 🔧 Compilación frontend (Vite)

### Opción 1 – Desarrollo (live reload):
```bash
composer run dev
```

### Opción 2 – Producción (recomendado para ver proyecto):
```bash
npm run build
php artisan serve
```

---

## 👥 Usuarios de prueba

| Rol      | Email              | Contraseña |
|----------|--------------------|-------------|
| Usuario  | test@example.com   | password    |
| Admin    | admin@example.com  | password    |

---

## 🧩 Funcionalidades

### 👤 Usuario normal
- Crear formularios con diferentes campos:
  - Texto
  - Archivo
  - Email
  - Select
- Al crear un formulario, aparece en el **Dashboard**.
- Haciendo clic en el formulario, puede rellenar los campos definidos.
- Al enviar el formulario:
  - Puede ver un enlace llamado **"Ver respuestas"** para revisar los datos enviados.

---

### 🛡️ Usuario admin
- Acceder a la sección **Formularios** desde el menú lateral.
- Visualizar todos los formularios enviados por los usuarios.
- Usar filtros por:
  - Usuario que envió el formulario
  - Fecha de envío
  - Si contiene archivos
- Ver en detalle los datos enviados de cada formulario.

---
