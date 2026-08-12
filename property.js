/*
 * RentSpot — property detail page logic.
 * Reads the ?id= query param, finds the property and renders its full page.
 */
(function () {
  "use strict";

  var properties = window.PROPERTIES || [];
  var mount = document.getElementById("detail");

  function getId() {
    var params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"), 10);
  }

  var property = properties.filter(function (p) {
    return p.id === getId();
  })[0];

  if (!property) {
    document.title = "Property not found — RentSpot";
    mount.innerHTML =
      '<div class="not-found">' +
        "<h1>Property not found</h1>" +
        "<p>This listing may have been removed or the link is incorrect.</p>" +
        '<a class="btn-primary" href="index.html">Browse all properties</a>' +
      "</div>";
    return;
  }

  document.title = property.title + " — RentSpot";

  // Icons for the proximity list.
  var ICONS = {
    metro:
      '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l-1.5-2M15 21l1.5-2"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>',
    railway:
      '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="12" rx="2"/><path d="M6 10h12M8 20l2-3M16 20l-2-3"/></svg>',
    hospital:
      '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></svg>',
    school:
      '<svg viewBox="0 0 24 24"><path d="M3 9l9-5 9 5-9 5-9-5z"/><path d="M7 11v5c0 1 2.5 2.5 5 2.5s5-1.5 5-2.5v-5"/></svg>',
  };

  var available = daysUntilAvailable(property.available) <= 0;

  function proximityItem(icon, label, distance) {
    return (
      "<li>" +
      '<span class="pic">' + ICONS[icon] + "</span>" +
      "<span>" + label + "</span>" +
      '<span class="dist">' + distance + " km</span>" +
      "</li>"
    );
  }

  var amenities = (property.amenities || [])
    .map(function (a) {
      return "<span>" + a + "</span>";
    })
    .join("");

  mount.innerHTML =
    '<div class="detail-hero">' +
      '<img src="' + propertyImage(property) + '" alt="' + property.type + " in " + property.locality + '">' +
    "</div>" +

    '<div class="detail-header">' +
      "<div>" +
        '<h1 class="detail-title">' + property.title + "</h1>" +
        '<div class="detail-location">' + PIN_SVG + "<span>" + property.locality + ", " + property.city + "</span></div>" +
        '<span class="pill' + (available ? " available" : "") + '">' + availabilityLabel(property.available) + "</span>" +
        '<span class="pill">' + property.type + "</span>" +
        '<span class="pill">' + property.furnishing + "</span>" +
      "</div>" +
      '<div class="detail-rent">' +
        '<div class="amount">' + formatINR(property.rent) + "</div>" +
        '<div class="label">per month</div>' +
      "</div>" +
    "</div>" +

    '<div class="detail-grid">' +
      "<div>" +
        '<div class="panel">' +
          "<h3>Overview</h3>" +
          '<div class="facts">' +
            fact("Configuration", property.type) +
            fact("Built-up area", property.area + " sq.ft") +
            fact("Furnishing", property.furnishing) +
            fact("Floor", property.floor) +
            fact("Facing", property.facing) +
            fact("Age", property.age) +
          "</div>" +
        "</div>" +

        '<div class="panel">' +
          "<h3>About this property</h3>" +
          "<p>" + property.description + "</p>" +
        "</div>" +

        '<div class="panel">' +
          "<h3>What's nearby</h3>" +
          '<ul class="proximity-list">' +
            proximityItem("metro", "Nearest Metro station", property.metro) +
            proximityItem("railway", "Nearest Railway station", property.railway) +
            proximityItem("hospital", "Nearest Hospital", property.hospital) +
            proximityItem("school", "Nearest School", property.school) +
          "</ul>" +
        "</div>" +

        (amenities
          ? '<div class="panel"><h3>Amenities</h3><div class="amenities">' + amenities + "</div></div>"
          : "") +
      "</div>" +

      '<aside>' +
        '<div class="panel contact-card">' +
          '<div class="sub">Monthly rent</div>' +
          '<div class="amount">' + formatINR(property.rent) + "</div>" +
          '<div class="deposit">Advance / deposit: <strong>' + formatINR(property.advance) + "</strong></div>" +
          '<button type="button" class="btn-block" id="contactBtn">Contact owner</button>' +
          '<button type="button" class="btn-block secondary" id="scheduleBtn">Schedule a visit</button>' +
        "</div>" +
      "</aside>" +
    "</div>";

  function fact(k, v) {
    return '<div class="fact"><div class="k">' + k + '</div><div class="v">' + v + "</div></div>";
  }

  // Simple demo actions — no backend wired up.
  var contactBtn = document.getElementById("contactBtn");
  var scheduleBtn = document.getElementById("scheduleBtn");
  if (contactBtn) {
    contactBtn.addEventListener("click", function () {
      alert("Owner contact: " + (property.contact || "+91 90000 00000"));
    });
  }
  if (scheduleBtn) {
    scheduleBtn.addEventListener("click", function () {
      alert("Visit request sent for \"" + property.title + "\". The owner will reach out to confirm a time.");
    });
  }
})();
