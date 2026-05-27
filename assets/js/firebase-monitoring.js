import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCns7vvtEB5unLIPlfAWd_chUUeRWriAY0",
  authDomain: "irigasi-tomat-web.firebaseapp.com",
  databaseURL:
    "https://irigasi-tomat-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "irigasi-tomat-web",
  storageBucket: "irigasi-tomat-web.firebasestorage.app",
  messagingSenderId: "164253528951",
  appId: "1:164253528951:web:ae12dbe0a44e335a9aa772",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// REVISI LABEL GRAFIK
const ctxZona = document.getElementById("chartKelembapanZona");
let chartZona;
if (ctxZona) {
  chartZona = new Chart(ctxZona.getContext("2d"), {
    type: "line",
    data: {
      labels: [
        "12:00",
        "15:00",
        "18:00",
        "21:00",
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
      ],
      datasets: [
        {
          label: "Kelembapan Zona 1",
          data: [],
          borderColor: "#287930",
          tension: 0.4,
        },
        {
          label: "Kelembapan Zona 2",
          data: [],
          borderColor: "#fb923c",
          tension: 0.4,
        },
        {
          label: "Kelembapan Zona 3",
          data: [],
          borderColor: "#3b82f6",
          tension: 0.4,
        },
        {
          label: "Batas Basah (80%)",
          data: [80, 80, 80, 80, 80, 80, 80, 80, 80],
          borderColor: "#287930",
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1,
        },
        {
          label: "Batas Kering (45%)",
          data: [45, 45, 45, 45, 45, 45, 45, 45, 45],
          borderColor: "#ef4444",
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 100 } },
    },
  });
}

const ctxSensor = document.getElementById("chartSensor");
let chartSensor;
if (ctxSensor) {
  chartSensor = new Chart(ctxSensor.getContext("2d"), {
    type: "line",
    data: {
      labels: [
        "12:00",
        "15:00",
        "18:00",
        "21:00",
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
      ],
      datasets: [
        {
          label: "Sensor 1",
          data: [],
          borderColor: "#287930",
          tension: 0.4,
          borderWidth: 1.5,
        },
        {
          label: "Sensor 2",
          data: [],
          borderColor: "#86efac",
          tension: 0.4,
          borderWidth: 1.5,
        },
        {
          label: "Sensor 3",
          data: [],
          borderColor: "#fb923c",
          tension: 0.4,
          borderWidth: 1.5,
        },
        {
          label: "Sensor 4",
          data: [],
          borderColor: "#3b82f6",
          tension: 0.4,
          borderWidth: 1.5,
        },
        {
          label: "Sensor 5",
          data: [],
          borderColor: "#f472b6",
          tension: 0.4,
          borderWidth: 1.5,
        },
        {
          label: "Sensor 6",
          data: [],
          borderColor: "#2dd4bf",
          tension: 0.4,
          borderWidth: 1.5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 100 } },
    },
  });
}

const ctxDebit = document.getElementById("chartDebitAir");
let chartDebit;
if (ctxDebit) {
  chartDebit = new Chart(ctxDebit.getContext("2d"), {
    type: "line",
    data: {
      labels: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
        "24:00",
      ],
      datasets: [
        {
          label: "Volume Debit (L)",
          data: [],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 100 } },
    },
  });
}

// PENANGANAN ERROR DATABASE
const fbStatus = document.getElementById("fb-status");

onValue(
  ref(db, "grafik"),
  (snapshot) => {
    const data = snapshot.val();
    if (data) {
      if (data.zona_24j && chartZona) {
        chartZona.data.datasets[0].data = data.zona_24j.z1;
        chartZona.data.datasets[1].data = data.zona_24j.z2;
        chartZona.data.datasets[2].data = data.zona_24j.z3;
        chartZona.update();
      }
      if (data.sensor_24j && chartSensor) {
        chartSensor.data.datasets[0].data = data.sensor_24j.s1;
        chartSensor.data.datasets[1].data = data.sensor_24j.s2;
        chartSensor.data.datasets[2].data = data.sensor_24j.s3;
        chartSensor.data.datasets[3].data = data.sensor_24j.s4;
        chartSensor.data.datasets[4].data = data.sensor_24j.s5;
        chartSensor.data.datasets[5].data = data.sensor_24j.s6;
        chartSensor.update();
      }
      if (data.debit_24j && chartDebit) {
        chartDebit.data.datasets[0].data = data.debit_24j;
        chartDebit.update();
      }
    } else {
      if (fbStatus) {
        fbStatus.innerHTML =
          '<i class="fa-solid fa-triangle-exclamation mr-1"></i> Data Kosong di Firebase!';
        fbStatus.className =
          "text-[10px] md:text-xs text-red-500 mt-1 font-semibold";
      }
    }
  },
  (error) => {
    if (fbStatus) {
      fbStatus.innerHTML = `<i class="fa-solid fa-xmark mr-1"></i> Akses Ditolak: ${error.message}`;
      fbStatus.className =
        "text-[10px] md:text-xs text-red-500 mt-1 font-semibold";
    }
  },
);
