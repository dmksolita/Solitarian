const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {

  // --- Passthrough copies ---
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "HTML_TEMPLATE/images": "assets/images" });
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // --- Collections ---
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/content/posts/**/*.md").reverse()
  );

  // "latest" collection — most recent 5 items across all content types
  eleventyConfig.addCollection("latest", (api) => {
    return api
      .getFilteredByGlob("src/content/**/*.md")
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  });

  // --- Filters ---
  eleventyConfig.addFilter("readableDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("d LLL yyyy")
  );

  eleventyConfig.addFilter("isoDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO()
  );

  // --- Calendar filters ---

  function parseEventDateStr(str) {
    const parts = str.split("/");
    const dd = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10) - 1;
    const yy = 2000 + parseInt(parts[2], 10);
    return new Date(Date.UTC(yy, mm, dd));
  }

  function buildMonthGrid(year, month, parsedEvents) {
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    const startDow = (firstDay.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
    const totalDays = lastDay.getUTCDate();
    const cells = [];

    for (let i = 0; i < startDow; i++) cells.push({ day: null, iso: null, events: [] });

    for (let d = 1; d <= totalDays; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayEvents = parsedEvents
        .filter(e => e.iso === iso)
        .map(e => ({ title: e.title, category: e.category, color: e.color }));
      cells.push({ day: d, iso, events: dayEvents });
    }

    while (cells.length % 7 !== 0) cells.push({ day: null, iso: null, events: [] });

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const MONTHS = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];
    return { year, month, monthName: `${MONTHS[month]} ${year}`, weeks };
  }

  eleventyConfig.addFilter("parseEventDate", (str) => parseEventDateStr(str));

  eleventyConfig.addFilter("todayISO", () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });

  function prepareEvents(events, categories) {
    const catMap = {};
    if (Array.isArray(categories)) categories.forEach(c => { catMap[c.id] = c.color; });
    return events.map(e => {
      const d = parseEventDateStr(e.date);
      return {
        title: e.title,
        category: e.category ?? "",
        color: catMap[e.category] ?? "#5a9ab5",
        iso: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
      };
    });
  }

  eleventyConfig.addFilter("thisMonthGrid", (events, categories) => {
    const now = new Date();
    return buildMonthGrid(now.getFullYear(), now.getMonth(), prepareEvents(events, categories));
  });

  eleventyConfig.addFilter("nextMonthGrid", (events, categories) => {
    const now = new Date();
    const y = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    const m = (now.getMonth() + 1) % 12;
    return buildMonthGrid(y, m, prepareEvents(events, categories));
  });

  eleventyConfig.addFilter("monthGrid", (events, year, month) => {
    return buildMonthGrid(year, month, prepareEvents(events));
  });

  // --- Calendar helpers ---
  eleventyConfig.addFilter("getCategoryColor", (categories, id) => {
    const cat = (categories || []).find(c => c.id === id);
    return cat ? cat.color : "#5a9ab5";
  });

  // --- Menu helpers ---
  eleventyConfig.addFilter("menuDayInfo", (dateStr) => {
    // dateStr format: "DD/MM/YY"
    const d = parseEventDateStr(dateStr);
    const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const iso  = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
    const slug = dateStr.replace(/\//g, ""); // "200526"
    return {
      iso,
      slug,
      dayName:     DAYS[d.getUTCDay()],
      displayDate: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`,
    };
  });

  // --- Dev server ---
  eleventyConfig.setServerOptions({
    port: 8080,
    open: true,
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
