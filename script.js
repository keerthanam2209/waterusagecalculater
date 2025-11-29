let data = {};
let chartInstance = null;

// Load JSON data
fetch("data.json")
  .then(response => response.json())
  .then(json => {
    data = json;
    populateSelect();
  })
  .catch(error => console.error("Error loading data:", error));

function populateSelect() {
  const select = document.getElementById("itemSelect");
  if (!select) return;

  // Placeholder option
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Select an item --";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  Object.keys(data).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = data[key].name;
    select.appendChild(option);
  });
}

function showFootprint() {
  const select = document.getElementById("itemSelect");
  const result = document.getElementById("result");
  if (!select || !result) return;

  const key = select.value;
  result.innerHTML = "";

  if (!key) {
    result.innerHTML = "<p>Please select an item first.</p>";
    return;
  }

  const item = data[key];
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${item.name}</h2>
    <p><b>Total Water Footprint:</b> ${item.total} L</p>
    <p><b>Breakdown:</b> Blue: ${item.blue} L, Green: ${item.green} L, Grey: ${item.grey} L</p>
    <p><b>Tip:</b> ${item.tip}</p>
  `;

  if (item.equivalents && item.equivalents.length > 0) {
    const eqList = document.createElement("ul");
    const title = document.createElement("p");
    title.innerHTML = "<b>Equivalents:</b>";
    eqList.appendChild(title);

    item.equivalents.forEach(eq => {
      const li = document.createElement("li");
      li.textContent = eq;
      eqList.appendChild(li);
    });
    card.appendChild(eqList);
  }

  if (item.reason) {
    const reasonP = document.createElement("p");
    reasonP.innerHTML = `<b>Why so high?</b> ${item.reason}`;
    card.appendChild(reasonP);
  }

  if (item.suggestion) {
    const suggestionP = document.createElement("p");
    suggestionP.innerHTML = `<b>Suggestion:</b> ${item.suggestion}`;
    card.appendChild(suggestionP);
  }

  result.appendChild(card);

  // Update chart
  updateChart(item);
}

function updateChart(item) {
  const canvas = document.getElementById("chart");
  if (!canvas || !item) return;

  const ctx = canvas.getContext("2d");

  const chartData = {
    labels: ["Blue Water", "Green Water", "Grey Water"],
    datasets: [{
      data: [item.blue, item.green, item.grey],
      backgroundColor: ["#0077b6", "#48cae4", "#adb5bd"]
    }]
  };

  if (chartInstance) {
    chartInstance.data = chartData;
    chartInstance.update();
  } else {
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: chartData,
      options: {
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  }
}

// Dark Mode Toggle
const darkToggle = document.getElementById("darkToggle");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}

// Animated Counter
let count = 0;
function animateCounter() {
  const counter = document.getElementById("litersSaved");
  if (!counter) return;
  if (count < 1200) { // Example target value
    count += 10;
    counter.textContent = count;
    setTimeout(animateCounter, 30);
  }
}
animateCounter();
