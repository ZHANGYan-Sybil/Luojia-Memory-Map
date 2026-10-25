// Luojia Memory Map - Stage 2

const map = L.map("map").setView([30.538, 114.361], 15);

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }
).addTo(map);

L.marker([30.538, 114.361])
    .addTo(map)
    .bindPopup("珞珈记忆地图：故事从这里开始。");

console.log("Map initialized successfully!");