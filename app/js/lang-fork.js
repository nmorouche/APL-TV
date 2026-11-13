/* ============================================================
   lang-fork.js: the texts of this fork's additions (FORK.md), in French
   and in Polish, added to the project's tables (js/lang-fr.js,
   js/lang-pl.js) once they are loaded. In a file of their own: the
   project adds its translations at the top and at the end of its tables,
   where lines of this fork would conflict at every other version.
   Each key is the English text exactly as written in the code. A text
   the project translates itself one day keeps the project's translation.
   tools/check.py reads the French ones here too.
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
})(window);
