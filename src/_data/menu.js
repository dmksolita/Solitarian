// Data Engineer: fetches the weekly canteen menu from the Off-Brand API.
// Falls back to an empty array so the template shows the "no menu" state.
const site = require("./site.json");
const API_BASE = site.canteenApiUrl;

module.exports = async function () {
  try {
    const res = await fetch(`${API_BASE}/menu`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const raw = await res.json();

    // Accept both a bare array and an envelope like { menu: [...] }
    const items = Array.isArray(raw)
      ? raw
      : raw.menu ?? raw.items ?? raw.data ?? [];

    return items.map((item) => {
      const meat = item.meat ?? item.mainDish ?? item.main ?? "";
      const vegi = item.vegi ?? item.vegetarian ?? item.veggie ?? item.vegDish ?? "";

      return {
        date: item.date,                   // expected "DD/MM/YY" — same as menu.json
        meat,
        vegi,
        meatImage: item.meatImage,//`${API_BASE}/menu/images/${encodeURIComponent(meat)}`, // different URL while debugging
        vegiImage: item.vegiImage,//`${API_BASE}/menu/images/${encodeURIComponent(vegi)}`, // different URL while debugging
      };
    });
  } catch (err) {
    console.warn(`[menu] Could not fetch menu from API: ${err.message}`);
    return [];
  }
};
