function checkIfInsideFigure(r, x, y) {
    if (x <= 0 && y <= 0 && y >= -r && x >= -r / 2) {
        return true;
    }

    if (x >= 0 && y <= 0 && y >= x - r / 2) {
        return true;
    }

    if (x >= 0 && y >= 0 && Math.sqrt(x ** 2 + y ** 2) <= r / 2) {
        return true;
    }

    return false;
}

const canvas = document.getElementById("graph");
const context = canvas.getContext("2d");

context.lineWidth = 1;
context.fillStyle = "#378CFA";

drawFigure(context, 3);

context.strokeStyle = "black";
drawCoords(canvas, context);

loadChecks();

const form = document.getElementById("check-form");
const x_error = document.querySelector("#x-error");
const y_error = document.querySelector("#y-error");
const r_error = document.querySelector("#r-error");
const buttons = document.querySelectorAll(".input-group button");
const clear_button = document.querySelector(".clear-group button");
const select_element = document.querySelector("#r-select");
const text_element = document.querySelector("#y-input");
const table_button = document.querySelector(".tablebutton-group button");
const funny_button = document.querySelector("#fun");

let current_r;
let current_x;
let current_y;
let current_color;
let wasDrawn = false;
let pointActive = false;

let selectedButton = null;

buttons.forEach(button => {
    button.addEventListener("click", () => {

        x_error.textContent = "";

        if (button == selectedButton){
            button.classList.remove("selected-button");
            selectedButton = null;  
            return;
        }

        for (let cur_button of buttons){
            cur_button.classList.remove("selected-button");
            selectedButton = null;
        }

        button.classList.add("selected-button");
        selectedButton = button;
    });
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    let is_wrong = false;
    if (select_element.selectedIndex === 0) {
        select_element.classList.add("error");
        r_error.textContent = "Выберите значение R.";
        is_wrong = true;
    } else {
        select_element.classList.remove("error");
        r_error.textContent = "";
    }

    if (selectedButton === null) {
        x_error.textContent = "Выберите значение X.";
        is_wrong = true;
    } else {
        x_error.textContent = "";
    }

    const y_value = text_element.value.trim().replace(",", ".");
    const regex = /^-?\d+([.]\d+)?$/;
    if (y_value === "") {
        y_error.textContent = "Введите значение Y.";
        text_element.classList.add("error");
        is_wrong = true;
    } else if (!regex.test(y_value)) {
        y_error.textContent = "Y обязан быть числом.";
        text_element.classList.add("error");
        is_wrong = true;
    } else {
        const y_temp = Number(y_value);
        if (y_temp <= -5 || y_temp >= 3) {
            y_error.textContent = "Y должен быть в диапазоне (-5 .. 3)";
            text_element.classList.add("error");
            is_wrong = true;
        } else {
            y_error.textContent = "";
            text_element.classList.remove("error");
        }
    }
    if (is_wrong) {
        return;
    }
    const r = Number(select_element.value);
    const x = Number(selectedButton.textContent);
    const y = Number(y_value);
    console.log(r, x, y);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#378CFA";
    drawFigure(context, r);
    context.strokeStyle = "black";
    drawCoords(canvas, context);
    let result = checkIfInsideFigure(r, x, y);
    if (result){
        drawPoint(context, 300 + x * 40, 300 - y * 40, "lime");
        current_color = "lime";
    }
    else {
        drawPoint(context, 300 + x * 40, 300 - y * 40, "red");
        current_color = "red";
    }
    addCheck(r, x, y, result);
    current_r = r;
    current_x = x;
    current_y = y;
    wasDrawn = true;
    pointActive = true;
});


clear_button.addEventListener("click", () => {
    form.reset();
    selectedButton = null;
    buttons.forEach(button => {
        button.classList.remove("selected-button");
    });
    select_element.classList.remove("error");
    text_element.classList.remove("error");
    x_error.textContent = "";
    y_error.textContent = "";
    r_error.textContent = "";
});


select_element.addEventListener("change", () => {
    select_element.classList.remove("error");
    r_error.textContent = "";
    if (select_element.selectedIndex === 0) {
        return;
    }
    const rad = Number(select_element.value);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#378CFA";
    drawFigure(context, rad);
    context.strokeStyle = "black";
    drawCoords(canvas, context);
    current_r = rad;
    pointActive = false;
});

table_button.addEventListener("click", () => {
    localStorage.removeItem("results");
    const tbody = document.getElementById("checks-body");
    while (tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
});


funny_button.addEventListener("click", () =>{
    let img = new Image();
    img.src = "Чил-зима-в-Египте.png";
    img.onload = (() =>{
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        context.fillStyle = "#378CFA";
        if (wasDrawn){
            drawFigure(context, current_r);
        }
        else {
            drawFigure(context, 3);
        }
        context.strokeStyle = "black";
        drawCoords(canvas, context);
        if (wasDrawn && pointActive){
            drawPoint(context, 300 + current_x * 40, 300 - current_y * 40, current_color);
        }
        setTimeout(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "#378CFA";
            if (wasDrawn){
                drawFigure(context, current_r);
            }
            else {
                drawFigure(context, 3);
            }
            context.strokeStyle = "black";
            drawCoords(canvas, context);
            if (wasDrawn && pointActive){
                drawPoint(context, 300 + current_x * 40, 300 - current_y * 40, current_color);
            }
        }, 2000);
    });
});


text_element.addEventListener("input", () => {
    text_element.classList.remove("error");
    y_error.textContent = "";
});


function loadChecks() {
    let results = JSON.parse(localStorage.getItem("results"));
    if (results === null) {
        results = [];
    }
    results.forEach(result => addRow(result));
}

function addCheck(r, x, y, result) {
    let results = JSON.parse(localStorage.getItem("results"));
    if (results === null) {
        results = [];
    }
    const check = {
        x: x,
        y: y,
        r: r,
        result: result,
        timestamp: Date.now()
    };
    results.push(check);
    localStorage.setItem("results", JSON.stringify(results));
    addRow(check);
}


function addRow(record) {
    const tbody = document.getElementById("checks-body");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${record.x}</td>
        <td>${record.y}</td>
        <td>${record.r}</td>
        <td class="${record.result ? "success-text" : "fail-text"}">
            ${record.result ? "Попадание" : "Промах"}
        </td>
        <td>${formatDate(record.timestamp)}</td>
    `;
    tbody.prepend(row);
}


function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString("ru-RU");
}