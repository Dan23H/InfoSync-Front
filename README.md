# Ejecutando el proyecto
Si deseas ejecutar el frontend de forma local para desarrollo, debes colocar en la consola del editor preferido o
en la ubicación del proyecto lo siguiente:

```
npm run dev
```

Si por el contrario deseas utilizarlo en producción, recomendamos usar:

```
npm run build
```

Ten en cuenta que antes de ejecutarlo en producción debes crear/modificar el archivo de entorno siguiendo la 
estructura:

```env
# .env.template
VITE_BACK_API = "https://url-backend-here"
```
