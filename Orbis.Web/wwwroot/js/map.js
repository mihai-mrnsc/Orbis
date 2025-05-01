let map;

async function getVisited() {
    const res = await fetch("/api/visitedcountries");
    return await res.json(); // array de coduri ISO
}

async function toggleCountry(code, isVisited) {
    const method = isVisited ? "POST" : "DELETE";
    await fetch(`/api/visitedcountries/${code}`, { method });
}

function updateCounter(count) {
    const counter = document.querySelector('.visited-counter');
    if (counter) {
        counter.innerHTML = `🌍 Countries visited: <strong>${count}</strong>`;
    }
}

async function initMap() {    
    map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const countries = await fetch('/data/countries.geo.json').then(r => r.json());
    const visited = await getVisited();

    const counter = L.control({position: 'topright'});
    counter.onAdd = function (){
        const div = L.DomUtil.create('div', 'visited-counter');
        div.innerHTML = `🌍 Countries visited: <strong>${visited.length}</strong>`;
        return div;
    };
    counter.addTo(map);

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

            layer.on('click', async () => {
                isVisited = !isVisited;
                
                await toggleCountry(code, isVisited); // Toggle the country in the database                
                
                layer.setStyle({
                    fillColor: isVisited ? '#2ecc71' : '#ccc',
                    fillOpacity: isVisited ? 1 : 0.6
                });

                const updated = await getVisited(); // Fetch the updated list of visited countries
                updateCounter(updated.length);
            });
        }
    }).addTo(map);
    updateCounter(visited.length);
}

// async function updateVisitedUI() {
//     const visited = await getVisited();
//     document.getElementById('visited-counter').textContent = `Visited: ${visited.length}`;
// }

async function clearVisited() {
    await fetch("/api/visitedcountries", { method: "DELETE" });
    updateCounter(0);
    map.eachLayer(layer => {
        if (layer.feature && layer.feature.id) {
            layer.setStyle({
                fillColor: '#ccc',
                fillOpacity: 0.6
            });
        }
    });

    const visited = await getVisited(); // List should be empty now
    document.querySelector('.visited-counter').innerHTML = `🌍 Countries visited: <strong>${visited.length}</strong>`;
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    document.getElementById('clear-button').addEventListener('click', clearVisited);
});

