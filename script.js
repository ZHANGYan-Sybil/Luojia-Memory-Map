
// =====================================
// Luojia Memory Map
// Stage 5: Supabase Integration
// =====================================


// 1. Initialize the map

const map = L.map("map").setView(
    [30.538, 114.361],
    15
);

// Keep the map tile provider that worked in Stage 3.
L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
).addTo(map);


// 2. Initialize the Supabase client

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// 3. Get HTML elements

const memoryPanel = document.getElementById("memoryPanel");
const selectedLocation = document.getElementById("selectedLocation");
const memoryInput = document.getElementById("memoryInput");
const characterCount = document.getElementById("characterCount");
const errorMessage = document.getElementById("errorMessage");
const statusMessage = document.getElementById("statusMessage");

const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const memoryCount = document.getElementById("memoryCount");


// 4. Application state

let selectedLatLng = null;
let temporaryMarker = null;
let isSaving = false;

// All saved memory markers are managed here.
const memoryLayer = L.layerGroup().addTo(map);


// 5. Select a location on the map

map.on("click", function (event) {

    if (isSaving) {
        return;
    }

    selectedLatLng = event.latlng;

    // Remove previous temporary marker.
    if (temporaryMarker !== null) {
        map.removeLayer(temporaryMarker);
    }

    temporaryMarker = L.marker(
        selectedLatLng
    ).addTo(map);

    selectedLocation.textContent =
        selectedLatLng.lat.toFixed(5) + ", " +
        selectedLatLng.lng.toFixed(5);

    memoryPanel.classList.remove("hidden");
    memoryPanel.scrollIntoView({
    behavior: "smooth",
    block: "center"
});
    errorMessage.textContent = "";
    statusMessage.textContent = "";
});


// 6. Character count


memoryInput.addEventListener("input", function () {

    const currentLength = memoryInput.value.length;

    characterCount.textContent = currentLength;

    // Warn when approaching the limit
    if (currentLength >= 450) {
        characterCount.style.color = "#B96F58";
    } else {
        characterCount.style.color = "#819287";
    }

    errorMessage.textContent = "";
});



// 7. Cancel current selection

cancelButton.addEventListener("click", function () {

    if (isSaving) {
        return;
    }

    clearSelection();
    statusMessage.textContent = "已取消本次记录。";
});


// 8. Submit a memory to Supabase

saveButton.addEventListener("click", async function () {

    // Prevent repeated submissions.
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

    // Save the exact selected position.
    const latitude = selectedLatLng.lat;
    const longitude = selectedLatLng.lng;

    isSaving = true;
    saveButton.disabled = true;
    cancelButton.disabled = true;
    saveButton.textContent = "正在保存…";

    errorMessage.textContent = "";
    statusMessage.textContent = "正在保存你的记忆…";

    try {

        // Insert into the cloud database.
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

        // Database confirmed the insert.
        clearSelection();

        statusMessage.textContent =
            "记忆已保存到云端！正在更新地图…";

        // Reload saved memories.
        const refreshed = await loadMemories();

        if (refreshed) {
            statusMessage.textContent =
                "记忆已成功保存！刷新网页后仍然可以找到它。";
        } else {
            statusMessage.textContent =
                "记忆已保存到云端，但地图暂时无法刷新。请稍后重新加载页面。";
        }

    } catch (error) {

        console.error("Memory save failed:", error);

        // Keep the draft so the user can try again.
        errorMessage.textContent =
            "保存失败，请检查网络连接后重试。";

        statusMessage.textContent =
            "记忆尚未确认保存，请不要关闭页面。";

    } finally {

        isSaving = false;
        saveButton.disabled = false;
        cancelButton.disabled = false;
        saveButton.textContent = "留下这段记忆";

    }
});


// 9. Load memories from Supabase

async function loadMemories() {

    try {

        const { data, error } = await db
            .from("memories")
            .select("id, content, latitude, longitude, created_at")
            .order("created_at", { ascending: true })
            .limit(200);

        if (error) {
            throw error;
        }

        // Clear old markers only after a successful response.
        memoryLayer.clearLayers();

        for (const memory of data || []) {
            addMemoryMarker(memory);
        }
        memoryCount.textContent = (data || []).length;

        console.log("Memories loaded:", (data || []).length);
        return true;

    } catch (error) {

        console.error("Memory loading failed:", error);

        statusMessage.textContent =
            "无法读取云端记忆，请检查网络后刷新页面。";

        return false;
    }
}


// 10. Create a marker from a database record

function addMemoryMarker(memory) {

    const memoryMarker = L.marker([
        memory.latitude,
        memory.longitude
    ]);

    const popupContent = document.createElement("div");

    const popupTitle = document.createElement("strong");
    popupTitle.textContent = "一段留在这里的记忆";

    const popupText = document.createElement("p");
    popupText.textContent = memory.content;

    popupText.style.whiteSpace = "pre-wrap";
    popupText.style.overflowWrap = "anywhere";

    popupContent.appendChild(popupTitle);
    popupContent.appendChild(popupText);

    memoryMarker.bindPopup(popupContent);
    memoryMarker.addTo(memoryLayer);
}


// 11. Clear the input panel

function clearSelection() {

    selectedLatLng = null;

    if (temporaryMarker !== null) {
        map.removeLayer(temporaryMarker);
        temporaryMarker = null;
    }

    memoryInput.value = "";
    characterCount.textContent = "0";
    errorMessage.textContent = "";

    memoryPanel.classList.add("hidden");
}


// 12. Load existing memories when the page opens

statusMessage.textContent = "正在读取地图上的记忆…";

loadMemories().then(function (success) {

    if (success) {
        statusMessage.textContent =
            "地图已准备好。点击任意位置，留下你的故事。";
    }
});

console.log("Luojia Memory Map Stage 5 initialized.");