const slider = document.querySelector(".brightness-slider");
const sliderFill = document.querySelector(".slider-fill");
const valueDisplay = document.querySelector(".widget-value");
// eraWidget.triggerAction(actionOn.action, null);
slider.addEventListener("input", function () {
  const value = parseFloat(this.value); // Ép kiểu về float
  sliderFill.style.width = value + "%";
  valueDisplay.textContent = value + "%";
  eraWidget.triggerAction(onKitchenLight.action, null, { value: value });
});

const sliderLivingRoom = document.querySelector(".brightness-sliderLivingRom");
const valueLivingRoom = document.querySelector(".widget-valueLivingRoom");
const sliderFillLivingRoom = document.querySelector(".slider-fill-livingRoom");

sliderLivingRoom.addEventListener("input", function () {
  const value = parseFloat(this.value); // Ép kiểu về float
  sliderFillLivingRoom.style.width = value + "%";
  valueLivingRoom.textContent = value + "%";
  eraWidget.triggerAction(onLivingLight.action, null, { value: value });
});

// Widget Bed Light
const widget = document.querySelector(".light-icon");
const icon = document.querySelector(".light-icon");
const status = document.querySelector(".status");
let isOn = false;

widget.addEventListener("click", () => {
  isOn = !isOn;
  if (isOn) {
    icon.classList.add("active");
    status.textContent = "ON";
    eraWidget.triggerAction(onBedLight.action, null);
  } else {
    icon.classList.remove("active");
    status.textContent = "OFF";
    eraWidget.triggerAction(offBedLight.action, null);
  }
});

status.addEventListener("click", () => {
  isOn = !isOn;
  if (isOn) {
    icon.classList.add("active");
    status.textContent = "ON";
    eraWidget.triggerAction(onBedLight.action, null);
  } else {
    icon.classList.remove("active");
    status.textContent = "OFF";
    eraWidget.triggerAction(offBedLight.action, null);
  }
});
// ============ Power Off Buttons ==============
function handlePowerOff(type) {
  if (type === "temp" || type === "both") {
    isTempActive = false;
    const gaugeTemp = document.querySelector(".temp-widget .gauge.temp.neon");
    gaugeTemp.style.setProperty("--value", 0);
    gaugeTemp.querySelector(".value").textContent = "OFF";
    updateChart(0, NaN);
  }

  if (type === "humidifier" || type === "both") {
    isHumidActive = false;
    const gaugeHumid = document.querySelector(
      ".humidifier-widget .gauge.humidifier.neon"
    );
    gaugeHumid.style.setProperty("--value", 0);
    gaugeHumid.querySelector(".value").textContent = "OFF";
    updateChart(NaN, 0);
  }
}

// Gán sự kiện cho nút tắt
document.querySelectorAll(".controls button:last-child").forEach((btn) => {
  btn.addEventListener("click", function () {
    const isTemp = this.closest(".temp-widget");
    handlePowerOff(isTemp ? "temp" : "humidifier");
  });
});

// ============ Active Buttons ==============
function handleActive(type) {
  if (type === "temp" || type === "both") {
    isTempActive = true;
    if (lastTempValue !== null) {
      updateTempGauge(lastTempValue);
      updateChart(lastTempValue, NaN);
    }
  }

  if (type === "humidifier" || type === "both") {
    isHumidActive = true;
    if (lastHumidValue !== null) {
      updateGauge(lastHumidValue);
      updateChart(NaN, lastHumidValue);
    }
  }
}
document.querySelectorAll(".controls .active").forEach((btn) => {
  btn.addEventListener("click", function () {
    const isTemp = this.closest(".temp-widget");
    handleActive(isTemp ? "temp" : "humidifier");
  });
});

function updateTempGauge(newVal) {
  const gauge = document.querySelector(".temp-widget .gauge.temp.neon");
  gauge.style.setProperty("--value", newVal);
  gauge.querySelector(".value").textContent = newVal + "°C";
}

function updateGauge(newVal) {
  const gauge = document.querySelector(
    ".humidifier-widget .gauge.humidifier.neon"
  );
  gauge.style.setProperty("--value", newVal);
  gauge.querySelector(".value").textContent = newVal + "%";
}

//============Air Conditioner Widget==============
document.addEventListener("DOMContentLoaded", () => {
  const temperatureValue = document.querySelector(".temperature-value");
  const gaugeFill = document.querySelector(".gauge-fill");
  const gaugeDot = document.querySelector(".gauge-dot");
  const decreaseButton = document.querySelector(".temp-button.decrease");
  const increaseButton = document.querySelector(".temp-button.increase");

  let temperature = 15;

  const updateDisplay = (temp) => {
    const minTemp = 14;
    const maxTemp = 30;
    const percentage = (temp - minTemp) / (maxTemp - minTemp);
    const rotation = percentage * 360;

    temperatureValue.textContent = temp;
    gaugeFill.style.setProperty("--fill-percentage", `${rotation}deg`); // Chỉ cập nhật fill
    gaugeDot.style.setProperty("--rotation", `${rotation}deg`); // Xoay dot
  };

  // Temperature adjustment function
  const adjustTemperature = (increment) => {
    const newTemp = temperature + increment;
    if (newTemp >= 14 && newTemp <= 30) {
      temperature = newTemp;
      updateDisplay(temperature);
      eraWidget.triggerAction(onAirConditioner.action, null, {
        value: temperature,
      });
    }
  };

  // Event listeners for temperature buttons
  decreaseButton.addEventListener("click", () => adjustTemperature(-1));
  increaseButton.addEventListener("click", () => adjustTemperature(1));
  // Initial display update
  updateDisplay(temperature);
});
//===========Realtime Chart===========
let myChart; // Biến lưu trữ đối tượng chart
let chartData = []; // Mảng lưu trữ dữ liệu theo thời gian
const maxDataPoints = 20;
const maxLiveDataPoints = 30; // 60 điểm = 1 phút nếu cập nhật mỗi giây
let allChartData = []; // Lưu toàn bộ dữ liệu
let currentTimeRange = 0; // 0 = live
// Hàm khởi tạo chart
function initChart() {
  const ctx = document.getElementById("dataChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Humidity",
          data: [],
          borderColor: "#FF5500",
          backgroundColor: "rgba(255,85,0,0.1)",
          tension: 0.4,
          borderWidth: 2,
          spanGaps: true, // Bỏ qua khoảng trống do NaN
        },
        {
          label: "Temp",
          data: [],
          borderColor: "#2196F3",
          backgroundColor: "rgba(33,150,243,0.1)",
          tension: 0.4,
          borderWidth: 2,
          spanGaps: true, // Bỏ qua khoảng trống do NaN
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#fff",
            size: 12,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255,255,255,0.1)",
          },
          ticks: {
            color: "#fff",
            size: 10,
          },
        },
        y: {
          grid: {
            color: "rgba(255,255,255,0.1)",
          },
          ticks: {
            color: "#fff",
            font: {
              size: 11, // Tăng nhẹ kích thước chữ
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            },
          },
        },
      },
    },
  });

  // Đặt kích thước lớn hơn cho chart khi khởi động
  const chartContainer = document.getElementById("chartContainer");
}

// Hàm cập nhật dữ liệu chart
function updateChart(humidifierVal, tempVal) {
  const now = new Date();
  const timestamp = now.getTime();

  const timeLabel = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

  // Thay thế null bằng NaN
  const newData = {
    time: timeLabel,
    humidifier: typeof humidifierVal === "number" ? humidifierVal : NaN,
    temp: typeof tempVal === "number" ? tempVal : NaN,
    timestamp: timestamp,
  };

  chartData.push(newData);
  allChartData.push(newData);

  if (chartData.length > maxDataPoints) {
    chartData.shift();
  }

  myChart.data.labels = chartData.map((item) => item.time);
  myChart.data.datasets[0].data = chartData.map((item) => item.humidifier);
  myChart.data.datasets[1].data = chartData.map((item) => item.temp);
  myChart.update();
}

// Hàm thu nhỏ chart dần dần
function resizeChart() {
  const chartContainer = document.getElementById("chartContainer");
  let width = 80; // Kích thước ban đầu
  let height = 400;

  const resizeInterval = setInterval(() => {
    if (width > 30) {
      width -= 0.5;
      height -= 2.5;
      // chartContainer.style.width = `${width}%`;
      // chartContainer.style.height = `${height}px`;
    } else {
      clearInterval(resizeInterval);
    }
  }, 1000); // Thay đổi kích thước mỗi giây
}

// Hàm reset chart
function resetChart() {
  chartData = [];
  myChart.data.labels = [];
  myChart.data.datasets[0].data = [];
  myChart.data.datasets[1].data = [];
  myChart.update();
}

// Khởi tạo chart và bắt đầu thu nhỏ
initChart();
resizeChart();

// Reset chart sau 30 phút
setTimeout(resetChart, 30 * 60 * 1000);

// ============ XỬ LÝ NÚT TIME RANGE ============
document.querySelectorAll(".time-range").forEach((button) => {
  button.addEventListener("click", function () {
    // Xóa class active của tất cả các nút
    document.querySelectorAll(".time-range").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Thêm class active cho nút được chọn
    this.classList.add("active");

    // Cập nhật time range
    const minutes = parseInt(this.dataset.minutes);
    currentTimeRange = minutes;
    // showStatsModal(minutes);
    // Nếu không phải chế độ live, dừng cập nhật realtime
    if (minutes !== 0) {
      clearInterval(intervalId);
      showStatsModal(minutes);
    } else {
      // Nếu quay lại chế độ live, khởi động lại interval
      intervalId = setInterval(() => updateRandom("both"), 1000);
    }

    refreshChartDisplay();
  });
});
// Hàm làm mới hiển thị chart
function refreshChartDisplay() {
  let filteredData = [];

  if (currentTimeRange === 0) {
    filteredData = [...allChartData];
  } else {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - currentTimeRange);
    filteredData = allChartData.filter((item) => item.timestamp > cutoffTime);
  }

  myChart.data.labels = filteredData.map((item) => item.timestamp);
  myChart.data.datasets[0].data = filteredData.map((item) => item.humidifier);
  myChart.data.datasets[1].data = filteredData.map((item) => item.temp);
  myChart.update();
}

function showStatsModal(minutes) {
  console.log("Acess to showStatsModal");
  const modal = document.getElementById("statsModal");
  const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);

  // Lọc dữ liệu
  const filteredData = allChartData.filter(
    (item) => new Date(item.timestamp) >= cutoffTime
  );

  // Tạo nội dung bảng
  const tableBody = document.getElementById("statsTableBody");
  tableBody.innerHTML = filteredData
    .map(
      (item) => `
    <tr>
      <td>${item.time}</td>
      <td>${item.humidifier}</td>
      <td>${item.temp}</td>
    </tr>
  `
    )
    .join("");

  // Hiển thị modal
  modal.style.display = "block";

  // Xử lý đóng modal
  document.querySelector(".close").onclick = () =>
    (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
}

//==============Add E-Ra Services============
const eraWidget = new EraWidget();
const temp = document.getElementById("temp-widget");
const humi = document.getElementById("humidifier-widget");
let isTempActive = true;
let isHumidActive = true;
let lastTempValue = null;
let lastHumidValue = null;
let configTemp = null,
  configHumi = null,
  onBedLight = null,
  offBedLight = null,
  onKitchenLight = null,
  onLivingLight = null,
  onAirConditioner = null;

eraWidget.init({
  onConfiguration: (configuration) => {
    configTemp = configuration.realtime_configs[0];
    configHumi = configuration.realtime_configs[1];
    onBedLight = configuration.actions[0];
    offBedLight = configuration.actions[1];
    onKitchenLight = configuration.actions[2];
    onLivingLight = configuration.actions[3];
    onAirConditioner = configuration.actions[4];
  },
  onValues: (values) => {
    if (configTemp && values[configTemp.id]) {
      const tempValue = values[configTemp.id].value;
      lastTempValue = tempValue;
      if (isTempActive) {
        updateTempGauge(tempValue);
        updateChart(tempValue, NaN);
      }
    }

    if (configHumi && values[configHumi.id]) {
      const humidValue = values[configHumi.id].value;
      lastHumidValue = humidValue;
      if (isHumidActive) {
        updateGauge(humidValue);
        updateChart(NaN, humidValue);
      }
    }
  },
});
//===========Full Screen Feature==========
// Add fullscreen button HTML to your document first
const fullscreenButton = document.createElement("button");
fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
fullscreenButton.className = "fullscreen-button";
document.body.appendChild(fullscreenButton);

// Add fullscreen functionality
let isFullscreen = false;

function toggleFullscreen() {
  if (!isFullscreen) {
    // Enter fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
    fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
  }
  isFullscreen = !isFullscreen;
}

// Event listener for fullscreen button
fullscreenButton.addEventListener("click", toggleFullscreen);

// Update button icon when fullscreen changes through other means (like Esc key)
document.addEventListener("fullscreenchange", function () {
  isFullscreen = !!document.fullscreenElement;
  fullscreenButton.innerHTML = isFullscreen
    ? '<i class="fas fa-compress"></i>'
    : '<i class="fas fa-expand"></i>';
});

// Handle fullscreen change for different browsers
document.addEventListener("webkitfullscreenchange", function () {
  isFullscreen = !!document.webkitFullscreenElement;
  fullscreenButton.innerHTML = isFullscreen
    ? '<i class="fas fa-compress"></i>'
    : '<i class="fas fa-expand"></i>';
});

document.addEventListener("mozfullscreenchange", function () {
  isFullscreen = !!document.mozFullScreenElement;
  fullscreenButton.innerHTML = isFullscreen
    ? '<i class="fas fa-compress"></i>'
    : '<i class="fas fa-expand"></i>';
});

document.addEventListener("MSFullscreenChange", function () {
  isFullscreen = !!document.msFullscreenElement;
  fullscreenButton.innerHTML = isFullscreen
    ? '<i class="fas fa-compress"></i>'
    : '<i class="fas fa-expand"></i>';
});

// Temperature
let tempProgressBar = new ProgressBar.SemiCircle("#container_temperature", {
  strokeWidth: 12,
  color: "white",
  trailColor: "rgba(255,255,255, 0.4)",
  trailWidth: 12,
  easing: "easeInOut",
  duration: 1400,
  svgStyle: { width: "100%", height: "100%" },
  text: {
    value: "",
    alignToBottom: false,
    className: "progressbar_label",
  },

  step: (state, bar) => {
    bar.path.setAttribute("stroke", state.color);
    var value = Math.round(bar.value() * 100);
    if (value === 0) {
      bar.setText("");
    } else {
      bar.setText(value);
    }

    bar.text.style.color = state.color;
  },
});
tempProgressBar.animate(0.8);

let waterProgressBar = new ProgressBar.Line("#container_waterlevel", {
  strokeWidth: 12,
  color: "white",
  trailColor: "rgba(255,255,255, 0.4)",
  trailWidth: 12,
  easing: "easeInOut",
  duration: 1400,
  svgStyle: { width: "100%", height: "100%" },
  text: {
    value: "",
    className: "water_level_label",
  },
  step: (state, bar) => {
    bar.path.setAttribute("stroke", state.color);
    var value = Math.round(bar.value() * 100);
    if (value === 0) {
      bar.setText("");
    } else {
      bar.setText(value);
    }

    bar.text.style.color = state.color;
  },
});
waterProgressBar.animate(0.5);

let tdsProgressBar = new ProgressBar.Line("#container_tds", {
  strokeWidth: 12,
  trailColor: "rgba(255,255,255, 0.4)",
  trailWidth: 12,
  easing: "easeInOut",
  duration: 1400,
  svgStyle: { width: "100%", height: "100%" },
  text: {
    value: "",
    className: "tds_label",
  },
  step: (state, bar) => {
    bar.path.setAttribute("stroke", state.color);
    var value = Math.round(bar.value() * 100);
    if (value === 0) {
      bar.setText("");
    } else {
      bar.setText(value);
    }

    bar.text.style.color = state.color;
  },
});
tdsProgressBar.animate(0.5);

let phProgressBar = new ProgressBar.Line("#container_ph", {
  strokeWidth: 12,
  trailColor: "rgba(255,255,255, 0.4)",
  trailWidth: 12,
  easing: "easeInOut",
  duration: 1400,
  svgStyle: { width: "100%", height: "100%" },
  text: {
    value: "",
    className: "ph_label",
  },
  step: (state, bar) => {
    bar.path.setAttribute("stroke", state.color);
    var value = Math.round(bar.value() * 100);
    if (value === 0) {
      bar.setText("");
    } else {
      bar.setText(value);
    }

    bar.text.style.color = state.color;
  },
});
phProgressBar.animate(0.5);

let conductProgressBar = new ProgressBar.Line("#container_conductivity", {
  strokeWidth: 12,
  trailColor: "rgba(255,255,255, 0.4)",
  trailWidth: 12,
  easing: "easeInOut",
  duration: 1400,
  svgStyle: { width: "100%", height: "100%" },
  text: {
    value: "",
    className: "conductivity_label",
  },
  step: (state, bar) => {
    bar.path.setAttribute("stroke", state.color);
    var value = Math.round(bar.value() * 100);
    if (value === 0) {
      bar.setText("");
    } else {
      bar.setText(value);
    }

    bar.text.style.color = state.color;
  },
});
conductProgressBar.animate(0.5);
