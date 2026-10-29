// Simple calculator - no eval used, we calculate step by step

var display = document.getElementById("display");
var prevText = document.getElementById("prev");

var current = "0";     // number on the screen
var previous = "";     // first number
var operator = "";     // + − × ÷
var resetNext = false; // true when next digit should start a new number

function updateScreen() {
  display.textContent = current;
  if (previous !== "" && operator !== "") {
    prevText.textContent = previous + " " + operator;
  } else {
    prevText.textContent = "";
  }
}

function addNumber(n) {
  if (resetNext) {
    current = "0";
    resetNext = false;
  }
  if (n === "." && current.includes(".")) return;
  if (current.length >= 12) return;

  if (current === "0" && n !== ".") {
    current = n;
  } else {
    current = current + n;
  }
  updateScreen();
}

function chooseOperator(op) {
  if (isNaN(parseFloat(current))) current = "0";

  // if user already typed a second number, calculate it first (like 2 + 3 + ...)
  if (operator !== "" && !resetNext) {
    calculate();
  }
  previous = current;
  operator = op;
  resetNext = true;
  updateScreen();
}

function calculate() {
  if (operator === "") return;

  var a = parseFloat(previous);
  var b = parseFloat(current);
  var result;

  if (operator === "+") result = a + b;
  if (operator === "−") result = a - b;
  if (operator === "×") result = a * b;
  if (operator === "÷") {
    if (b === 0) {
      current = "Can't divide by 0";
      previous = "";
      operator = "";
      resetNext = true;
      updateScreen();
      return;
    }
    result = a / b;
  }

  var shownOperator = operator;
  current = String(Math.round(result * 10000000000) / 10000000000);
  previous = "";
  operator = "";
  resetNext = true;
  updateScreen();
  prevText.textContent = a + " " + shownOperator + " " + b + " =";
}

function clearAll() {
  current = "0";
  previous = "";
  operator = "";
  resetNext = false;
  updateScreen();
}

function deleteLast() {
  if (resetNext) return;
  current = current.slice(0, -1);
  if (current === "" || current === "-") current = "0";
  updateScreen();
}

function percent() {
  var n = parseFloat(current);
  if (isNaN(n)) return;
  current = String(n / 100);
  updateScreen();
}

// button clicks
document.querySelector(".keys").addEventListener("click", function (e) {
  var btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num !== undefined) addNumber(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "equals") calculate();
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "delete") deleteLast();
  else if (btn.dataset.action === "percent") percent();
});

// keyboard support
document.addEventListener("keydown", function (e) {
  var k = e.key;
  if ((k >= "0" && k <= "9") || k === ".") addNumber(k);
  else if (k === "+") chooseOperator("+");
  else if (k === "-") chooseOperator("−");
  else if (k === "*") chooseOperator("×");
  else if (k === "/") { e.preventDefault(); chooseOperator("÷"); }
  else if (k === "Enter" || k === "=") { e.preventDefault(); calculate(); }
  else if (k === "Backspace") deleteLast();
  else if (k === "Escape") clearAll();
});
