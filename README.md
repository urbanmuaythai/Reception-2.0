# Reception / Front Desk

Urban Muaythai's reception console, prepared for GitHub maintenance.

Open `index.html` in a browser. It is a static page with no build dependencies or backend.

## Editing

The original Google Sites embed is preserved in `source/reception-original.html`. The first local commit records that unchanged console. The next commit contains the proposed onboarding and workflow improvements.

For this review version, edit `build.cjs` and run:

```sh
node build.cjs
```

This regenerates `index.html` and `REVIEW.txt`. Avoid editing only the generated HTML, since the next build would replace those changes.

## Review before release

The page includes a proposed Start Here path, shift and weekly duties, completion criteria, a handover template and located member-action procedures. It uses Reception / Front Desk role labels.

`REVIEW.txt` lists remaining missing guides and questions about cancellation wording, cleaning frequency, current rotations, prices and training support. The draft does not decide disputed membership terms. Verify current approved procedures and new-starter access before release.

No member cases, credentials or payment details belong in this repository. Operational records remain in Clubworx and the existing approved trackers. Links to restricted documents do not grant access.

## Hosting status

This is a local Git repository. No GitHub repository or remote has been created, and no changes have been pushed. The temporary Google Sites draft change was undone and the original embed was verified against its backup. The published Site was not changed.

An exact matching source repository was not found among the Urban Muaythai repositories inspected. `urbanmuaythai/Assistant` links to the Google Site; `urbanmuaythai/Guides` contains related SOPs. Neither contains this console.
