
// ===============================================
// Luojia Memory Map
// Visual Redesign - Round 1
// Leaflet + Supabase
// ===============================================



 // =====================================
 // 1. MAP CONFIGURATION
 // =====================================

 // Original campus view
 const initialCenter = [30.538, 114.361];
 const initialZoom = 15;

 // Browsing boundary
 const southwest = [30.51823, 114.31415];
 const northeast = [30.55706, 114.40688];

 const browsingBounds = L.latLngBounds(
     southwest,
     northeast
 );

 // Keep a small buffer around the selected area
 const allowedBounds = browsingBounds.pad(0.15);

 // Create map
 const map = L.map("map", {
     zoomControl: false,
     maxBounds: allowedBounds,
     maxBoundsViscosity: 1.0
 });

 // Limit zooming out while preserving the campus view
 const minimumZoom = Math.min(
     initialZoom,
     Math.max(10, map.getBoundsZoom(allowedBounds, false) - 1)
 );

 map.setMinZoom(minimumZoom);

 // Restore the original initial view
 map.setView(initialCenter, initialZoom);

 // Standard zoom buttons
 L.control.zoom({
     position: "bottomleft"
 }).addTo(map);


 // =====================================
 // HOME CONTROL - Return to campus
 // =====================================

 const HomeControl = L.Control.extend({

     options: {
         position: "bottomleft"
     },

     onAdd: function () {

         const container = L.DomUtil.create(
             "div",
             "leaflet-bar leaflet-control home-control"
         );

         const button = L.DomUtil.create(
             "a",
             "home-control-button",
             container
         );

         button.href = "#";
         button.title = "返回校园初始视角";
         button.setAttribute(
             "aria-label",
             "返回校园初始视角"
         );
         button.setAttribute("role", "button");

         // Simple home icon
         button.innerHTML = `
             <svg
                 width="19"
                 height="19"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round"
                 aria-hidden="true"
             >
                 <path d="M3 10.5L12 3l9 7.5"/>
                 <path d="M5 9.5V21h14V9.5"/>
                 <path d="M9 21v-7h6v7"/>
             </svg>
         `;

         // Prevent clicks from selecting a map location
         L.DomEvent.disableClickPropagation(container);
         L.DomEvent.disableScrollPropagation(container);

         L.DomEvent.on(button, "click", function (event) {

             L.DomEvent.stop(event);

             map.setView(initialCenter, initialZoom, {
                 animate: true
             });

         });

         // Keyboard activation with Space
         L.DomEvent.on(button, "keydown", function (event) {
             if (event.key === " ") {
                 L.DomEvent.stop(event);
                 button.click();
             }
         });

         return container;
     }
 });

 new HomeControl().addTo(map);

// 2. MAP TILES

// If you previously used a different working tile
// provider, preserve that provider and attribution.


/* ==========================================
   Base map — MapTiler Streets
   Keep existing Leaflet interactions
========================================== */


/* ==========================================
   WHU CUSTOM VECTOR MAP
   MapTiler + Leaflet
========================================== */


/* ==========================================
   WHU CUSTOM VECTOR MAP
   Leaflet + MapTiler
========================================== */

const whuMapStyle =
    "https://api.maptiler.com/maps/01a18123-2017-7deb-bfdc-693d0a4a2098/style.json";

if (
    !L.maptiler ||
    typeof L.maptiler.maptilerLayer !== "function"
) {
    throw new Error(
        "MapTiler Leaflet adapter has not loaded."
    );
}

L.maptiler.maptilerLayer({
    apiKey: "QP1m3O3Dp9GywfgbSNzj",
    style: whuMapStyle
}).addTo(map);


// 3. SUPABASE CONNECTION

// Values are defined in the existing config.js file.
const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// 4. GET PAGE ELEMENTS

const memoryPanel = document.getElementById("memoryPanel");

const memoryInput = document.getElementById("memoryInput");
const characterCount = document.getElementById("characterCount");

const errorMessage = document.getElementById("errorMessage");
const statusMessage = document.getElementById("statusMessage");

const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const panelCloseButton = document.getElementById("panelCloseButton");

const memoryCount = document.getElementById("memoryCount");


// Prevent clicks inside the panel from reaching the map
L.DomEvent.disableClickPropagation(memoryPanel);
L.DomEvent.disableScrollPropagation(memoryPanel);


// 5. APPLICATION STATE

let selectedLatLng = null;

let temporaryMarker = null;
let addButtonMarker = null;

let isSaving = false;

// Saved memory markers
const memoryLayer = L.layerGroup().addTo(map);


// 6. CUSTOM TEMPORARY LOCATION ICON

const selectionIcon = L.divIcon({
    className: "selection-marker",
    html: '<div class="selection-dot"></div>',
    iconSize: [17, 17],
    iconAnchor: [8, 8]
});


// 7. SELECT A LOCATION

map.on("click", function (event) {

    // Do not change location during a save request
    if (isSaving) {
        return;
    }

    selectedLatLng = event.latlng;

    // Remove previous temporary markers
    removeTemporaryMarkers();

    // Show the selected location
    temporaryMarker = L.marker(selectedLatLng, {
        icon: selectionIcon,
        interactive: false
    }).addTo(map);

    // Create the circular plus button
    createAddButton(selectedLatLng);

    // The writing panel opens only after clicking +
    memoryPanel.classList.add("hidden");

    errorMessage.textContent = "";

    statusMessage.textContent =
        "地点已选择。点击旁边的 +，开始写下你的记忆。";
});


// 8. CREATE THE PLUS BUTTON

function createAddButton(latlng) {

    // Create the button using DOM methods
    const button = document.createElement("button");

    button.type = "button";
    button.className = "add-memory-button";
    button.textContent = "+";
    button.title = "在这里留下记忆";
    button.setAttribute(
        "aria-label",
        "在选定地点添加记忆"
    );

    // Avoid passing the click through to the map
    L.DomEvent.disableClickPropagation(button);

    button.addEventListener("click", function (event) {

        event.stopPropagation();
        event.preventDefault();

        openMemoryPanel();
    });

    // The plus icon appears beside the selected point
    const addIcon = L.divIcon({
        className: "add-button-marker",
        html: button,
        iconSize: [39, 39],
        iconAnchor: [-19, 19]
    });

    addButtonMarker = L.marker(latlng, {
        icon: addIcon,
        keyboard: false,
        zIndexOffset: 1000
    }).addTo(map);
}


// 9. OPEN THE WRITING PANEL

function openMemoryPanel() {

    if (selectedLatLng === null || isSaving) {
        return;
    }

    memoryPanel.classList.remove("hidden");

    errorMessage.textContent = "";

    statusMessage.textContent =
        "已打开书写窗口。写下一段属于这里的故事。";

    memoryInput.focus();
}


// 10. UPDATE CHARACTER COUNT

memoryInput.addEventListener("input", function () {

    const currentLength = memoryInput.value.length;

    characterCount.textContent = currentLength;

    if (currentLength >= 450) {
        characterCount.style.color = "#E10800";
    } else {
        characterCount.style.color = "#002554";
    }

    errorMessage.textContent = "";
});


// 11. CANCEL BUTTON

cancelButton.addEventListener("click", function () {

    if (isSaving) {
        return;
    }

    clearSelection();

    statusMessage.textContent = "已取消本次记录。";
});


// 12. CLOSE PANEL BUTTON

panelCloseButton.addEventListener("click", function () {

    if (isSaving) {
        return;
    }

    // Close the panel but keep the selected location
    memoryPanel.classList.add("hidden");

    statusMessage.textContent =
        "书写窗口已关闭。点击地点旁的 + 可以继续。";
});


// 13. SAVE MEMORY TO SUPABASE

saveButton.addEventListener("click", async function () {

    if (isSaving) {
        return;
    }

    if (selectedLatLng === null) {
        errorMessage.textContent =
            "请先在地图上选择一个位置。";
        return;
    }

    const content = memoryInput.value.trim();

    if (content.length === 0) {
        errorMessage.textContent =
            "请先写下一段记忆。";

        memoryInput.focus();
        return;
    }

    if (content.length > 500) {
        errorMessage.textContent =
            "记忆不能超过 500 个字符。";
        return;
    }

    const latitude = selectedLatLng.lat;
    const longitude = selectedLatLng.lng;

    // Lock the interface during saving
    isSaving = true;

    saveButton.disabled = true;
    cancelButton.disabled = true;
    panelCloseButton.disabled = true;

    saveButton.textContent = "正在保存…";

    errorMessage.textContent = "";
    statusMessage.textContent = "正在保存你的记忆…";

    try {

        // Submit to Supabase
        const { error } = await db
            .from("memories")
            .insert({
                content: content,
                latitude: latitude,
                longitude: longitude
            });

        if (error) {
            throw error;
        }

        // The database confirmed the insert
        clearSelection();

        statusMessage.textContent =
            "记忆已保存到云端，正在更新地图…";

        const refreshed = await loadMemories();

        if (refreshed) {
            statusMessage.textContent =
                "记忆已成功保存！你可以继续探索地图。";
        } else {
            statusMessage.textContent =
                "记忆已保存，但地图暂时无法刷新。请稍后重新加载页面。";
        }

    } catch (error) {

        console.error("Memory save failed:", error);

        // Preserve the user's draft
        errorMessage.textContent =
            "保存失败，请检查网络连接后重试。";

        statusMessage.textContent =
            "本次提交尚未确认成功，请检查网络。";

    } finally {

        isSaving = false;

        saveButton.disabled = false;
        cancelButton.disabled = false;
        panelCloseButton.disabled = false;

        saveButton.textContent = "留下这段记忆";
    }
});


// 14. LOAD SAVED MEMORIES

async function loadMemories() {

    try {

        const { data, error } = await db
            .from("memories")
            .select(
                "id, content, latitude, longitude, created_at"
            )
            .order("created_at", {
                ascending: true
            })
            .limit(200);

        if (error) {
            throw error;
        }

        const records = data || [];

        // Remove previous saved markers
        memoryLayer.clearLayers();

        // Add one marker for each stored memory
        for (const memory of records) {
            addMemoryMarker(memory);
        }

        // Update number of loaded memories
        memoryCount.textContent = records.length;

        console.log(
            "Loaded memories:",
            records.length
        );

        return true;

    } catch (error) {

        console.error(
            "Memory loading failed:",
            error
        );

        statusMessage.textContent =
            "暂时无法读取云端记忆，请检查网络连接。";

        return false;
    }
}



// =====================================
// 15. DISPLAY SAVED MEMORY MARKERS
// =====================================

// WHU-green archival pin, no enamel highlight arc
const savedMemoryIcon = L.divIcon({
    className: "saved-memory-marker",

    html: `
        <svg
            viewBox="0 0 40 52"
            width="40"
            height="52"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <ellipse
                cx="20"
                cy="48"
                rx="11"
                ry="3"
                fill="#115740"
                opacity="0.18"
            />

            <path
                d="M20 46
                   C13 35 3 26 3 18
                   A17 17 0 1 1 37 18
                   C37 26 27 35 20 46Z"
                fill="#0B4130"
            />

            <path
                d="M20 43
                   C14 33 6 25 6 18
                   A14 14 0 1 1 34 18
                   C34 25 26 33 20 43Z"
                fill="#115740"
            />

            <circle
                cx="20"
                cy="18"
                r="5.5"
                fill="#FFF9ED"
            />
        </svg>
    `,

    iconSize: [40, 52],
    iconAnchor: [20, 46],
    popupAnchor: [0, -40]
});


// Add one saved memory marker

function addMemoryMarker(memory) {

    const marker = L.marker(
        [
            memory.latitude,
            memory.longitude
        ],
        {
            icon: savedMemoryIcon,
            title: "阅读此处的记忆"
        }
    );

    // Show only the memory itself.
    // Do not repeat a generic heading in every popup.
    const popupContent = document.createElement("div");

    popupContent.className = "memory-story";

    const popupText = document.createElement("p");

    // Keep user-submitted text safe.
    popupText.textContent = memory.content;

    popupContent.appendChild(popupText);

    marker.bindPopup(popupContent, {
        maxWidth: 330,
        minWidth: 210,
        className: "memory-popup"
    });

    marker.addTo(memoryLayer);
}


// 16. REMOVE TEMPORARY MARKERS

function removeTemporaryMarkers() {

    if (temporaryMarker !== null) {
        map.removeLayer(temporaryMarker);
        temporaryMarker = null;
    }

    if (addButtonMarker !== null) {
        map.removeLayer(addButtonMarker);
        addButtonMarker = null;
    }
}


// 17. CLEAR THE CURRENT SELECTION

function clearSelection() {

    selectedLatLng = null;

    removeTemporaryMarkers();

    memoryInput.value = "";
    characterCount.textContent = "0";
    characterCount.style.color = "#002554";

    errorMessage.textContent = "";

    memoryPanel.classList.add("hidden");
}


// 18. INITIAL DATABASE LOAD

statusMessage.textContent =
    "正在读取地图上的记忆…";

loadMemories().then(function (success) {

    if (success) {
        statusMessage.textContent = "";
    }
});

console.log(
    "Luojia Memory Map: Redesign Round 1 initialized."
);