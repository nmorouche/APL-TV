# This fork

A personal fork of [APL TV](https://github.com/Knikt/APL-TV) by Knikt. It adds a few things to the
player and publishes its own updates: a screen installed from this fork only ever updates from
this fork, and gets the project's new versions with these additions kept on top.

Everything else (what APL TV is, how to install it, how to add a playlist) is in the project's
[README](README.md).

## What this fork adds

While a channel plays full screen, **OK or ◀** opens the channel list. In this fork it has more:

- **The programmes of the channel you are on in the list**, the past ones too: the days before as
  far back as your provider keeps them (Xtream accounts), with a replay mark on what can be
  replayed. ▶ goes into the programmes. OK on a past programme plays its replay at once; OK held
  on the one on now offers Start Over.
- **The programme's details**: times, plot and, with a TMDB key, its IMDb rating, year, genres,
  cast and director. A title is only matched when it is believable: nothing is shown rather than
  another film's details.
- **A second view, the Grid**: every channel's programmes with time across. A small rail at the
  left of the list shows both views (a list, a grid of squares). ◀ from the channels (List) or
  Back (Grid) goes onto the rail; ▲▼ change the view, ▶ or OK goes into it. The Guide key, the
  channel list key and the colour keys change it from anywhere. In the Grid, ◀ ▶ go from programme
  to programme, back in time too (⏪ ⏩ a whole day), ▲▼ change channel, OK watches. The view chosen
  last is the one opened next time.
- **Going back in a live channel**: on a channel your provider keeps, ⏪ (or the first button of
  the bar, or Rewind in the menu) opens the programme on now about a minute back, with no pause
  first. ◀ ▶ then move in it as in a movie; ▼ has Back to Live.
- **Replays keep the programme's own timeline.** A stream the player cannot move in by itself is
  asked again from the minute wanted, so seeking works on a bare MPEG-TS. During a replay, ◀ opens
  the channels and programmes again while the bar is hidden; with the bar shown (▲, ▶ or OK),
  ◀ ▶ move in time, and ⏪ ⏩ always do.

- **A Trailer button on a movie's or a series' page**, right after Play, when TMDB knows a trailer
  of the title on YouTube: the one in your language, else the English one. OK plays it inside
  APL TV with the remote (OK pauses, ◀ ▶ 10 s, Back comes back to the page). A trailer YouTube
  keeps for itself opens in the screen's YouTube app instead. Needs a TMDB key.

The code is in `app/js/osd.js` (the player), `app/js/epg.js` (a channel's past programmes),
`app/js/meta.js` (a programme's details, a title's trailer), `app/js/detail.js` (the Trailer
button), `app/js/live.js` and `app/css/tv.css`. Its texts, in
French and in Polish, are in a file of their own, `app/js/lang-fork.js`: the project's language
files are left as they are, so that its new translations never conflict with these.

## How this fork updates itself

APL TV updates itself from GitHub: every 6 hours a screen reads `app/version.json` on the `main`
branch of the repository named in `app/js/boot.js`, and takes the code when the number there is
higher than its own. In this fork that repository is this one.

- **Its own numbers.** The project's 1.1.1 is 1.1.1.1 here, then 1.1.1.2 at each update of this
  fork, then 1.1.2.1 when the project publishes 1.1.2: always the higher of the two.
  `fork/rev.json` holds the count, and `tools/make-build.py` writes the number in
  `app/version.json` and `app/js/build.js`. `app/config.xml` keeps the project's number (a Samsung
  package only takes three numbers), so does Settings.
- **The automation** (`.github/workflows/fork-sync.yml`, `tools/fork-release.sh`) runs every hour
  and at each push to `main`:
  1. when the project has published a new version, its `main` is merged under this fork's changes;
  2. the fork's number goes up, the version files are made again, the project's checks run;
  3. the result is pushed to `main`. The screens take it within 6 hours, or at once from
     Settings › Updates.
- **A change of your own**: push it to `main`. If it touches `app/`, the automation numbers it and
  publishes it.
- **By hand**: Actions › Fork sync and release › Run workflow (`yes` publishes a new number now;
  `sync` also merges the project's `main` as it is, without waiting for its next version).

### What still needs you

- **When the merge needs a hand.** If the project and this fork changed the same lines (most
  likely in `app/js/osd.js`), the job stops and publishes nothing: the screens stay on the last
  version. On a PC:

  ```
  git pull
  git remote add upstream https://github.com/Knikt/APL-TV.git
  git fetch upstream
  git merge upstream/main
  git checkout upstream/main -- app/version.json app/js/build.js
  ```

  resolve the files git names, `git add` them, `git commit`, `git push`. The push publishes.
- **When the project changes the installed part** (the helper service, the permissions, the
  loader), the screen says once that a new package must be installed: build it from this fork,
  sign it with your certificate and install it, as the first time.
- **Workflow files.** The job's own token may not change workflow files, so the project's changes
  to its workflows are left out of the merges. A personal token (fine-grained, this repository,
  Contents and Workflows: read and write) in the secret `SYNC_TOKEN` lets them through.
- **Nobody reads the project's changes before they reach your screen**, as with the project's own
  updates. The checks catch a script that does not parse, a text without its translation and
  version files out of date, not a change that breaks these additions.
- GitHub turns scheduled workflows off in a repository left without activity for 60 days: turn
  the workflow on again in the Actions tab.
