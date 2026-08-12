/*
 * RentSpot — home page logic.
 * Renders property cards, wires up the search bar and all filters, and
 * navigates to the detail page when a card is clicked.
 */
(function () {
  "use strict";

  var properties = window.PROPERTIES || [];

  // --- DOM references ------------------------------------------------------
  var grid = document.getElementById("propertyGrid");
  var resultsCount = document.getElementById("resultsCount");
  var emptyState = document.getElementById("emptyState");

  var searchForm = document.getElementById("searchForm");
  var searchInput = document.getElementById("searchInput");

  var cityFilter = document.getElementById("cityFilter");
  var budgetFilter = document.getElementById("budgetFilter");
  var advanceFilter = document.getElementById("advanceFilter");
  var availabilityFilter = document.getElementById("availabilityFilter");
  var metroFilter = document.getElementById("metroFilter");
  var hospitalFilter = document.getElementById("hospitalFilter");
  var schoolFilter = document.getElementById("schoolFilter");

  var budgetValue = document.getElementById("budgetValue");
  var advanceValue = document.getElementById("advanceValue");
  var metroValue = document.getElementById("metroValue");
  var hospitalValue = document.getElementById("hospitalValue");
  var schoolValue = document.getElementById("schoolValue");

  var resetFilters = document.getElementById("resetFilters");
  var emptyReset = document.getElementById("emptyReset");

  // Mobile drawer
  var filters = document.getElementById("filters");
  var filterToggle = document.getElementById("filterToggle");
  var backdrop = document.getElementById("backdrop");

  var searchQuery = "";

  // --- Populate the city / locality dropdown -------------------------------
  function populateCities() {
    var seen = {};
    var options = [];
    properties.forEach(function (p) {
      if (!seen[p.city]) {
        seen[p.city] = true;
        options.push(p.city);
      }
    });
    options.sort().forEach(function (city) {
      var opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      cityFilter.appendChild(opt);
    });
  }

  // --- Filtering -----------------------------------------------------------
  function matchesSearch(p) {
    if (!searchQuery) return true;
    var haystack = (p.title + " " + p.type + " " + p.city + " " + p.locality).toLowerCase();
    return searchQuery.split(/\s+/).every(function (word) {
      return haystack.indexOf(word) !== -1;
    });
  }

  function matchesAvailability(p) {
    var value = availabilityFilter.value;
    if (!value) return true;
    var days = daysUntilAvailable(p.available);
    if (value === "immediate") return days <= 0;
    return days <= parseInt(value, 10);
  }

  function applyFilters() {
    var maxBudget = parseInt(budgetFilter.value, 10);
    var budgetIsMax = maxBudget >= parseInt(budgetFilter.max, 10);
    var maxAdvance = parseInt(advanceFilter.value, 10);
    var advanceIsMax = maxAdvance >= parseInt(advanceFilter.max, 10);
    var maxMetro = parseFloat(metroFilter.value);
    var metroIsMax = maxMetro >= parseFloat(metroFilter.max);
    var maxHospital = parseFloat(hospitalFilter.value);
    var hospitalIsMax = maxHospital >= parseFloat(hospitalFilter.max);
    var maxSchool = parseFloat(schoolFilter.value);
    var schoolIsMax = maxSchool >= parseFloat(schoolFilter.max);

    return properties.filter(function (p) {
      if (cityFilter.value && p.city !== cityFilter.value) return false;
      if (!budgetIsMax && p.rent > maxBudget) return false;
      if (!advanceIsMax && p.advance > maxAdvance) return false;
      if (!matchesAvailability(p)) return false;
      // Metro/Railway proximity uses whichever transit hub is closer.
      if (!metroIsMax && Math.min(p.metro, p.railway) > maxMetro) return false;
      if (!hospitalIsMax && p.hospital > maxHospital) return false;
      if (!schoolIsMax && p.school > maxSchool) return false;
      if (!matchesSearch(p)) return false;
      return true;
    });
  }

  // --- Rendering -----------------------------------------------------------
  function card(p) {
    var available = daysUntilAvailable(p.available) <= 0;
    var a = document.createElement("a");
    a.className = "card";
    a.href = "property.html?id=" + p.id;
    a.setAttribute("aria-label", p.title + " in " + p.locality + ", " + p.city);
    a.innerHTML =
      '<div class="card-media">' +
        '<img src="' + propertyImage(p) + '" alt="' + p.type + " in " + p.locality + '" loading="lazy">' +
        '<span class="card-badge' + (available ? " available" : "") + '">' + availabilityLabel(p.available) + "</span>" +
      "</div>" +
      '<div class="card-body">' +
        '<div class="card-rent">' + formatINR(p.rent) + '<span> /month</span></div>' +
        '<div class="card-title">' + p.title + "</div>" +
        '<div class="card-location">' + PIN_SVG + "<span>" + p.locality + ", " + p.city + "</span></div>" +
        '<div class="card-meta">' +
          "<span>" + p.type + "</span>" +
          "<span>" + p.area + " sq.ft</span>" +
          "<span>Metro " + p.metro + " km</span>" +
        "</div>" +
      "</div>";
    return a;
  }

  function render() {
    var matches = applyFilters();
    grid.innerHTML = "";

    if (matches.length === 0) {
      grid.hidden = true;
      emptyState.hidden = false;
      resultsCount.textContent = "0 properties";
      return;
    }

    grid.hidden = false;
    emptyState.hidden = true;
    var frag = document.createDocumentFragment();
    matches.forEach(function (p) {
      frag.appendChild(card(p));
    });
    grid.appendChild(frag);
    resultsCount.textContent =
      matches.length + (matches.length === 1 ? " property" : " properties") + " found";
  }

  // --- Filter value labels -------------------------------------------------
  function updateLabels() {
    budgetValue.textContent =
      parseInt(budgetFilter.value, 10) >= parseInt(budgetFilter.max, 10)
        ? "Any" : formatINRShort(parseInt(budgetFilter.value, 10));
    advanceValue.textContent =
      parseInt(advanceFilter.value, 10) >= parseInt(advanceFilter.max, 10)
        ? "Any" : formatINRShort(parseInt(advanceFilter.value, 10));
    metroValue.textContent =
      parseFloat(metroFilter.value) >= parseFloat(metroFilter.max) ? "Any" : metroFilter.value + " km";
    hospitalValue.textContent =
      parseFloat(hospitalFilter.value) >= parseFloat(hospitalFilter.max) ? "Any" : hospitalFilter.value + " km";
    schoolValue.textContent =
      parseFloat(schoolFilter.value) >= parseFloat(schoolFilter.max) ? "Any" : schoolFilter.value + " km";
  }

  function onFilterChange() {
    updateLabels();
    render();
  }

  // --- Mobile drawer -------------------------------------------------------
  function openDrawer() {
    filters.classList.add("open");
    backdrop.hidden = false;
    filterToggle.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    filters.classList.remove("open");
    backdrop.hidden = true;
    filterToggle.setAttribute("aria-expanded", "false");
  }

  // --- Reset ---------------------------------------------------------------
  function resetAll() {
    cityFilter.value = "";
    budgetFilter.value = budgetFilter.max;
    advanceFilter.value = advanceFilter.max;
    availabilityFilter.value = "";
    metroFilter.value = metroFilter.max;
    hospitalFilter.value = hospitalFilter.max;
    schoolFilter.value = schoolFilter.max;
    searchInput.value = "";
    searchQuery = "";
    onFilterChange();
  }

  // --- Wire up events ------------------------------------------------------
  function init() {
    populateCities();
    updateLabels();
    render();

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      searchQuery = searchInput.value.trim().toLowerCase();
      render();
    });
    // Live search as the user types.
    searchInput.addEventListener("input", function () {
      searchQuery = searchInput.value.trim().toLowerCase();
      render();
    });

    [budgetFilter, advanceFilter, metroFilter, hospitalFilter, schoolFilter].forEach(function (el) {
      el.addEventListener("input", onFilterChange);
    });
    [cityFilter, availabilityFilter].forEach(function (el) {
      el.addEventListener("change", onFilterChange);
    });

    resetFilters.addEventListener("click", resetAll);
    emptyReset.addEventListener("click", resetAll);

    filterToggle.addEventListener("click", function () {
      filters.classList.contains("open") ? closeDrawer() : openDrawer();
    });
    backdrop.addEventListener("click", closeDrawer);
  }

  init();
})();
