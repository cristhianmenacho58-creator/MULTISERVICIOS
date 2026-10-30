/* =========================================================
   M&D MULTISERVICIOS — JavaScript vanilla
   Módulos: navbar, menú móvil, scrollspy, revelado, filtros,
            modal de imágenes, comparador antes/después, formulario.
   ========================================================= */
(function () {
  'use strict';

  var TELEFONO = '51922473053';
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar: compactar al hacer scroll ---------- */
  (function navbarScroll() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    var ticking = false;

    function actualizar() {
      nav.classList.toggle('is-scroll', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(actualizar); }
    }, { passive: true });
    actualizar();
  })();

  /* ---------- Menú móvil ---------- */
  (function menuMovil() {
    var boton = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    var fondo = document.getElementById('navOverlay');
    if (!boton || !menu || !fondo) return;

    function abrir() {
      menu.classList.add('is-abierto');
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', 'Cerrar menú');
      fondo.hidden = false;
      document.body.classList.add('menu-abierto');
      var primero = menu.querySelector('a');
      if (primero) primero.focus();
    }

    function cerrar(devolverFoco) {
      menu.classList.remove('is-abierto');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
      fondo.hidden = true;
      document.body.classList.remove('menu-abierto');
      if (devolverFoco) boton.focus();
    }

    boton.addEventListener('click', function () {
      if (menu.classList.contains('is-abierto')) cerrar(true); else abrir();
    });

    fondo.addEventListener('click', function () { cerrar(false); });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrar(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-abierto')) cerrar(true);
    });

    // Al pasar a escritorio, se restablece el estado
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) cerrar(false);
    });
  })();

  /* ---------- Enlace activo según la sección visible ---------- */
  (function scrollSpy() {
    var enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
    var secciones = enlaces
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);
    if (!('IntersectionObserver' in window) || !secciones.length) return;

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        enlaces.forEach(function (a) {
          a.classList.toggle('is-activo', a.getAttribute('href') === '#' + entrada.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secciones.forEach(function (s) { obs.observe(s); });
  })();

  /* ---------- Aparición al hacer scroll ---------- */
  (function revelar() {
    var elementos = document.querySelectorAll('.reveal');
    if (!elementos.length) return;

    if (sinMovimiento || !('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entradas, observador) {
      entradas.forEach(function (entrada, i) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        el.style.transitionDelay = (i * 70) + 'ms';
        el.classList.add('is-visible');
        observador.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elementos.forEach(function (el) { obs.observe(el); });
  })();

  /* ---------- Filtros de proyectos ---------- */
  (function filtros() {
    var botones = document.querySelectorAll('.filtro');
    var proyectos = document.querySelectorAll('#galeria .proyecto');
    var vacio = document.getElementById('galeriaVacio');
    if (!botones.length || !proyectos.length) return;

    botones.forEach(function (boton) {
      boton.addEventListener('click', function () {
        var filtro = boton.dataset.filtro;
        var visibles = 0;

        botones.forEach(function (b) {
          var activo = b === boton;
          b.classList.toggle('is-activo', activo);
          b.setAttribute('aria-pressed', activo ? 'true' : 'false');
        });

        proyectos.forEach(function (p) {
          var mostrar = filtro === 'todos' || (p.dataset.cat || '').indexOf(filtro) !== -1;
          p.hidden = !mostrar;
          if (mostrar) visibles++;
        });

        if (vacio) vacio.hidden = visibles !== 0;
      });
    });
  })();

  /* ---------- Modal de detalle de servicio ---------- */
  (function modalServicios() {
    var modal = document.getElementById('modalServicio');
    if (!modal) return;
    var icono = document.getElementById('modalServicioIcono');
    var titulo = document.getElementById('modalServicioTitulo');
    var desc = document.getElementById('modalServicioDesc');
    var lista = document.getElementById('modalServicioLista');
    var cta = document.getElementById('modalServicioCta');
    var selectServicio = document.getElementById('servicio');
    var ultimoFoco = null;

    var DATOS = {
      electricidad: {
        nombre: 'Electricidad', icono: '#i-bolt',
        desc: 'Instalaciones, reparaciones y mantenimiento eléctrico para tu hogar o negocio.',
        items: ['Instalación de luminarias', 'Cableado eléctrico', 'Modificaciones de instalaciones', 'Cambio de tableros y llaves térmicas']
      },
      carpinteria: {
        nombre: 'Carpintería', icono: '#i-hammer',
        desc: 'Muebles y estructuras de madera a medida, con acabados finos.',
        items: ['Puertas', 'Clósets', 'Reposteros', 'Sol y sombra', 'Carport', 'Reparación de parquet']
      },
      drywall: {
        nombre: 'Drywall', icono: '#i-wall',
        desc: 'Divisiones y estructuras en drywall para ambientes nuevos o remodelados.',
        items: ['Divisiones interiores', 'Armado de estructura', 'Instalación de placas', 'Cielos rasos']
      },
      pintura: {
        nombre: 'Pintura', icono: '#i-roller',
        desc: 'Pintado de interiores y exteriores con acabados duraderos.',
        items: ['Pintura de interiores', 'Pintura de fachadas', 'Empastados', 'Preparación y sellado de superficies']
      },
      gasfiteria: {
        nombre: 'Gasfitería', icono: '#i-pipe',
        desc: 'Instalaciones y reparaciones de agua y desagüe.',
        items: ['Instalaciones sanitarias', 'Modificaciones de tuberías', 'Conexión de agua y desagüe', 'Reparación de fugas']
      },
      remodelacion: {
        nombre: 'Remodelación', icono: '#i-home',
        desc: 'Transformación integral de ambientes, de principio a fin.',
        items: ['Remodelación integral de ambientes', 'Cambio de acabados y revestimientos', 'Ampliación de espacios', 'Mejoras de distribución y funcionalidad']
      }
    };

    function abrir(clave, boton) {
      var datos = DATOS[clave];
      if (!datos) return;
      ultimoFoco = boton;

      icono.innerHTML = '<svg class="ico" aria-hidden="true"><use href="' + datos.icono + '"></use></svg>';
      titulo.textContent = datos.nombre;
      desc.textContent = datos.desc;
      lista.innerHTML = '';
      datos.items.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        lista.appendChild(li);
      });
      cta.href = '#cotizacion';
      cta.dataset.servicio = datos.nombre;

      modal.hidden = false;
      document.body.classList.add('menu-abierto');
      modal.querySelector('.modal__cerrar').focus();
    }

    function cerrar() {
      modal.hidden = true;
      document.body.classList.remove('menu-abierto');
      if (ultimoFoco) ultimoFoco.focus();
    }

    document.querySelectorAll('[data-servicio]').forEach(function (boton) {
      if (boton.id === 'modalServicioCta') return;
      boton.addEventListener('click', function () { abrir(boton.dataset.servicio, boton); });
    });

    cta.addEventListener('click', function () {
      // Si el select de servicio existe, se preselecciona con el servicio visto
      if (selectServicio && cta.dataset.servicio) {
        Array.prototype.forEach.call(selectServicio.options, function (op) {
          if (op.value === cta.dataset.servicio) selectServicio.value = op.value;
        });
      }
      cerrar();
    });

    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-cerrar')) cerrar();
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'Tab') {
        var foco = modal.querySelectorAll('button, a[href]');
        if (!foco.length) return;
        var primero = foco[0], ultimo = foco[foco.length - 1];
        if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
        else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
      }
    });
  })();

  /* ---------- Modal de imágenes (lightbox) ---------- */
  (function modal() {
    var modal = document.getElementById('modal');
    var img = document.getElementById('modalImg');
    var titulo = document.getElementById('modalTitulo');
    var desc = document.getElementById('modalDesc');
    if (!modal || !img) return;

    var ultimoFoco = null;

    function abrir(boton) {
      ultimoFoco = boton;
      img.src = boton.dataset.img;
      img.alt = boton.querySelector('img') ? boton.querySelector('img').alt : '';
      titulo.textContent = boton.dataset.titulo || '';
      desc.textContent = boton.dataset.desc || '';
      modal.hidden = false;
      document.body.classList.add('menu-abierto');
      modal.querySelector('.modal__cerrar').focus();
    }

    function cerrar() {
      modal.hidden = true;
      img.src = '';
      document.body.classList.remove('menu-abierto');
      if (ultimoFoco) ultimoFoco.focus();
    }

    document.querySelectorAll('.proyecto__btn').forEach(function (boton) {
      boton.addEventListener('click', function () { abrir(boton); });
    });

    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-cerrar')) cerrar();
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'Tab') {
        // El foco se mantiene dentro del modal
        var foco = modal.querySelectorAll('button, a[href]');
        if (!foco.length) return;
        var primero = foco[0], ultimo = foco[foco.length - 1];
        if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
        else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
      }
    });
  })();

  /* ---------- Comparador antes / después ---------- */
  (function comparador() {
    var caja = document.getElementById('comparador');
    var rango = document.getElementById('comparadorRange');
    if (!caja || !rango) return;

    function mover(valor) {
      valor = Math.min(100, Math.max(0, valor));
      caja.style.setProperty('--pos', valor + '%');
      rango.value = valor;
      rango.setAttribute('aria-valuetext', Math.round(valor) + '% del antes visible');
    }

    rango.addEventListener('input', function () { mover(parseFloat(rango.value)); });

    function desdeEvento(e) {
      var caja_ = caja.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - caja_.left;
      mover((x / caja_.width) * 100);
    }

    var arrastrando = false;
    caja.addEventListener('pointerdown', function (e) { arrastrando = true; desdeEvento(e); });
    window.addEventListener('pointermove', function (e) { if (arrastrando) desdeEvento(e); });
    window.addEventListener('pointerup', function () { arrastrando = false; });

    mover(50);
  })();

  /* ---------- Formulario de cotización -> WhatsApp ---------- */
  (function formulario() {
    var form = document.getElementById('formCotizacion');
    if (!form) return;
    var estado = document.getElementById('formEstado');

    var reglas = [
      { id: 'nombre', error: 'errNombre', msg: 'Escribe tu nombre completo.', valida: function (v) { return v.length >= 3; } },
      { id: 'telefono', error: 'errTelefono', msg: 'Escribe un teléfono válido (al menos 9 dígitos).', valida: function (v) { return (v.replace(/\D/g, '')).length >= 9; } },
      { id: 'servicio', error: 'errServicio', msg: 'Elige el servicio que necesitas.', valida: function (v) { return v !== ''; } },
      { id: 'mensaje', error: 'errMensaje', msg: 'Cuéntanos brevemente en qué consiste tu proyecto.', valida: function (v) { return v.length >= 10; } }
    ];

    function pintarError(regla, hayError) {
      var campo = document.getElementById(regla.id);
      var salida = document.getElementById(regla.error);
      campo.closest('.campo').classList.toggle('is-error', hayError);
      campo.setAttribute('aria-invalid', hayError ? 'true' : 'false');
      salida.textContent = hayError ? regla.msg : '';
    }

    reglas.forEach(function (regla) {
      var campo = document.getElementById(regla.id);
      campo.addEventListener('blur', function () {
        if (campo.value.trim() !== '') pintarError(regla, !regla.valida(campo.value.trim()));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var primerError = null;

      reglas.forEach(function (regla) {
        var valor = document.getElementById(regla.id).value.trim();
        var malo = !regla.valida(valor);
        pintarError(regla, malo);
        if (malo && !primerError) primerError = document.getElementById(regla.id);
      });

      if (primerError) {
        estado.textContent = 'Revisa los campos marcados para poder enviar tu solicitud.';
        estado.classList.remove('is-ok');
        primerError.focus();
        return;
      }

      var nombre = document.getElementById('nombre').value.trim();
      var telefono = document.getElementById('telefono').value.trim();
      var servicio = document.getElementById('servicio').value;
      var mensaje = document.getElementById('mensaje').value.trim();

      var texto = 'Hola Alfredo, mi nombre es ' + nombre + '. Estoy interesado en ' + servicio +
        '. Me gustaría solicitar una cotización. Mi proyecto consiste en: ' + mensaje +
        '. Mi número de contacto es ' + telefono + '.';

      window.open('https://wa.me/' + TELEFONO + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');

      estado.textContent = 'Listo: se abrió WhatsApp con tu mensaje. Si no se abrió, escríbenos al 922 473 053.';
      estado.classList.add('is-ok');
      form.reset();
    });
  })();

})();
