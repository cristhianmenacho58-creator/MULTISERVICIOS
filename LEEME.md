# M&D Multiservicios — web estática

Solo HTML5 + CSS3 + JavaScript vanilla. Abre `index.html` con doble clic y funciona.

## Estructura

```
M&D-Multiservicios/
├── index.html
├── css/styles.css
├── js/script.js
├── img/  (logo, hero, servicios, proyectos, antes-despues, cta, testimonios)
└── favicon/favicon.svg
```

## Imágenes

Ya están las fotos reales que enviaste, en su lugar correspondiente:

- **Antes/después**: la escalera de madera (antes desgastada, después barnizada).
- **Proyectos**: instalación de cocina, tablero eléctrico, mesa de carpintería, tabiques
  de drywall, piso de parquet y revestimiento de mármol.
- **Servicios**: una foto representativa por cada uno (algunas son fotos genéricas, no de
  un trabajo específico de M&D, para ilustrar el servicio).
- **Hero y fondo del CTA**: se mantuvieron las imágenes que ya tenías ahí.
- **Logo y favicon**: sin cambios, siguen en SVG.

**Sobre `img/proyectos/bano.jpg`:** el archivo sigue llamándose así, pero la tarjeta ya
dice "Remodelación de parquet" (no baño), para que coincida con la foto real que es un
piso de madera restaurado. Si más adelante quieres, se puede renombrar el archivo a
`parquet.jpg`, pero no es necesario para que funcione.

## Testimonios

La sección está marcada como contenido de ejemplo. Antes de publicar, reemplaza los
textos por comentarios reales o elimina la sección completa (`<section id="testimonios">`).

## Cosas que quizá quieras ajustar

- **Dominio**: en `index.html` cambia `https://mdmultiservicios.com/` en el `canonical`,
  Open Graph, Twitter Cards y en los datos estructurados de Schema.org.
- **Tipografías**: se cargan desde Google Fonts. Si quieres una web 100% autónoma,
  borra los tres `<link>` marcados y quedarán las tipografías de respaldo del sistema.
- **Teléfono**: aparece en `index.html` y en la constante `TELEFONO` de `js/script.js`.
- **Política de privacidad / Términos**: los enlaces del pie apuntan a `#`; crea las
  páginas y cambia el `href`.

## Qué hace el JavaScript

Navbar compacta al hacer scroll, menú móvil accesible (Escape y clic fuera lo cierran),
enlace activo según la sección, aparición al hacer scroll, filtros de proyectos, modal de
imágenes con foco atrapado, comparador antes/después (arrastre, teclado y táctil) y el
formulario, que valida los campos y abre WhatsApp con el mensaje ya escrito. No hay
backend: nada se guarda ni se envía a un servidor.

Se respeta `prefers-reduced-motion`: si el usuario reduce animaciones, todo se muestra
sin movimiento.
