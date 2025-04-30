let map;
const visitedKey = "orbis_visited_countries";

function getVisitedCountries() {
    return JSON.parse(localStorage.getItem(visitedKey) || "[]");
}

function saveVisitedCountries(codes) {
    localStorage.setItem(visitedKey, JSON.stringify(codes));
}

async function initMap() {
    map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const countries = await fetch('/data/countries.geo.json').then(r => r.json());
    const visited = getVisitedCountries();

    L.geoJSON(countries, {
        style: feature => ({
            fillColor: visited.includes(feature.id) ? '#2ecc71' : '#ccc',
            weight: 1,
            color: '#999',
            fillOpacity: visited.includes(feature.id) ? 1 : 0.6
        }),
        onEachFeature: (feature, layer) => {
            let code = feature.id;
            let isVisited = visited.includes(code);

            layer.on('click', () => {
                isVisited = !isVisited;

                layer.setStyle({
                    fillColor: isVisited ? '#2ecc71' : '#ccc',
                    fillOpacity: isVisited ? 1 : 0.6
                });

                const updated = new Set(getVisitedCountries());
                if (isVisited) {
                    updated.add(code);
                } else {
                    updated.delete(code);
                }
                saveVisitedCountries([...updated]);
            });
        }
    }).addTo(map);
}
