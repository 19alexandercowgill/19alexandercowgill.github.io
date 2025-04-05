let width = window.innerWidth;
let height = window.innerHeight;

const svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

let projection = d3.geoMercator()
    .scale(250)
    .translate([width / 2, (height / 4) * 2.9]);

let path = d3.geoPath().projection(projection);

const teachers = {};
let countries;
let countryStats = {};

const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.75)")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("font-size", "14px")
    .style("pointer-events", "none")
    .style("display", "none")
    .style("z-index", "1000");

function formatNumber(value, type = "currency") {
    if (value >= 1e12) return type === "currency" ? `$${(value / 1e12).toFixed(2)}T` : `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9)  return type === "currency" ? `$${(value / 1e9).toFixed(2)}B` : `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6)  return type === "currency" ? `$${(value / 1e6).toFixed(2)}M` : `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3)  return type === "currency" ? `$${(value / 1e3).toFixed(2)}K` : `${(value / 1e3).toFixed(1)}K`;
    return type === "currency" ? `$${value}` : `${value}`;
}

const nameAliases = {
    "Russia": "Russian Federation",
    "United States of America": "United States",
    "Somaliland": "Somalia",
    "South Korea": "North Korea", //no data
    // format: Map expected: api expected
};

function normaliseName(name) {
    return nameAliases[name] || name;
}

Promise.all([
    d3.json("/wg/cdn/countries-110m.json"),
    d3.csv("/wg/cdn/gdp.csv"),
    fetch("/wg/cdn/population.json").then(res => res.json())
]).then(([worldData, gdpCsv, popJson]) => {
    countries = topojson.feature(worldData, worldData.objects.countries);

    const gdpData = {};
    gdpCsv.forEach(d => {
        const name = d["Country Name"];
        const year = +d["Year"];
        const value = +d["Value"];
        if (!gdpData[name] || gdpData[name].year < year) {
            gdpData[name] = { year, value };
        }
    });

    const populationData = {};
    popJson.data.forEach(d => {
        const name = d.country;
        const last = d.populationCounts[d.populationCounts.length - 1];
        populationData[name] = last ? +last.value : null;
    });

    countries.features.forEach(feature => {
        const mapName = feature.properties.name;
        const normalised = normaliseName(mapName);

        const gdp = gdpData[normalised] ? formatNumber(gdpData[normalised].value, "currency") : "Data Unavailable";
        const pop = populationData[normalised] ? formatNumber(populationData[normalised], "number") : "Data Unavailable";
        countryStats[mapName] = { gdp, population: pop };
    });

    svg.selectAll(".country")
        .data(countries.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .on("click", (event, d) => {
            const countryName = d.properties.name;
            let teacherName = prompt(`Enter teacher's name for ${countryName}:`);
            if (teacherName) {
                teachers[countryName] = teacherName.trim();
                updateTeacherLabels();
            }
        })
        .on("mouseover", (event, d) => {
            const name = d.properties.name || "Unknown";
            const teacher = teachers[name];
            const tName = teacher ? `<br>Teacher: <i>${teacher}</i>` : "";
            const stats = countryStats[name] || {};
            tooltip
                .html(`<strong>${name}</strong>${tName}<br>GDP: ${stats.gdp}<br>Population: ${stats.population}`)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 20) + "px")
                .style("display", "block");
        })
        .on("mousemove", (event) => {
            tooltip
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });

    updateTeacherLabels();
});

function updateTeacherLabels() {
    svg.selectAll(".country-name").remove();

    Object.entries(teachers).forEach(([countryName, teacherName]) => {
        const country = countries.features.find(d => d.properties.name === countryName);
        if (!country) return;

        const centroid = path.centroid(country);
        svg.append("text")
            .attr("class", "country-name")
            .attr("x", centroid[0])
            .attr("y", centroid[1])
            .text(teacherName)
            .style("fill", "#333")
            .style("font-size", "12px")
            .style("text-anchor", "middle");
    });
}

window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;

    svg.attr("width", width).attr("height", height);
    projection.translate([width / 2, (height / 4) * 3]);

    path = d3.geoPath().projection(projection);
    svg.selectAll(".country").attr("d", path);
    updateTeacherLabels();
});
