# 🐍 Python Escape Room — Bootcamp IA Día 1

Juego interactivo para conocer el nivel de Python de los participantes de forma divertida. Estética terminal hacker, 6 salas con dificultad progresiva, y un mapa de habilidades al final.

## 🚀 Deploy en GitHub Pages (5 minutos)

### Paso 1: Crear repositorio
1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repo: `escape-room-python`
3. Ponlo **público**
4. No añadas README ni .gitignore (ya los tienes)
5. Click **Create repository**

### Paso 2: Subir el código
```bash
cd escape-room
git init
git add .
git commit -m "escape room bootcamp"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/escape-room-python.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages
1. Ve a **Settings** → **Pages** en tu repo
2. En **Source** selecciona: **GitHub Actions**
3. Listo! El workflow ya está configurado

### Paso 4: Esperar ~2 minutos
El Action se ejecuta automáticamente. Cuando termine, tu juego estará en:

```
https://TU-USUARIO.github.io/escape-room-python/
```

## 💡 Personalización

### Cambiar el nombre del repo
Si usas otro nombre de repo, edita `vite.config.js` y cambia el `base`:
```js
base: '/nombre-de-tu-repo/',
```

### Añadir o modificar salas
Edita el array `ROOMS` en `src/App.jsx`. Cada sala tiene:
- `name`, `icon`, `description` — lo visual
- `puzzle.code` — el código Python a descifrar
- `puzzle.options` — las 4 opciones (marca `correct: true` y asigna `level: 1-3`)
- `puzzle.hint` y `puzzle.explanation`

## 🎯 Cómo usarlo en el bootcamp
1. Comparte el link con los participantes
2. Cada persona juega desde su móvil/portátil (~5-8 min)
3. Al final ven su "Mapa de Habilidades" personal
4. Puedes pedirles que compartan pantalla o que te digan su badge

## Desarrollo local
```bash
npm install
npm run dev
```
