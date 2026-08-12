/*
 * Shared helpers used by both the home page (app.js) and detail page (property.js).
 */

/* Format a number as Indian Rupees, e.g. 32000 -> "₹32,000". */
function formatINR(value) {
  return "₹" + value.toLocaleString("en-IN");
}

/* Compact rupee format for large sums, e.g. 160000 -> "₹1.6L". */
function formatINRShort(value) {
  if (value >= 10000000) return "₹" + (value / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr";
  if (value >= 100000) return "₹" + (value / 100000).toFixed(1).replace(/\.0$/, "") + "L";
  if (value >= 1000) return "₹" + (value / 1000).toFixed(0) + "K";
  return "₹" + value;
}

/* Days from today until the property is available (<= 0 means immediate). */
function daysUntilAvailable(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const available = new Date(isoDate);
  return Math.round((available - today) / (1000 * 60 * 60 * 24));
}

/* Human-readable availability label. */
function availabilityLabel(isoDate) {
  const days = daysUntilAvailable(isoDate);
  if (days <= 0) return "Available now";
  const date = new Date(isoDate);
  return "From " + date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/*
 * Generate a self-contained SVG "photo" for a property as a data URI.
 * Keeps the app fully offline — no external image hosting required.
 * Draws a stylised skyline/house scene tinted by the property's hue.
 */
function propertyImage(property) {
  const h = property.hue;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="hsl(${h},70%,72%)"/>
      <stop offset="100%" stop-color="hsl(${(h + 30) % 360},65%,55%)"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="hsl(${h},30%,90%)"/>
      <stop offset="100%" stop-color="hsl(${h},25%,82%)"/>
    </linearGradient>
  </defs>
  <rect width="640" height="400" fill="url(#sky)"/>
  <circle cx="530" cy="90" r="42" fill="hsla(${h},90%,95%,0.85)"/>
  <g fill="hsla(${h},40%,100%,0.22)">
    <rect x="60" y="150" width="70" height="180"/>
    <rect x="150" y="110" width="80" height="220"/>
    <rect x="250" y="170" width="60" height="160"/>
    <rect x="470" y="140" width="80" height="190"/>
    <rect x="560" y="180" width="60" height="150"/>
  </g>
  <rect y="300" width="640" height="100" fill="url(#ground)"/>
  <g>
    <rect x="330" y="180" width="170" height="150" rx="6" fill="hsl(${h},45%,97%)"/>
    <polygon points="330,180 415,120 500,180" fill="hsl(${h},55%,45%)"/>
    <rect x="352" y="215" width="34" height="34" rx="3" fill="hsl(${h},60%,70%)"/>
    <rect x="444" y="215" width="34" height="34" rx="3" fill="hsl(${h},60%,70%)"/>
    <rect x="398" y="262" width="38" height="68" rx="3" fill="hsl(${h},50%,50%)"/>
  </g>
</svg>`.trim();
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* Small location pin SVG markup (reused inline). */
const PIN_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.5-7-11a7 7 0 1114 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
