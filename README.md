# D_Mark — artist website

A responsive, interactive artist website for D_Mark, a musician from Busia, Uganda. The visual system closely follows the page structure and restrained black/white/soft-blue presentation of [iamapass.com](https://iamapass.com/) while using **D_Mark's own photograph, name, releases, and links**. It is not affiliated with A Pass.

## View the website

For a quick offline demonstration, use the bundled **`dmark-preview.html`** supplied with the downloadable ZIP, or generate a fresh copy with the build commands below. It embeds the portrait, release artwork, CSS, and JavaScript so navigation, the homepage carousel, filters, mobile menu, and booking enquiry composer work without internet access. YouTube playback requires the online deployed site; the offline preview shows an explanatory fallback.

For local development:

```bash
npm install
npm run dev
```

To build the deployable site and regenerate the standalone preview:

```bash
npm run build
python scripts/build_preview.py
python scripts/package_site.py
```

The package is written to `/home/user/dmark-website.zip` and contains the deployable `dist/`, the editable project, the original and cutout portrait, and the standalone `dmark-preview.html`.

Run the browser checks with a development server running:

```bash
BASE_URL=http://127.0.0.1:5173 npm run test:e2e
```

The site is a React/Vite SPA. `vercel.json` and `public/_redirects` provide direct-route fallbacks. The canonical routes are `/`, `/my-story`, `/music`, `/videos`, `/shows`, `/hire-me-to-sing`, `/news`, and `/store`; the older `/story` and `/contact` paths redirect to the corresponding pages.

### Deploy from GitHub

- **Netlify:** import this repository as a new project. `netlify.toml` supplies the build command (`npm run build`) and publish directory (`dist`); `public/_redirects` handles direct links to pages.
- **Vercel:** import this repository as a Vite project. `vercel.json` includes the single-page route rewrite.
- Before publishing as a booking destination, connect a real contact address or form handler: the current enquiry composer **does not send** messages.

## Pages and interactions

- **Home:** full-screen artist cutout against black, outlined music CTA, social icon strip on mobile, subtle desktop pointer response, interactive featured-release carousel, video player, and artist-story feature.
- **My Story:** user-supplied artist portrait, Busia background, early catalogue, and links to the music and public artist profile.
- **Music:** large featured Jimpe artwork, chronological release cards, and interactive year filters.
- **Videos:** in-page YouTube player and selectable official video catalogue. Videos are loaded only when pressed.
- **Shows:** a clear no-announced-dates state; no invented performances.
- **Hire Me to Sing:** pale-yellow information panel alongside an enquiry form. **The form only prepares text to copy; it does not send a message.** A verified booking address or form service is needed before enabling actual booking delivery.
- **News:** links to real music releases, not invented articles.
- **Store:** a transparent “coming soon” state without nonexistent merchandise.

The mobile menu and music submenu are keyboard accessible; Escape closes the menu. Motion is reduced for visitors with a reduced-motion preference.

## Artist photograph and accounts

The homepage uses the photograph supplied by the user, originally saved as `source-media/dmark-seated-original.png`. The green background was removed with an alpha-matted subject extraction; `public/images/dmark-seated-cutout.png` is the full-resolution transparent PNG, while `public/images/dmark-cutout.webp` is a smaller cropped transparent WebP used by the website. The previous generated portrait was removed from the site.

The user explicitly confirmed that the previously catalogued D-Mak releases belong to this artist. Release art and music links were checked against [D-Mak's listed releases on Deezer](https://www.deezer.com/us/artist/5432196) and the [D mak music YouTube channel](https://www.youtube.com/@dmakmusic3943). The [Busia artist biography](https://www.howwe.ug/DMak/biography) supplies the name and school-years start; the [TikTok account @d.makmusic](https://www.tiktok.com/@d.makmusic) references distinctive songs including “Ogonda Nnyo” and “Tubikole,” supporting the attribution. The website links **YouTube, TikTok, and Deezer**. Instagram, Facebook, and Spotify lookalikes were not linked because ownership could not be established; supply official URLs if these should be added. Deezer artist listings may aggregate similarly named artists, so the music page uses specific confirmed release links.

There are no fictional concert dates, press stories, booking contacts, or social profiles. Confirm image and music usage rights and provide an actual booking destination before publishing commercially.

## Edit the site

- `src/App.jsx` — pages, routing and interactive behavior.
- `src/styles.css` — typography, colors, layout and responsive rules.
- `src/data.js` — artist profiles, song links and video IDs.
- `public/images/` — release artwork, thumbnails, and artist cutout.
- `scripts/build_preview.py` — creates the standalone HTML preview from the production build.
- `tests/smoke.mjs` — desktop/mobile route and interaction checks.
