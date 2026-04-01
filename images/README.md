# Image Naming Guide — Wally's Woodworking

Drop your photos into the correct folder using the naming conventions below.
The site will automatically use them once they're in place.

---

## images/hero/
The main background image shown on the homepage.

| File | Used in |
|------|---------|
| `hero-bg.jpg` | Homepage hero section background |

**Recommended:** Landscape, high-resolution (1800px wide min), a wide shot of a finished piece or your shop.

---

## images/gallery/
Portfolio photos of your finished work. These power the live gallery on the Gallery page.

**Naming:** `[category]-[number].jpg`

| Category prefix | Filter tab it appears under |
|----------------|-----------------------------|
| `furniture-`   | Custom Furniture |
| `decor-`       | Décor & Accents |
| `specialty-`   | Specialty Builds |

**Examples:** `furniture-07.jpg`, `decor-14.jpg`, `specialty-01.jpg`

Always use the next number in sequence. If `furniture-06.jpg` is the last one, your next file is `furniture-07.jpg`.

**Recommended:** Square or landscape, at least 800×600px. Shoot in good lighting.

### How the gallery works
The gallery reads from a file called `gallery-data.json` in the project root. That file controls what photos appear, their labels, and which filter tab they show under. The photo file itself does nothing until it has a matching entry in that JSON file.

### Adding a new photo — step by step

1. Name the photo using the convention above and drop it into `images/gallery/`
2. Open Terminal in the project folder and run:
   ```
   node scripts/sync-gallery.js
   ```
   This adds a placeholder entry for the new photo to `gallery-data.json`
3. Open `gallery-data.json` and find the new entry at the bottom. Update the two fields:
   - `"label"` — the title shown on the photo (e.g. `"Farmhouse Dining Table"`)
   - `"sub"` — the short detail line (e.g. `"White oak · Virginia Beach"`)
4. Run `./deploy.sh "Add new gallery photos"` to publish

### gallery-data.json entry format
Each photo is one block in the `"items"` list:
```json
{
  "file": "furniture-07.jpg",
  "category": "furniture",
  "label": "Farmhouse Dining Table",
  "sub": "White oak · Virginia Beach"
}
```

| Field | What it does |
|-------|-------------|
| `file` | The filename in `images/gallery/` |
| `category` | Must be `furniture`, `decor`, or `restoration` — controls which filter tab shows it |
| `label` | Bold title shown on the photo overlay and in the lightbox |
| `sub` | Smaller detail line — good place for wood species, size, or city |

---

## images/about/
Photos of you and your shop for the About page.

| File | Used in |
|------|---------|
| `wally-portrait.jpg` | Main photo in About section |
| `shop-01.jpg` | Shop / workspace photo grid |
| `shop-02.jpg` | Shop / workspace photo grid |
| `shop-03.jpg` | Shop / workspace photo grid |
| `joinery-detail.jpg` | Close-up detail of woodwork |

---

## og-image.jpg
The image shown when someone shares your site on Facebook, LinkedIn, etc.

**Required size:** 1200×630px.

---

## Tips
- Use JPG for photos (smaller file size, faster loading)
- Aim for under 300KB per image for good performance
- Always run `node scripts/sync-gallery.js` after dropping in a new gallery photo
