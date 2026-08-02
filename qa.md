<!--
  User QA notes — requirements archive for completed V2.5 (visual polish).
  Implementation summarized in PROJECT_ROADMAP.md. Permanent design: STYLES.md /
  PROJECT_STRUCTURE.md. Screenshots kept for reference:
  screenshot_keyboard_full_iso.png, screenshot_header.png, screenshot_games_selection.png.
-->

El layout del teclado está feo, no se ve ordenado, algunas filas están apretadas con otras, algunos botones faltan como "Print Screen", "Scroll Lock", "Pause Break" y "Num Lock". Ver [screenshot del keyboard](screenshot_keyboard_full_iso.png)

Quiero que el div class="min-w-0" esté un poco más arriba, está como en la parte de abajo del elemento padre. Además hay un problema de alineación entre los botones del toolbar, el botón de selección de teclado está un poco más abajo que los otros porque está en su propias sección junto con el texto span que dice "Keyboard". Ver [screenshot del header](screenshot_header.png)

Cuando hago click en Games y luego selecciono varios, cada uno de estos tiene por así decirlo una tarjeta con opciones Binding layers como "Movement & combat", "Gear & vehicles", "Menus & advanced(opt-in)", etc. Actualmente estas están una abajo de la otra. Me gustaría que estén de forma horizontal y no vertical. Ver [screenshot del binding layers](screenshot_games_selection.png)
