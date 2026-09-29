# WhizPhotography

A dependency-free photography website. Open `index.html` directly or serve this folder with any static web host.

## Add portfolio photographs

Place approved, optimized images in an `assets/` folder. In `script.js`, add objects to the relevant collection's `images` array:

```js
{
  src: "assets/weddings/celebration.webp",
  avif: "assets/weddings/celebration.avif",
  alt: "A couple celebrating with family in Osogbo",
  caption: "A wedding celebration in Osogbo",
}
```

`src`, `alt`, and `caption` are useful for every image; `avif` is optional and falls back to `src`. The first wedding image also works well as a featured image. Collection tiles load lazily and open as a full-screen gallery.

No client photographs, verified testimonial text, or confirmed Instagram/Facebook URLs were included with this build. Keep those sections unpublished or use the supplied placeholders until approved content is available. The displayed Google rating and review count were supplied for the brief; verify them against the live profile before publishing.

## Contact

The booking form opens a prefilled WhatsApp message to the supplied business number. It does not store or submit visitor data to a server. Update the number consistently in `index.html`, `script.js`, and the structured-data block if the business number changes.