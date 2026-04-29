# Tripleten web_project_around_es

# 🌎 Around The U.S. (Alrededor de los EE.UU.)

Un proyecto web interactivo que permite a los usuarios explorar y compartir lugares emblemáticos de Estados Unidos a través de tarjetas visuales. Los usuarios pueden gestionar su perfil personal, agregar nuevos lugares, dar "me gusta" y eliminar contenido.

---

## 📖 Descripción del Proyecto

**Around The U.S.** es una aplicación web que simula una red social de viajes donde los usuarios pueden:

- ✏️ **Editar su perfil personal** (nombre, descripción y foto de avatar)
- 📍 **Agregar nuevas tarjetas** de lugares visitados con imágenes
- ❤️ **Dar "me gusta"** a las tarjetas de otros usuarios
- 🗑️ **Eliminar tarjetas** propias con confirmación
- 🖼️ **Visualizar imágenes** en tamaño completo con un popup
- 💾 **Persistencia de datos**: Todos los cambios se guardan en el servidor

El proyecto consume una **API RESTful** que maneja la autenticación, almacenamiento y recuperación de datos en tiempo real.

---

## 🚀 Funcionalidades Principales

### 👤 Gestión de Perfil

- Edición de nombre y descripción con validación en tiempo real
- Actualización de foto de avatar con hover effect
- Feedback visual durante la carga ("Guardando...")

### 📦 Tarjetas de Lugares

- Visualización de tarjetas cargadas desde el servidor
- Agregar nuevas tarjetas con título e imagen
- Sistema de "me gusta" con persistencia
- Eliminación de tarjetas con popup de confirmación
- Solo el propietario puede eliminar sus tarjetas

### 🎨 Experiencia de Usuario (UX)

- Popups modales con animaciones suaves
- Validación de formularios en tiempo real
- Estados de carga en botones
- Manejo de errores amigable
- Diseño responsive (móvil, tablet, desktop)

---

## 🛠️ Tecnologías y Técnicas Utilizadas

### Frontend

- **HTML5** - Estructura semántica y accesible
- **CSS3** - Estilos con Flexbox, animaciones y diseño responsive
- **JavaScript (ES6+)** - Programación orientada a objetos, módulos, promesas

### Arquitectura

- **Clases y Módulos ES6** - Código modular y reutilizable
- **API REST** - Comunicación con backend mediante fetch
- **Promesas y Async/Await** - Manejo de operaciones asíncronas
- **Validación de formularios** - Validación en tiempo real con regex

### Herramientas

- **Git** - Control de versiones
- **GitHub** - Alojamiento del repositorio
- **Figma** - Diseño UI/UX
- **VS Code** - Editor de código

### API

- **Around API** (TripleTen) - Backend que gestiona usuarios, tarjetas y likes
- **Autenticación** - Token-based authentication
- **Endpoints**: GET, POST, PUT, PATCH, DELETE

---

---

## 🎯 Características Técnicas Destacadas

### ✅ Implementación de Clases

- **Api**: Gestión centralizada de peticiones HTTP
- **Card**: Renderizado y gestión de tarjetas individuales
- **Section**: Renderizado masivo de elementos
- **Popup**: Clase base para modales reutilizables
- **UserInfo**: Gestión del perfil de usuario
- **FormValidator**: Validación en tiempo real de formularios

### ✅ Manejo de API

- **Promise.all()** para carga paralela de datos
- **Manejo de errores** con .catch() y mensajes amigables
- **Verificación de respuestas** con res.ok y status
- **Headers de autenticación** en todas las peticiones

### ✅ UX/UI

- **Feedback visual** durante operaciones (loading states)
- **Confirmación antes de eliminar** (popup de confirmación)
- **Cierre de popups** con Escape, click en overlay o botón X
- **Diseño responsive** con media queries

---

git clone https://github.com/wilsonwilsoon81-sudo/web_project_around_es.git
cd around

Autor
Wilson Herrera
📧 Email: wilson.wilsoon81@gmail.com
🐙 GitHub: https://github.com/wilsonwilsoon81-sudo

```

```
