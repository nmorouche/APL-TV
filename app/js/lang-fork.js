/* ============================================================
   lang-fork.js: the texts of this fork's additions (FORK.md), in French,
   Polish, Spanish and Italian, added to the project's tables
   (js/lang-fr.js, lang-pl.js, lang-es.js, lang-it.js) once they are loaded. In a file of their own: the
   project adds its translations at the top and at the end of its tables,
   where lines of this fork would conflict at every other version.
   Each key is the English text exactly as written in the code. A text
   the project translates itself one day keeps the project's translation.
   tools/check.py reads the ones here too.
   ============================================================ */
(function (global) {
    "use strict";

    function add(table, more) {
        if (!table) return;
        for (var k in more) if (Object.prototype.hasOwnProperty.call(more, k) && !Object.prototype.hasOwnProperty.call(table, k)) table[k] = more[k];
    }

    /* The channel list's programmes (the past ones, replay at once), their details, its two views (List or Grid),
       and going back in a live channel */
    add(global.TV_LANG_FR, {
        "Trailer": "Bande-annonce",
        "OK pause · ◀ ▶ 10 s · Back to the title": "OK pause · ◀ ▶ 10 s · Retour à la fiche",
        "Replay: 1 day": "Replay : 1 jour",
        "Replay: {n} days": "Replay : {n} jours",
        "{n} min": "{n} min",
        "▶ Programmes and replay": "▶ Programmes et replay",
        "▶ Programmes": "▶ Programmes",
        "OK: watch the replay": "OK : voir le replay",
        "OK: watch live  ·  Hold OK: start over": "OK : regarder en direct  ·  OK maintenu : depuis le début",
        "OK: watch live": "OK : regarder en direct",
        "Rating and cast: add your TMDB key in Settings.": "Note et casting : ajoute ta clé TMDB dans Réglages.",
        "Watch Live": "Regarder en direct",
        "Rewind": "Revenir en arrière",
        "This replay is not available right now.": "Ce replay n'est pas disponible pour le moment.",
        "Your provider may not keep this moment. Try another programme, or try again later.": "Ton fournisseur ne garde peut-être pas ce moment. Essaie un autre programme, ou réessaie plus tard.",
        "List": "Liste",
        "Grid": "Grille",
        "List View": "Vue liste",
        "Grid View": "Vue grille",
        "▲▼ List or Grid  ·  OK: open  ·  Back: close": "▲▼ Liste ou grille  ·  OK : ouvrir  ·  Retour : fermer",
        "◀ List or Grid": "◀ Liste ou grille",
        "Back: List or Grid": "Retour : liste ou grille",
        "Channels and Programmes": "Chaînes et programmes"
    });

    add(global.TV_LANG_PL, {
        "Trailer": "Zwiastun",
        "OK pause · ◀ ▶ 10 s · Back to the title": "OK pauza · ◀ ▶ 10 s · Wstecz do tytułu",
        "Replay: 1 day": "Powtórki: 1 dzień",
        "Replay: {n} days": "Powtórki: {n} dni",
        "{n} min": "{n} min",
        "▶ Programmes and replay": "▶ Programy i powtórki",
        "▶ Programmes": "▶ Programy",
        "OK: watch the replay": "OK: obejrzyj powtórkę",
        "OK: watch live  ·  Hold OK: start over": "OK: oglądaj na żywo  ·  Przytrzymaj OK: od początku",
        "OK: watch live": "OK: oglądaj na żywo",
        "Rating and cast: add your TMDB key in Settings.": "Ocena i obsada: dodaj klucz TMDB w Ustawieniach.",
        "Watch Live": "Oglądaj na żywo",
        "Rewind": "Cofnij",
        "This replay is not available right now.": "Ta powtórka jest teraz niedostępna.",
        "Your provider may not keep this moment. Try another programme, or try again later.": "Twój dostawca może nie przechowywać tego momentu. Wybierz inny program lub spróbuj później.",
        "List": "Lista",
        "Grid": "Siatka",
        "List View": "Widok listy",
        "Grid View": "Widok siatki",
        "▲▼ List or Grid  ·  OK: open  ·  Back: close": "▲▼ Lista lub siatka  ·  OK: otwórz  ·  Wstecz: zamknij",
        "◀ List or Grid": "◀ Lista lub siatka",
        "Back: List or Grid": "Wstecz: lista lub siatka",
        "Channels and Programmes": "Kanały i programy"
    });

    add(global.TV_LANG_ES, {
        "Trailer": "Tráiler",
        "OK pause · ◀ ▶ 10 s · Back to the title": "OK pausa · ◀ ▶ 10 s · Volver a la ficha",
        "Replay: 1 day": "Repetición: 1 día",
        "Replay: {n} days": "Repetición: {n} días",
        "{n} min": "{n} min",
        "▶ Programmes and replay": "▶ Programas y repeticiones",
        "▶ Programmes": "▶ Programas",
        "OK: watch the replay": "OK: ver la repetición",
        "OK: watch live  ·  Hold OK: start over": "OK: ver en directo  ·  Mantén OK: desde el principio",
        "OK: watch live": "OK: ver en directo",
        "Rating and cast: add your TMDB key in Settings.": "Nota y reparto: añade tu clave TMDB en Ajustes.",
        "Watch Live": "Ver en directo",
        "Rewind": "Retroceder",
        "This replay is not available right now.": "Esta repetición no está disponible ahora mismo.",
        "Your provider may not keep this moment. Try another programme, or try again later.": "Puede que tu proveedor no guarde este momento. Prueba otro programa o vuelve a intentarlo más tarde.",
        "List": "Lista",
        "Grid": "Cuadrícula",
        "List View": "Vista de lista",
        "Grid View": "Vista de cuadrícula",
        "▲▼ List or Grid  ·  OK: open  ·  Back: close": "▲▼ Lista o cuadrícula  ·  OK: abrir  ·  Atrás: cerrar",
        "◀ List or Grid": "◀ Lista o cuadrícula",
        "Back: List or Grid": "Atrás: lista o cuadrícula",
        "Channels and Programmes": "Canales y programas"
    });

    add(global.TV_LANG_IT, {
        "Trailer": "Trailer",
        "OK pause · ◀ ▶ 10 s · Back to the title": "OK pausa · ◀ ▶ 10 s · Torna alla scheda",
        "Replay: 1 day": "Replay: 1 giorno",
        "Replay: {n} days": "Replay: {n} giorni",
        "{n} min": "{n} min",
        "▶ Programmes and replay": "▶ Programmi e replay",
        "▶ Programmes": "▶ Programmi",
        "OK: watch the replay": "OK: guarda il replay",
        "OK: watch live  ·  Hold OK: start over": "OK: guarda in diretta  ·  Tieni premuto OK: ricomincia",
        "OK: watch live": "OK: guarda in diretta",
        "Rating and cast: add your TMDB key in Settings.": "Voto e cast: aggiungi la tua chiave TMDB in Impostazioni.",
        "Watch Live": "Guarda in diretta",
        "Rewind": "Torna indietro",
        "This replay is not available right now.": "Questo replay non è disponibile al momento.",
        "Your provider may not keep this moment. Try another programme, or try again later.": "Il tuo provider potrebbe non conservare questo momento. Prova un altro programma o riprova più tardi.",
        "List": "Elenco",
        "Grid": "Griglia",
        "List View": "Vista elenco",
        "Grid View": "Vista griglia",
        "▲▼ List or Grid  ·  OK: open  ·  Back: close": "▲▼ Elenco o griglia  ·  OK: apri  ·  Indietro: chiudi",
        "◀ List or Grid": "◀ Elenco o griglia",
        "Back: List or Grid": "Indietro: elenco o griglia",
        "Channels and Programmes": "Canali e programmi"
    });
})(window);
