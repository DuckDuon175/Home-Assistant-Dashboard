// Widget Bed Light
const widget = document.querySelector(".light-icon");
const icon = document.querySelector(".light-icon");
const status = document.querySelector(".status");
const bedLightSwitch = document.querySelector("#bed-light-switch");
let isOn = false;

status.addEventListener("click", () => {
  isOn = !isOn;
  if (isOn) {
    icon.classList.add("active");
  } else {
    icon.classList.remove("active");
  }
});

//Get the current state of the switch
bedLightSwitch.addEventListener("change", () => { 
  console.log(bedLightSwitch.checked);
});

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

//Temperature Gauge
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

//Water Level Bar
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

//TDS bar
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

//pH bar
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

//Conductivity bar
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

const onChartLoad = function () {
  const chart = this,
      series = chart.series[0];

  setInterval(function () {
      const x = (new Date()).getTime(),
          y = Math.random();

      series.addPoint([x, y], true, true);
  }, 5000);
};

// Create the initial data
const data = (function () {
  const data = [];
  const time = new Date().getTime();

  for (let i = -19; i <= 0; i += 1) {
      data.push({
          x: time + i * 1000,
          y: Math.random()
      });
  }
  return data;
}());

// Plugin to add a pulsating marker on add point
Highcharts.addEvent(Highcharts.Series, 'addPoint', e => {
  const point = e.point,
      series = e.target;

  if (!series.pulse) {
      series.pulse = series.chart.renderer.circle()
          .add(series.markerGroup);
  }

  setTimeout(() => {
      series.pulse
          .attr({
              x: series.xAxis.toPixels(point.x, true),
              y: series.yAxis.toPixels(point.y, true),
              r: series.options.marker.radius,
              opacity: 1,
              fill: series.color
          })
          .animate({
              r: 20,
              opacity: 0
          }, {
              duration: 1000,
          });
  }, 1);
});


Highcharts.chart('chart-container', {
  chart: {
      type: 'spline',
      events: {
          load: onChartLoad
      }
  },

  time: {
      useUTC: false
  },

  title: {
      text: 'Live random data',
       style: {
          color: '#FFFFFF',
       }
  },

  accessibility: {
      announceNewData: {
          enabled: true,
          minAnnounceInterval: 15000,
          announcementFormatter: function (allSeries, newSeries, newPoint) {
              if (newPoint) {
                  return 'New point added. Value: ' + newPoint.y;
              }
              return false;
          }
      }
  },

  xAxis: {
      type: 'datetime',
      tickPixelInterval: 150,
      maxPadding: 0.1,
      lineColor: '#FFFFFF',
      tickColor: '#FFFFFF',
      labels: {
          style: {
              color: '#FFFFFF',
          }
      }
  },

  yAxis: {
      title: {
          text: 'Value',
          style: {
            color: '#FFFFFF',
         }
      },
      lineColor: '#FFFFFF',
      tickColor: '#FFFFFF',
      labels: {
          style: {
              color: '#FFFFFF',
          }
      },
      plotLines: [
          {
              value: 0,
              width: 1,
              color: '#FFFFFF',
          }
      ]
  },

  tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
  },

  legend: {
      enabled: false
  },

  exporting: {
      enabled: false
  },

  series: [
      {
          name: 'Random data',
          lineWidth: 2,
          color: '#00FFFF',
          data
      }
  ]
});