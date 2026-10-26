# azorian3.com

Static site for Azorian. No build step, no framework. Open `index.html` or serve the folder.

- `index.html` home page (rendered from `index.tpl.html` by `build.py`, which inlines the logo and icons)
- `terms-of-use/index.html` Terms of Use and IP notice
- `embeds/` the interactive dashboards (hero counter, spend report, loss drivers, P2P toolkit, pricing and FAQ), each a self-contained page loaded in an iframe
- `assets/` CSS, JS, images, logo
- `CNAME` custom domain for GitHub Pages

Contact and newsletter forms post to FormSubmit; the destination address is `FORM_EMAIL` at the top of `assets/js/site.js`.

To edit copy, change `index.tpl.html` and run `python3 build.py`.


## Redesign (Oct 2026)
`index.tpl.html` + `build.py` render `index.html`. Styles in `assets/css/v2.css`; motion in `assets/js/storm.js` (hero storm to chart), `assets/js/v2.js` (nav, counters, forms, embeds) and `assets/js/motion.js` (heading decode, 3D tilt, dividers, cursor glow). `legacy/index.tpl.html` is the faithful Wix copy; `terms-of-use/` still uses `assets/css/site.css`.
