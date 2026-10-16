# Vitthalesh Traders – Website

A static, single-page business website for **Vitthalesh Traders**, a grocery and food-grain trading business on Randhik Pur Road, Piplod, Dahod, Gujarat 389130.

It is built with plain HTML, CSS and JavaScript only: no framework, no build step, no backend, and no paid services. It can be hosted for free on Cloudflare Pages or GitHub Pages.

---

## 1. Project structure

```
vithhlesh-traders/
├── index.html            Main page (all sections, SEO metadata, structured data)
├── styles.css            All styles (design tokens at the top)
├── script.js             Navigation, animations, WhatsApp links, enquiry form
├── privacy.html          Privacy policy (explains how enquiry details are handled)
├── 404.html              "Page not found" page
├── robots.txt            Search-engine crawl rules + sitemap location
├── sitemap.xml           Page list for search engines
├── site.webmanifest      App icon / theme colour metadata
├── favicon.ico           Browser tab icon
├── README.md
└── assets/
    ├── logo-128.webp / logo-256.webp / logo-400.webp   Logo (header, footer, contact)
    ├── logo.png                                       Logo for structured data
    ├── favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
    ├── og-image.jpg                                   Social-sharing preview (1200×630)
    ├── hero-grains-768/1280/1920.webp                 Hero image (responsive sizes)
    ├── rice-480/800.webp
    ├── wheat-480/800.webp
    ├── pulses-480/800.webp
    ├── groceries-480/800.webp
    ├── edible-oils-480/800.webp
    └── trading-products-480/800.webp
```

---

## 2. Before publishing: required checks

Work through this list with the shop owner before the site goes live.

### 2.1 WhatsApp number

The confirmed WhatsApp number is **87583 82400**. It is set in the `CONFIG` block at the top of `script.js`, with the country code, digits only:

```js
whatsappNumber: '918758382400',
```

The phone numbers shown for calls are **098987 70189** (primary) and **087583 82400**.

**What happens if `whatsappNumber` is emptied:**

- Every "WhatsApp" button switches to a phone call to 098987 70189 and its label changes, for example to "Call to Enquire".
- WhatsApp-only buttons in the contact card and the mobile bottom bar are hidden.
- The enquiry form still validates the details, then shows the prepared message with **Call** and **Copy details** buttons.

**While the number is set:**

- All WhatsApp buttons open `https://wa.me/<number>` with a prefilled message.
- The form opens WhatsApp with the customer's full enquiry, ready to review and send.

### 2.2 Business name spelling

The confirmed spelling is **"Vitthalesh Traders"**, matching the logo. The web address and repository still use `vithhlesh-traders`, which visitors don't see as the business name.

To change the name again, do a find-and-replace across `index.html`, `privacy.html`, `404.html`, `script.js`, `site.webmanifest` and this README.

### 2.3 Website address (domain)

The files use `https://vithhlesh-traders.pages.dev/` as the site address. This is the address Cloudflare Pages gives a project named `vithhlesh-traders`.

If the final address is different (another project name, GitHub Pages or a custom domain), replace `https://vithhlesh-traders.pages.dev/` everywhere it appears:

- `index.html`: canonical link, Open Graph tags, JSON-LD structured data
- `privacy.html`: canonical link
- `robots.txt`
- `sitemap.xml`

### 2.4 Google Maps location

The directions links use a Google Maps search:

```
https://www.google.com/maps/search/?api=1&query=Vitthalesh+Traders+Piplod+Dahod+Gujarat
```

Once the shop's Google Business Profile is confirmed:

1. Open the shop's listing in Google Maps, click **Share**, then **Copy link**, and replace the search URL above wherever it appears in `index.html` (it is also in `"hasMap"` in the structured data).
2. **Optional embedded map:** in the same listing, click **Share**, then **Embed a map**. Copy only the `src="…"` value, which starts with `https://www.google.com/maps/embed`, and paste it into `mapEmbedUrl` in `script.js`. The map card in the Contact section is then replaced by the live map.

### 2.5 Opening hours

Opening hours are **not shown** because they have not been confirmed. The Contact section asks customers to call ahead instead.

Once the timings are confirmed:

- Add them to the contact card in `index.html`, below the phone number.
- Optionally, add `"openingHours": ["Mo-Sa 09:00-20:00"]` (with the correct values) to the JSON-LD block in `index.html`.

### 2.6 Product categories

Each category is one `<article class="product-card" data-product="…">` inside `.product-grid` in `index.html`.

- **To remove a category:** delete its `<article>` block. The enquiry form's "Product interest" list is built automatically from these cards, so nothing else needs to change.
- **To add a category:** copy an existing `<article>`, then change `data-product`, the heading, the text, the image and the `data-enquire` value.

Never add prices, brands, stock levels or specifications unless the owner confirms them.

### 2.7 Photographs

The product and hero photographs are **representative images created for this website**. They show no brands, prices or labels. For the strongest trust signal, replace them with real photos of the shop, its counter and its stock:

1. Take landscape photos in good daylight (4:3 for products, 16:9 for the hero).
2. Convert and compress them at [squoosh.app](https://squoosh.app) (free): choose WebP at quality ~75, with widths of 480 px and 800 px for product images, and 768, 1280 and 1920 px for the hero.
3. Save them with the existing filenames in `assets/`, or update the `src`/`srcset` paths, and update the `alt` text to describe the new photo.

---

## 3. Preview locally

Any static file server works. With Node.js installed:

```bash
cd vithhlesh-traders
npx http-server -p 8080
```

Open <http://localhost:8080>. You can also open `index.html` directly by double-clicking it; everything except the 404 page works that way.

---

## 4. Testing checklist

Run through this list before and after every deployment.

- [ ] Header menu works on mobile: it opens and closes, closes with Escape, and closes when a link is tapped.
- [ ] Every navigation link scrolls to the right section.
- [ ] **Call** links dial `+91 98987 70189` on a phone.
- [ ] **Directions** links open the correct shop in Google Maps.
- [ ] Each WhatsApp button opens WhatsApp to the **verified** number with the right prefilled message. This applies once the number is configured.
- [ ] The enquiry form shows errors for an empty name, an invalid mobile number, a missing customer type and a missing product. With valid input it opens WhatsApp, or shows the call fallback.
- [ ] "Enquire about…" links on product cards pre-select the product in the form.
- [ ] Footer shows the current year.
- [ ] The browser console (F12, then Console) shows no errors.
- [ ] The page looks right on a phone, a tablet and a desktop.
- [ ] Optionally, run Lighthouse (Chrome DevTools, Lighthouse tab, Mobile).
- [ ] Optionally, test the structured data at <https://search.google.com/test/rich-results>.
- [ ] Optionally, test the social preview at <https://www.opengraph.xyz>.

---

## 5. Free deployment

### Option A: Cloudflare Pages (recommended)

This is free, fast in India, and gives an HTTPS address such as `vithhlesh-traders.pages.dev`.

1. **Create a GitHub repository.**
   - Sign in at <https://github.com>, click **New repository**, name it `vithhlesh-traders`, choose **Public** or **Private**, and click **Create repository**.
2. **Upload the files.**
   - On the new repository page, click **uploading an existing file**.
   - Drag in **the contents** of the `vithhlesh-traders` folder: `index.html` must sit at the top level of the repository, not inside a subfolder. Include the `assets` folder.
   - Click **Commit changes**.
   - If you use Git instead:
     ```bash
     cd vithhlesh-traders
     git init
     git add .
     git commit -m "Initial website"
     git branch -M main
     git remote add origin https://github.com/<your-username>/vithhlesh-traders.git
     git push -u origin main
     ```
3. **Connect the repository to Cloudflare Pages.**
   - Create a free account at <https://dash.cloudflare.com>.
   - Go to **Workers & Pages**, then **Create**, then the **Pages** tab, then **Connect to Git**.
   - Authorise GitHub and select the `vithhlesh-traders` repository.
4. **Deploy the site.**
   - Project name: `vithhlesh-traders`. This sets the address `https://vithhlesh-traders.pages.dev`.
   - Framework preset: **None**.
   - Build command: *(leave empty)*.
   - Build output directory: `/`.
   - Click **Save and Deploy**. After about a minute the site is live.
   - Every later push or upload to GitHub redeploys automatically.
5. **Test the live address on a phone.** Go through the checklist in section 4, especially call, WhatsApp and directions.
6. **Add the website to Google Business Profile.**
   - Go to <https://business.google.com>, open the Vitthalesh Traders profile, then **Edit profile**, then **Contact**, then **Website**.
   - Paste the live URL and save. Google may take a few days to show it.
   - Optionally, submit `https://<your-address>/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).
7. **Custom domain (optional).**
   - A custom domain such as `vithhleshtraders.in` must be **bought from a domain registrar, which costs money**, usually a yearly fee. Hosting on Cloudflare Pages stays free.
   - If a domain is available: in Cloudflare Pages, open the project, then **Custom domains**, then **Set up a custom domain**, and follow the DNS steps.
   - Then update the website address everywhere, as described in section 2.3.

### Option B: GitHub Pages

1. Create the repository and upload the files exactly as in steps 1 and 2 above. The repository must be **Public** on a free account.
2. In the repository, go to **Settings**, then **Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to `main`, and folder to `/ (root)`. Click **Save**.
4. After 1–2 minutes the site is live at `https://<your-username>.github.io/vithhlesh-traders/`.
5. Replace the website address in all files as described in section 2.3, then commit.
6. Test on a phone and add the URL to Google Business Profile, as in steps 5 and 6 above.
7. For a custom domain, use **Settings**, then **Pages**, then **Custom domain**. Domain registration still costs money.

> Note: with a GitHub Pages *project* address (`…github.io/vithhlesh-traders/`), the 404 page cannot find its stylesheet because it uses root paths (`/styles.css`). The main site is unaffected. This does not happen on Cloudflare Pages or with a custom domain.

---

## 6. Editing tips

- **Colours, fonts and spacing:** all in the `:root` block at the top of `styles.css`.
- **Phone number:** search for `9898770189` and `098987 70189` in the HTML files and `script.js`.
- **Announcement bar text:** at the top of `<body>` in `index.html`.
- **Fonts:** Playfair Display (headings) and Inter (body), loaded from Google Fonts.

## 7. Content principles

The site deliberately avoids anything that has not been verified:

- No prices, stock levels, brands or specifications.
- No years in business, "lowest price", certification or market-leader claims.
- No testimonials, reviews or ratings.
- No delivery or shipping promises.
- No opening hours until they are confirmed.

Add any of these only after the owner confirms they are accurate.
