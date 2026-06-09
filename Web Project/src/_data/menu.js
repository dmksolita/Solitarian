// Data Engineer: fetches the weekly canteen menu from the Off-Brand API.
// Falls back to an empty array so the template shows the "no menu" state.
const site = require("./site.json");
const API_BASE = site.canteenApiUrl;
const API_KEY  = process.env.MENU_API_KEY;

module.exports = async function () {
  try {
    const headers = API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {};
    const res = await fetch(`${API_BASE}/menu`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const raw = await res.json();

    // Accept both a bare array and an envelope like { menu: [...] }
    const items = Array.isArray(raw)
      ? raw
      : raw.menu ?? raw.items ?? raw.data ?? [];

    // Group flat per-dish items by date, then build one card per day
    const byDate = {};
    for (const item of items) {
      if (!byDate[item.date]) byDate[item.date] = {};
      if (item.type === "meat") {
        byDate[item.date].meat = item.name;
        byDate[item.date].meatImage = `${API_BASE}/images/${item.dish_id}.png`;
      } else if (item.type === "veggie") {
        byDate[item.date].vegi = item.name;
        byDate[item.date].vegiImage = `${API_BASE}/images/${item.dish_id}.png`;
      }
    }

    return Object.entries(byDate).map(([date, dishes]) => ({
      date,
      meat: dishes.meat ?? "",
      vegi: dishes.vegi ?? "",
      meatImage: dishes.meatImage ?? "",
      vegiImage: dishes.vegiImage ?? "",
    }));
  } catch (err) {
    console.warn(`[menu] Could not fetch menu from API: ${err.message}`);
    return [];
  }
};
