/* ============================================================
   vod.js: Movies and Series.
   A row at the top (Sort, your provider's categories in your language, New,
   Top Rated, My List, then the genres and every provider's category in one
   list), the covers below in 7 columns, with
   the IMDb rating on each cover as soon as it is known. OK opens the
   title's page, OK held adds it to My List.
   ============================================================ */
(function (global) {
    "use strict";

    var TV = global.TV, el = TV.el, esc = TV.esc, T = TV.t, D = TV.data, S = TV.smart;

    function make(kind, viewId) {
        var root, chipsEl, chipStrip, gridClip, countEl, grid, chips = [], chipEls = [], chipIndex = 0, chipScroll = 0, zone = "grid", visible = false, catId = null, loadTimer = null, dirty = true;
        var genreList = null, coverStale = false;
        var provCats = [], provIds = {};          // the provider's categories in your language (the second chip)
        var SORTS = [["default", T("Default Order")], ["added", T("Recently Added")], ["az", T("A to Z")], ["year", T("Year, Newest First")], ["rating", T("Rating, Best First")]];
        var key = kind === "movies" ? "movies" : "series";

        function build() {
            root = TV.$(viewId);
            root.innerHTML = "";
            chipsEl = el("div", "vod__chips");
            chipStrip = el("div", "vod__chipstrip");
            chipsEl.appendChild(chipStrip);
            gridClip = el("div", "vod__grid");
            countEl = el("div", "vod__count");
            root.appendChild(chipsEl); root.appendChild(gridClip); root.appendChild(countEl);
            grid = new TV.Grid({ clip: gridClip, cols: 7, cw: 256, ch: 444, viewH: 820, make: TV.card.poster, onFocus: function (i, it) { bgFor(it); } });
        }
        var bgFor = TV.debounce(function (it) {
            return;                                     // fixed backdrop in the grid: smoother on the screen
            if (!visible || !it || zone !== "grid") return;
            if (it.backdrop) TV.bg(it.backdrop, "dark");
            TV.meta.lookup(it).then(function (m) { if (m && m.backdrop && grid.current() === it && visible) TV.bg(m.backdrop, "dark"); });
        }, 500);

        /* Sort, New, Top Rated, My List, then ONE chip for the rest: the genres (TMDB) and the provider's categories in a
           vertical list, like Live TV's Categories (a row of 30 chips to scroll through was too long). The chip shows
           the genre or category you are on. */
        function inList(id) { return !!id && ["sort", "prov", "recent", "top", "mylist", "watched", "genres"].indexOf(String(id)) < 0; }
        // one of the provider's categories of THIS kind (a movie category and a series one can share their number)
        function catIn(id) {
            var cat = D.catalog(), l = cat ? cat[key].cats : [];
            for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
            return null;
        }
        function nameOf(id) {
            if (String(id).indexOf("g:") === 0) { var g = (genreList || []).filter(function (x) { return "g:" + x.id === id; })[0]; return g ? g.name : ""; }
            if (id === "all") return T("All");
            var c = catIn(id);
            return c && c.name ? c.name : "";
        }
        /* ---------- your provider's own categories, one press away ----------
           The second chip, right after Sort: the provider's categories in your language only ("FR · Nouveautes",
           "FR · Comedie"…; every one when the provider names no language), without going through Genres, Provider's
           Categories, then the country. The chip shows the one you are on, or the last one you chose, or by default
           the provider's own new titles; ▼ goes to it, OK opens the list. The other countries stay in the last chip. */
        function provRead() {
            var cat = D.catalog(), adult = TV.pref("showAdult");
            var all = (cat ? cat[key].cats : []).filter(function (c) { return c.name && (adult || !c.adult) && !c.off && c.count !== 0 && !D.catNameHidden(c.name); });
            var mine = all.filter(function (c) { return c.lang === TV.lang; });
            provCats = mine.length ? mine : all;
            provIds = {};
            provCats.forEach(function (c) { provIds[c.id] = c; });
        }
        function isProv(id) { return !!id && Object.prototype.hasOwnProperty.call(provIds, id); }
        function provLabel(c) { return (c.tag ? c.tag + " · " : "") + c.name; }
        // the provider's own "new titles" category (it is usually its first one too)
        function provDefault() {
            for (var i = 0; i < provCats.length; i++) if (/nouveaut|\bnew\b|r[ée]cent|latest|derniers? ajouts?|neuheit|novit|estreno|nowo[sś]ci/i.test(provCats[i].name)) return provCats[i];
            return provCats[0] || null;
        }
        // the one the chip stands for: where you are, else the last one you chose, else the provider's new titles
        function provNow() {
            if (isProv(catId)) return provIds[catId];
            var last = TV.pref(key + "Prov");
            return isProv(last) ? provIds[last] : provDefault();
        }
        function openProv() {
            var cur = provNow();
            TV.menu(T("Provider's Categories"), provCats.map(function (c) {
                return { label: provLabel(c) + (c.count ? "  ·  " + c.count : ""), check: !!cur && c.id === cur.id, focus: !!cur && c.id === cur.id, run: function () {
                    load(c.id); buildChips(); paintChips();
                    if (grid.items.length) { zone = "grid"; grid.setActive(true); paintChips(); }
                } };
            }));
        }
        // a category that is still there and shown (a genre always is; one of the provider's may have gone or been hidden)
        function exists(id) { var c; return !inList(id) || String(id).indexOf("g:") === 0 || id === "all" || !!((c = catIn(id)) && c.name && !c.off); }
        function buildChips() {
            var sort = sortNow(), sortName = sort === "default" ? T("Sort") : SORTS.filter(function (s) { return s[0] === sort; })[0][1];
            provRead();
            var prov = provNow();
            chips = [{ id: "sort", name: sortName }].concat(prov ? [{ id: "prov", name: provLabel(prov) }] : [],
                [{ id: "recent", name: T("New") }, { id: "top", name: T("Top Rated") }, { id: "mylist", name: T("My List") }]);
            if (D.recentlyWatched(key).length) chips.push({ id: "watched", name: T("Recently Watched") });
            var cur = TV.pref(key + "Cat"), here = inList(cur) && !isProv(cur) ? nameOf(cur) : "";
            chips.push({ id: "genres", name: here || (genreList && genreList.length ? T("Genres") : T("Categories")) });
            if (!genreList) TV.meta.genres(kind === "movies" ? "movie" : "tv").then(function (l) { genreList = l; if (visible) { var keep = chips[chipIndex] && chips[chipIndex].id; buildChips(); selectChip(keep); paintChips(); } });
            chipStrip.innerHTML = "";
            chipEls = chips.map(function (c) {
                var e = el("div", "chip" + (c.id === "sort" && sort !== "default" ? " is-on" : ""),
                    (c.id === "sort" ? TV.icon("sort", 24) + "&nbsp;&nbsp;" : c.id === "genres" ? TV.icon("list", 24) + "&nbsp;&nbsp;" : c.id === "prov" ? TV.icon("film", 24) + "&nbsp;&nbsp;" : "") + esc(c.name));
                chipStrip.appendChild(e);
                return e;
            });
            selectChip(TV.pref(key + "Cat") || "prov");
        }
        function selectChip(want) {
            if (isProv(want)) want = "prov";                   // one of the provider's in your language: its own chip
            else if (inList(want)) want = "genres";            // a genre or another category: its chip is the list's
            chipIndex = 1;                                     // by default the chip after Sort (the provider's, else New), never Sort
            for (var i = 0; i < chips.length; i++) if (chips[i].id === want && want !== "sort") { chipIndex = i; break; }
        }
        /* The list: the genres, then the provider's categories (by country when there are many, as in Live TV) */
        function openGenres() {
            var cur = catId;
            function pick(id) {
                load(id); buildChips(); paintChips();
                if (grid.items.length) { zone = "grid"; grid.setActive(true); paintChips(); }
            }
            function provider() {
                TV.live.pickCategory(cur, function (c) { pick(c.id); }, [{ id: "all", name: T("All") }], key, T("Provider's Categories"));
            }
            if (!genreList || !genreList.length) { provider(); return; }
            var mine = String(cur).indexOf("g:") === 0;
            TV.menu(T("Genres"), genreList.map(function (g) {
                var id = "g:" + g.id;
                return { label: g.name, check: id === cur, focus: id === cur, run: function () { pick(id); } };
            }).concat([{ label: T("Provider's Categories"), icon: "list", focus: inList(cur) && !mine, run: provider }]));
        }

        /* Sort (first chip): the same titles in another order, for every category. Remembered for Movies and Series apart. */
        function sortNow() { var s = TV.pref(key + "Sort"); return s && s !== "default" ? s : "default"; }
        function sorted(list) {
            var how = sortNow();
            if (how === "default" || list.length < 2) return list;
            var rows = list.map(function (x, i) {
                var v;
                if (how === "az") v = S.fold(x.title || x.name);
                else if (how === "year") v = x.year || (TV.meta.known(x) || {}).year || 0;
                else if (how === "rating") { var m = TV.meta.known(x); v = (m && parseFloat(m.imdb)) || x.rating || 0; }
                else v = x.added || 0;
                return { x: x, v: v, i: i };
            });
            rows.sort(how === "az" ? function (a, b) { return a.v < b.v ? -1 : a.v > b.v ? 1 : a.i - b.i; }
                                   : function (a, b) { return (b.v - a.v) || (a.i - b.i); });
            return rows.map(function (r) { return r.x; });
        }
        function chooseSort() {
            var cur = sortNow();
            TV.menu(T("Sort By"), SORTS.map(function (s) {
                return { label: s[1], check: s[0] === cur, run: function () {
                    TV.setPref(key + "Sort", s[0]);
                    buildChips(); chipIndex = 0;
                    load(catId); zone = "chips"; grid.setActive(false); paintChips();
                } };
            }));
        }
        function paintChips() {
            chipEls.forEach(function (e, i) {
                e.classList.toggle("is-focused", i === chipIndex && zone === "chips" && TV.shell.focusOn() === "view");
                e.classList.toggle("is-current", chips[i].id === catId || (chips[i].id === "prov" && isProv(catId)) || (chips[i].id === "genres" && inList(catId) && !isProv(catId)));
            });
            var c = chipEls[chipIndex];
            if (c) TV.lift(c);
            if (c) {
                var x = c.offsetLeft, w = c.offsetWidth;
                if (x - chipScroll + w > 1700) chipScroll = x + w - 1700;
                if (x - chipScroll < 0) chipScroll = Math.max(0, x - 40);
                chipStrip.style.transform = "translateX(" + (-chipScroll) + "px)";
            }
        }
        // the provider's category you are on, when the list's chip is the one focused (OK held: hide it)
        function provCat() {
            var c = chips[chipIndex];
            if (!c || (c.id !== "genres" && c.id !== "prov") || (c.id === "prov") !== isProv(catId) || !inList(catId) || String(catId).indexOf("g:") === 0 || catId === "all") return null;
            var o = catIn(catId);
            return o && o.kind ? o : null;
        }
        function waiting(id) {
            if (String(id).indexOf("g:") === 0) return !D.genreReady(key, id.slice(2));
            return id === "top" && !D.topReady(key);
        }
        function load(id, keep) {
            keep = keep && id === catId && grid.items.length;
            if (id === "sort" || id === "genres") return;
            if (id === "prov") { var pn = provNow(); if (!pn) return; id = pn.id; }     // the provider's chip: the category it shows
            catId = id;
            TV.setPref(key + "Cat", id);
            if (isProv(id) && TV.pref(key + "Prov") !== id) TV.setPref(key + "Prov", id);
            var items = sorted(D.itemsIn(key, id));
            if (keep) grid.update(items); else grid.set(items, 0);
            grid.setActive(zone === "grid" && TV.shell.focusOn() === "view");
            
            if (!items.length) {
                gridClip.querySelector(".vod__gridin").innerHTML = "<div class='empty' style='top:200px;width:1728px'><div class='empty__text'>" +
                    esc(emptyText(id)) + "</div></div>";
            }
            paintChips();
        }

        function emptyText(id) {
            if (id === "mylist") return T("Nothing here yet: hold OK on a title to add it to My List.");
            if (id === "watched") return T("What you watch will appear here.");
            var cat = D.catalog();
            if (cat && !cat[key].items.length) return kind === "movies" ? T("No movies came from your playlists yet. APL TV asks your provider again by itself.") : T("No series came from your playlists yet. APL TV asks your provider again by itself.");
            if (waiting(id)) return T("Finding these titles in your catalog…");
            return D.offCats() ? T("Nothing here. Some countries or categories are hidden: Settings, Countries and Categories.") : T("Nothing here.");
        }

        /* A genre (Netflix, Anime…) or Top Rated still being found in the background grows while you browse it:
           the new titles join once you stop pressing keys, and you stay on the title you were on
           (before, the whole list started over from the first title: "it keeps jumping up"). */
        var refreshJob = null;
        function refreshSoon() {
            TV.uncalm(refreshJob);
            refreshJob = TV.calm(function () {
                if (!visible) { dirty = true; return; }
                if (!grid.items.length) { load(catId); return; }        // was showing "Finding these titles…"
                grid.update(sorted(D.itemsIn(key, catId)));
            }, 1200);
        }

        /* keep: the same category drawn again (a title hidden, the playlist refreshed): you stay where you were */
        function render(keep) {
            dirty = false;
            if (!D.catalog() || !D.sources().length) {
                chipStrip.innerHTML = ""; grid.set([], 0);
                gridClip.querySelector(".vod__gridin").innerHTML = "<div class='empty' style='top:160px;width:1728px'><div class='empty__title'>" + esc(T("No playlist yet")) +
                    "</div><div class='empty__text'>" + esc(T("Add one in Settings.")) + "</div></div>";
                return;
            }
            buildChips();
            var first = provDefault(), want = TV.pref(key + "Cat") || (first ? first.id : "recent");
            /* The first time with the provider's chip: Movies and Series open on the provider's new titles, once;
               after that, on the category you were last on, as before */
            if (first && !TV.pref(key + "ProvSeen")) { TV.setPref(key + "ProvSeen", 1); want = first.id; keep = false; }
            load(want !== "sort" && want !== "genres" && want !== "prov" && exists(want) ? want : (first ? first.id : "recent"), keep);
            buildChips(); paintChips();                                  // the chips again: they name the category now loaded
        }

        var view = {
            show: function () {
                if (!root) build();
                visible = true;
                if (dirty) render(true); else { paintChips(); if (coverStale) grid.refreshCard(grid.index); grid.draw(); }
                coverStale = false;
                TV.bg("", "dark");
            },
            hide: function () { visible = false; TV.meta.clearQueue(); TV.$("bg").classList.remove("is-dark"); },
            enter: function () { zone = grid.items.length ? "grid" : "chips"; paintChips(); grid.setActive(zone === "grid"); },
            blur: function () { grid.setActive(false); paintChips(); },
            key: function (code) {
                var K = TV.KEY;
                if (zone === "chips") {
                    if (code === K.LEFT || code === K.RIGHT) {
                        var n = chipIndex + (code === K.LEFT ? -1 : 1);
                        if (n < 0 || n >= chips.length) { TV.sound.edge(); return true; }
                        // moving along the row opens nothing: the category you are on stays until OK or Down
                        // (before, each category passed loaded itself, so going back to Sort left yours)
                        chipIndex = n; TV.sound.tick(); paintChips();
                        return true;
                    }
                    if (code === K.DOWN) {
                        var c = chips[chipIndex];
                        var pv = c && c.id === "prov" ? provNow() : null;
                        if (pv) { if (pv.id !== catId) { load(pv.id); buildChips(); paintChips(); } }                 // the provider's chip: down to the category it shows
                        else if (c && c.id !== "sort" && c.id !== "genres" && c.id !== catId) load(c.id);     // Genres: down to the one you are on
                        if (grid.items.length) { zone = "grid"; TV.sound.tick(); paintChips(); grid.setActive(true); } else TV.sound.edge();
                        return true;
                    }
                    if (code === K.UP) return false;
                    return true;
                }
                var dir = { 37: "left", 38: "up", 39: "right", 40: "down" }[code];
                if (!dir) return false;
                if (!grid.move(dir)) {
                    if (dir === "up") { zone = "chips"; TV.sound.tick(); grid.setActive(false); paintChips(); }
                    else TV.sound.edge();
                }
                return true;
            },
            ok: function () {
                if (zone === "chips" && chips[chipIndex] && chips[chipIndex].id === "sort") { clearTimeout(loadTimer); chooseSort(); return; }
                if (zone === "chips" && chips[chipIndex] && chips[chipIndex].id === "genres") { clearTimeout(loadTimer); openGenres(); return; }
                if (zone === "chips" && chips[chipIndex] && chips[chipIndex].id === "prov") { clearTimeout(loadTimer); openProv(); return; }
                if (zone === "chips") { clearTimeout(loadTimer); load(chips[chipIndex].id); if (grid.items.length) { zone = "grid"; grid.setActive(true); paintChips(); } return; }
                var it = grid.current();
                if (it) TV.detail.open(it);
            },
            canHold: function () { return zone === "grid" ? !!grid.current() : zone === "chips" && !!provCat(); },
            longOk: function () {
                if (zone === "chips") {             // OK held on the list's chip, on one of the provider's categories: hide it, or its whole country
                    TV.categoryMenu(provCat(), function () {
                        buildChips(); load(exists(catId) ? catId : "recent"); zone = "chips"; paintChips();
                    });
                    return;
                }
                var it = grid.current();
                TV.titleMenu(it, function () { load(catId, true); grid.refreshCard(grid.index); grid.draw(); });
            },
            invalidate: function () { dirty = true; if (visible) render(true); }
        };
        D.onChange(function (w) {
            if (w === "catalog" || w === "hidden") view.invalidate();
            else if (w === "resume") { if (catId === "watched") dirty = true; else coverStale = true; }
            else if ((w === "top" && catId === "top") || (w === "genre" && String(catId).indexOf("g:") === 0)) { if (visible) refreshSoon(); else dirty = true; }
        });
        return view;
    }

    TV.views = TV.views || {};
    TV.views.movies = make("movies", "v-movies");
    TV.views.series = make("series", "v-series");
})(window);
