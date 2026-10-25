
// 找到网页中的元素

const message = document.getElementById("message");

const helloButton = document.getElementById("helloButton");

const resetButton = document.getElementById("resetButton");


// 用户点击“开启旅程”

helloButton.addEventListener("click", function () {

    message.textContent = "旅程已经开启！未来这里将出现我们的记忆地图。";

});


// 用户点击“重新开始”

resetButton.addEventListener("click", function () {

    message.textContent = "欢迎来到珞珈记忆地图！";

});