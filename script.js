
// =====================================
// Luojia Memory Map
// Stage 3: Memory Interaction
// =====================================


// 1. 地图初始化

const initialLatitude = 30.538;
const initialLongitude = 114.361;

const map = L.map("map").setView(
    [initialLatitude, initialLongitude],
    15
);

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
).addTo(map);


// 2. 获取页面中的元素

const memoryPanel = document.getElementById("memoryPanel");
const selectedLocation = document.getElementById("selectedLocation");
const memoryInput = document.getElementById("memoryInput");
const characterCount = document.getElementById("characterCount");
const errorMessage = document.getElementById("errorMessage");
const statusMessage = document.getElementById("statusMessage");

const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");


// 3. 保存当前状态

let selectedLatLng = null;
let temporaryMarker = null;

// 本阶段的记忆仅保存在浏览器内存中
const memories = [];


// 4. 点击地图，选择一个位置

map.on("click", function (event) {

    // 取得鼠标点击位置的经纬度
    selectedLatLng = event.latlng;

    // 如果已经有临时标记，先移除
    if (temporaryMarker !== null) {
        map.removeLayer(temporaryMarker);
    }

    // 添加新的临时标记
    temporaryMarker = L.marker(
        selectedLatLng
    ).addTo(map);

    // 显示所选位置
    selectedLocation.textContent =
        selectedLatLng.lat.toFixed(5) + ", " +
        selectedLatLng.lng.toFixed(5);

    // 打开输入面板
    memoryPanel.classList.remove("hidden");

    // 清空旧的提示
    errorMessage.textContent = "";
    statusMessage.textContent = "";

    console.log("Location selected:", selectedLatLng);
});


// 5. 更新输入字数

memoryInput.addEventListener("input", function () {

    characterCount.textContent = memoryInput.value.length;

    errorMessage.textContent = "";

});


// 6. 取消当前选点

cancelButton.addEventListener("click", function () {

    clearSelection();

    statusMessage.textContent = "已取消本次记录。";

});


// 7. 保存记忆

saveButton.addEventListener("click", function () {

    // 检查是否选择地点
    if (selectedLatLng === null) {
        errorMessage.textContent = "请先在地图上选择一个位置。";
        return;
    }

    // 获取文字内容
    const content = memoryInput.value.trim();

    // 检查空白内容
    if (content === "") {
        errorMessage.textContent = "请先写下一段记忆。";
        memoryInput.focus();
        return;
    }

    // 创建一条记忆对象
    const memory = {
        content: content,
        latitude: selectedLatLng.lat,
        longitude: selectedLatLng.lng,
        createdAt: new Date().toISOString()
    };

    // 暂存到数组
    memories.push(memory);

    // 移除临时标记
    if (temporaryMarker !== null) {
        map.removeLayer(temporaryMarker);
        temporaryMarker = null;
    }

    // 创建正式的记忆标记
    const memoryMarker = L.marker([
        memory.latitude,
        memory.longitude
    ]).addTo(map);

    // 创建用于显示文字的弹窗元素
    const popupContent = document.createElement("div");

    const popupTitle = document.createElement("strong");
    popupTitle.textContent = "一段留在这里的记忆";

    const popupText = document.createElement("p");
    popupText.textContent = memory.content;
    popupText.style.whiteSpace = "pre-wrap";
    popupText.style.overflowWrap = "anywhere";

    popupContent.appendChild(popupTitle);
    popupContent.appendChild(popupText);

    // 将弹窗绑定到标记
    memoryMarker.bindPopup(popupContent);

    // 显示刚刚保存的记忆
    memoryMarker.openPopup();

    // 清空输入状态
    clearSelection();

    // 提供反馈
    statusMessage.textContent =
        "记忆已添加到当前地图！刷新网页后会消失，云端保存将在下一阶段实现。";

    console.log("Memory added:", memory);
});


// 8. 清空当前选点

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


// 9. 初始化成功提示

console.log("Luojia Memory Map Stage 3 initialized.");