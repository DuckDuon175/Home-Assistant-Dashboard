// Get Data from Era Widget
const eraWidget = new EraWidget();
let configTemp, configWater, configTDS, configPH, configConductivity;
let configStatusFan, configStatusHeater, configStatusLight, configStatusFeeder, configStatusPump, configStatusFilter, configStatusAuto, configStatusOTA;
let StatusPump = 0, StatusLight = 1, StatusFan = 0, StatusFeeder = 0, StatusHeater = 0, StatusFilter = 0, StatusAuto = 0, StatusOTA = 0;
let TemperatureValue = 50, WaterLevelValue = 2, TDSValue = 3, PHValue = 4, ConductivityValue = 5;

eraWidget.init({
  onConfiguration: (configuration) => {
    configTemp = configuration.realtime_configs[0];
    configTDS = configuration.realtime_configs[1];
    configPH = configuration.realtime_configs[2];
    configWater = configuration.realtime_configs[3];
    configConductivity = configuration.realtime_configs[4];
    configStatusFan = configuration.realtime_configs[5];
    configStatusHeater = configuration.realtime_configs[6];
    configStatusLight = configuration.realtime_configs[7];
    configStatusFeeder = configuration.realtime_configs[8];
    configStatusPump = configuration.realtime_configs[9];
    configStatusFilter = configuration.realtime_configs[10];
    configStatusAuto = configuration.realtime_configs[11];
    configStatusOTA = configuration.realtime_configs[12];
  },
  onValues: (values) => {
    // Values
    TemperatureValue = values[configTemp.id].value;
    WaterLevelValue = values[configWater.id].value;
    TDSValue = values[configTDS.id].value;
    PHValue = values[configPH.id].value;
    ConductivityValue = values[configConductivity.id].value;
    // Status
    StatusFan = values[configStatusFan.id].value;
    StatusHeater = values[configStatusHeater.id].value;
    StatusLight = values[configStatusLight.id].value;
    StatusFeeder = values[configStatusFeeder.id].value;
    StatusPump = values[configStatusPump.id].value;
    StatusFilter = values[configStatusFilter.id].value;
    StatusAuto = values[configStatusAuto.id].value;
    StatusOTA = values[configStatusOTA.id].value;
  },

});

// Widget Bed Light
const widget = document.querySelector(".light-icon");
const icon = document.querySelector(".light-icon");
const status = document.querySelector(".status");
const bedLightSwitch = document.querySelector("#bed-light-switch");
status.addEventListener("click", () => {
  StatusLight = !StatusLight;
  if (StatusLight) {
    icon.classList.add("active");
  } else {
    icon.classList.remove("active");
  }
});

bedLightSwitch.addEventListener("change", () => {
  console.log(bedLightSwitch.checked);
});

if (StatusLight) {
  icon.classList.add("active");
  bedLightSwitch.checked = true;
} else {
  icon.classList.remove("active");
  bedLightSwitch.checked = false;
}

// Test auto mode
// const check = document.querySelector("#check");
// check.addEventListener("click", () => {
//   StatusLight = !StatusLight;
//   console.log("Status light changed to: ", StatusLight);
// });

let isAuto = false;
const autoBtn = document.querySelector("#auto-btn");
autoBtn.addEventListener("click", () => {
  isAuto = !isAuto;
  console.log("Auto mode: ", isAuto);
  if (isAuto) {
    requestAutoUpdate();
  }
});

function requestAutoUpdate() {
  if (isAuto) {
    if (StatusLight) {
      icon.classList.add("active");
      bedLightSwitch.checked = true;
    } else {
      icon.classList.remove("active");
      bedLightSwitch.checked = false;
    }
    setTimeout(() => requestAutoUpdate());
  }
}

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
tempProgressBar.animate(TemperatureValue / 100); // Number from 0.0 to 1.0

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
waterProgressBar.animate(WaterLevelValue / 100); // Number from 0.0 to 1.0

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
tdsProgressBar.animate(TDSValue / 100); // Number from 0.0 to 1.0

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
phProgressBar.animate(PHValue / 100); // Number from 0.0 to 1.0

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
conductProgressBar.animate(ConductivityValue / 100); // Number from 0.0 to 1.0

// Khởi tạo dữ liệu ban đầu
function generateInitialData() {
  const data = [];
  const time = new Date().getTime();
  for (let i = -19; i <= 0; i += 1) {
    data.push({
      x: time + i * 1000,
      y: Math.random()
    });
  }
  return data;
}

// Hàm tạo hiệu ứng di chuyển giống Conductivity
function addConductivityEffect(series, point) {
  if (!series.pulse) {
    series.pulse = series.chart.renderer.circle()
      .attr({ r: 5, opacity: 0 })
      .add(series.markerGroup);
  }

  setTimeout(() => {
    series.pulse
      .attr({
        x: series.xAxis.toPixels(point.x, true),
        y: series.yAxis.toPixels(point.y, true),
        r: 5,
        opacity: 1,
        fill: series.color
      })
      .animate({
        r: 20,
        opacity: 0
      }, { duration: 1000 });
  }, 1);
}
function onChartLoad() {
  const chart = this,
    series = chart.series;

  setInterval(function () {
    const x = (new Date()).getTime();

    // Dữ liệu thực tế từ Era Widget
    let newDataPoints = [
      { seriesIndex: 0, y: TemperatureValue },  // Temperature (°C)
      { seriesIndex: 1, y: WaterLevelValue },  // Water Level (%)
      { seriesIndex: 2, y: Math.min(TDSValue, 100) },  // TDS Value (ppm) (giới hạn từ 0 - 100)
      { seriesIndex: 3, y: PHValue },  // PH Value
      { seriesIndex: 4, y: Math.min(ConductivityValue, 100) }  // Conductivity (μS/cm) (giới hạn từ 0 - 100)
    ];

    newDataPoints.forEach((dataPoint) => {
      let seriesTarget = series[dataPoint.seriesIndex];
      seriesTarget.addPoint([x, dataPoint.y], true, true);
      addConductivityEffect(seriesTarget, { x, y: dataPoint.y });
    });

  }, 1000);
}

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
    enabled: true
  },

  exporting: {
    enabled: false
  },

  series: [
    { name: 'Temperature (°C)', lineWidth: 2, color: 'red', data: generateInitialData() },
    { name: 'Water Level (%)', lineWidth: 2, color: 'blue', data: generateInitialData(), visible: false },
    { name: 'TDS Value (ppm)', lineWidth: 2, color: 'green', data: generateInitialData(), visible: false },
    { name: 'PH Value', lineWidth: 2, color: 'yellow', data: generateInitialData(), visible: false },
    { name: 'Conductivity (μS/cm)', lineWidth: 2, color: 'purple', data: generateInitialData(), visible: false }
  ]
});

const weatherContainer = document.getElementById('weather-container');
const apiKey = 'ec224bde787c4001b0281007251802'
async function weather(params) {
  try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${params}&aqi=yes`);
      if (!response.ok) {  
          throw new Error(`${response.status}`);  
      }
      return await response.json();
  } catch (error) {
      console.log("❌ Error fetching data:", error.message);
  }
}

window.addEventListener('load', async () => {
  let result = await weather("Hanoi");
  weatherContainer.innerHTML = `
    <div class="weather-icon">🌍</div>
    <p>Weather in ${result.location.name}, ${result.location.country}: </p>
    <p>🌡️ ${result.current.temp_c}°C</p>
    <p>💨 ${result.current.wind_kph} km/h</p>
  `;
});