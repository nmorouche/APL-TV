#!/usr/bin/env bash
# fork-release.sh: this fork's own updates (see FORK.md). Run by .github/workflows/fork-sync.yml.
#
#   1. When the project (Knikt/APL-TV) has published a new version, its main is merged under this
#      fork's changes.
#   2. The fork's number goes up (fork/rev.json: 1.1.1 -> 1.1.1.1, 1.1.1.2... then 1.1.2.1), the
#      version files are generated again (tools/make-build.py) and the project's checks run
#      (tools/check.py).
#   3. The result is pushed to main: the screens installed from this fork read app/version.json
#      there and take the update within 6 hours.
#
# Nothing is published when the merge needs a hand (both sides changed the same lines) or when a
# check fails: the job stops, and the screens stay on the last version that passed.
set -euo pipefail

UPSTREAM_URL="${UPSTREAM_URL:-https://github.com/Knikt/APL-TV.git}"
UPSTREAM_BRANCH="${UPSTREAM_BRANCH:-main}"
RELEASE_BRANCH="${RELEASE_BRANCH:-main}"
EVENT="${EVENT:-workflow_dispatch}"     # schedule, push or workflow_dispatch
BEFORE="${BEFORE:-}"                    # push: the commit main was on before
FORCE="${FORCE:-no}"                    # yes: a new number now; sync: the project's main as it is, too
PY="${PY:-python3}"
DRY="${DRY:-}"                          # 1: stops before the version files, the checks and the push

say() {
    echo "$*"
    if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then echo "$*" >> "$GITHUB_STEP_SUMMARY"; fi
}

# who signs the merge and the release commit (git wants a name even to start a merge)
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

git remote get-url upstream >/dev/null 2>&1 || git remote add upstream "$UPSTREAM_URL"
git fetch -q upstream "$UPSTREAM_BRANCH"
UP="upstream/$UPSTREAM_BRANCH"

base="$(sed -n 's/.*"base": *"\([^"]*\)".*/\1/p' fork/rev.json 2>/dev/null | head -1 || true)"
rev="$(sed -n 's/.*"rev": *\([0-9][0-9]*\).*/\1/p' fork/rev.json 2>/dev/null | head -1 || true)"
up_ver="$(git show "$UP:app/version.json" | sed -n 's/^ *"version": *"\([^"]*\)".*/\1/p' | head -1)"
say "This fork: ${base:-?}.${rev:-0}. The project: ${up_ver:-?}."

# ---- 1. the project's new version, merged under this fork's changes ----
# Only a version the project has published (its number changed): what it merges between two versions waits for
# the next one, as it does for the screens that follow the project itself.
merged=""
if ! git merge-base --is-ancestor "$UP" HEAD && { [ "$up_ver" != "$base" ] || [ "$FORCE" = "sync" ]; }; then
    say "Merging the project's $up_ver."
    out="$(git merge --no-ff --no-commit "$UP" 2>&1)" || true
    if ! git rev-parse -q --verify MERGE_HEAD >/dev/null; then
        say "### The merge of the project's $up_ver did not start"
        say "$out"
        exit 1
    else
        # generated files: the project's, then made again below with this fork's number
        git checkout "$UP" -- app/version.json app/js/build.js
        # workflows: this fork's own stay, since the job's own token may not change workflow files. With a
        # personal token in the secret SYNC_TOKEN, the project's are taken like the rest.
        if [ -z "${HAS_SYNC_TOKEN:-}" ]; then git restore --source=HEAD --staged --worktree -- .github/workflows; fi
        left="$(git diff --name-only --diff-filter=U)"
        if [ -n "$left" ]; then
            say "### The project's $up_ver could not be merged by itself"
            say "It and this fork changed the same lines in:"
            while IFS= read -r f; do say "- \`$f\`"; done <<< "$left"
            say ""
            say "Nothing was published: the screens stay on ${base:-?}.${rev:-0}. Merge by hand (FORK.md, \"When the merge needs a hand\"), then push: the push publishes."
            git merge --abort
            exit 1
        fi
        merged=1
    fi
fi

# ---- 2. is there something to publish? ----
publish=""
check_only=""
if [ -n "$merged" ] || [ "$FORCE" = "yes" ] || [ "$FORCE" = "sync" ]; then
    publish=1
elif [ "$EVENT" = "push" ]; then
    if [ -z "$BEFORE" ] || ! git cat-file -e "$BEFORE^{commit}" 2>/dev/null; then BEFORE="$(git rev-parse HEAD~1)"; fi
    changed="$(git diff --name-only "$BEFORE" HEAD)"
    if grep -qx 'fork/rev.json' <<< "$changed"; then
        say "This push carries its own number: checked, not numbered again."
        check_only=1
    elif grep -q '^app/' <<< "$changed"; then
        publish=1
    else
        say "This push does not change the app: nothing to publish."
    fi
fi

if [ -z "$publish" ]; then
    if [ -n "$check_only" ] && [ -z "$DRY" ]; then "$PY" tools/check.py; fi
    say "Nothing new to publish."
    exit 0
fi

# ---- 3. this fork's number, the version files, the checks ----
new_base="$(sed -n 's/.*<widget[^>]* version="\([^"]*\)".*/\1/p' app/config.xml | head -1)"
if [ "$new_base" = "$base" ]; then new_rev=$(( ${rev:-0} + 1 )); else new_rev=1; fi
mkdir -p fork
printf '{\n "base": "%s",\n "rev": %s\n}\n' "$new_base" "$new_rev" > fork/rev.json
say "Publishing $new_base.$new_rev."
if [ -n "$DRY" ]; then say "(test: stopped before the version files, the checks and the push)"; exit 0; fi

"$PY" tools/make-build.py
"$PY" tools/check.py

git add -A app fork
if [ -n "$merged" ]; then
    git commit -q -m "APL TV $new_base.$new_rev: the project's $up_ver, with this fork's changes"
else
    git commit -q -m "APL TV $new_base.$new_rev"
fi
git push -q origin "HEAD:$RELEASE_BRANCH"
say "### Published $new_base.$new_rev"
say "The screens installed from this fork take it within 6 hours (or at once: Settings, Updates, Check for Updates)."
