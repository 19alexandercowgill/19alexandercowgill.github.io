let width = window.innerWidth;
let height = window.innerHeight;

const svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

let projection = d3.geoMercator()
    .scale(250)
    .translate([width/2, (height/4)*3.5]);

let path = d3.geoPath().projection(projection);

const teachers = {}; // Stores one teacher per country
let countries; // Stores country data

d3.json("/wg/cdn/countries-110m.json").then(worldData => {
    countries = topojson.feature(worldData, worldData.objects.countries);
    
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
        });

    updateTeacherLabels(); // Ensure labels are placed initially
});

function updateTeacherLabels() {
    // Remove old labels
    svg.selectAll(".country-name").remove();

    // Re-render labels based on the stored teacher data
    Object.entries(teachers).forEach(([countryName, teacherName]) => {
        const country = countries.features.find(d => d.properties.name === countryName);
        if (!country) return;

        const centroid = path.centroid(country);
        svg.append("text")
            .attr("class", "country-name")
            .attr("x", centroid[0])
            .attr("y", centroid[1])
            .text(teacherName);
    });
}

// Resize and re-render on window resize
window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;

    svg.attr("width", width).attr("height", height);
    projection.translate([width/2, (height/4)*3]);

    path = d3.geoPath().projection(projection);

    svg.selectAll(".country").attr("d", path);
    updateTeacherLabels(); // Re-render teacher labels in correct positions
});