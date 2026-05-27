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

// GRAFIK KELEMBAPAN (Sesuai Gambar: Garis Hijau, Titik Aktif, Batas 80 Biru, Batas 45 Merah)
const ctxKelembapan = document.getElementById("chartKelembapan");
let chartKelembapan;
if (ctxKelembapan) {
  chartKelembapan = new Chart(ctxKelembapan.getContext("2d"), {
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
          label: "Kelembapan Bedeng",
          data: [48, 52, 60, 42, 55, 62, 50, 45, 52],
          borderColor: "#287930",
          backgroundColor: "#287930",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          fill: false,
        },
        {
          label: "Batas Basah (80%)",
          data: [80, 80, 80, 80, 80, 80, 80, 80, 80],
          borderColor: "#3b82f6",
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0,
        },
        {
          label: "Batas Kering (45%)",
          data: [45, 45, 45, 45, 45, 45, 45, 45, 45],
          borderColor: "#f87171",
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0,
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

// GRAFIK POMPA (Sumbu Y diperbaiki agar tidak muncul OFF OFF OFF)
const ctxPompa = document.getElementById("chartPompa");
let chartPompa;
if (ctxPompa) {
  chartPompa = new Chart(ctxPompa.getContext("2d"), {
    type: "line",
    data: {
      labels: ["12:00", "18:00", "00:00", "06:00", "12:00"],
      datasets: [
        {
          label: "Status Pompa",
          data: [0, 1, 0, 1, 0],
          borderColor: "#287930",
          stepped: true,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 1,
          ticks: {
            stepSize: 1,
            callback: function (val) {
              return val === 1 ? "ON" : "OFF";
            },
          },
        },
      },
    },
  });
}

window.updateChartFilter = function (filter) {
  document
    .querySelectorAll('[id^="btn-"]')
    .forEach(
      (btn) =>
        (btn.className = "px-2.5 py-1 hover:text-gray-800 transition-all"),
    );
  document.getElementById("btn-" + filter).className =
    "px-2.5 py-1 bg-white rounded text-gray-800 shadow-sm transition-all";
  if (!chartKelembapan) return;
  if (filter === "24h") {
    chartKelembapan.data.labels = [
      "12:00",
      "15:00",
      "18:00",
      "21:00",
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
    ];
  } else if (filter === "7d") {
    chartKelembapan.data.labels = [
      "Sen",
      "Sel",
      "Rab",
      "Kam",
      "Jum",
      "Sab",
      "Min",
    ];
    chartKelembapan.data.datasets[0].data = [48, 52, 60, 42, 55, 62, 50];
  } else if (filter === "30d") {
    chartKelembapan.data.labels = [
      "Minggu 1",
      "Minggu 2",
      "Minggu 3",
      "Minggu 4",
    ];
    chartKelembapan.data.datasets[0].data = [52, 48, 56, 51];
  }
  chartKelembapan.update();
};

onValue(ref(db, "monitoring"), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    if (data.kelembapan_global) {
      const kb = document.getElementById("val-kbedeng");
      if (kb) kb.innerText = data.kelembapan_global.kbedeng + "%";
      const km = document.getElementById("val-kmin");
      if (km) km.innerText = data.kelembapan_global.kmin + "%";
      const nk = document.getElementById("val-nkering");
      if (nk) nk.innerText = data.kelembapan_global.nkering + " Sensor";
    }
    if (data.status_sistem) {
      const vd = document.getElementById("val-debit");
      if (vd) vd.innerText = data.status_sistem.debit_air_liter + " L/m";
      const valPompa = document.getElementById("val-pompa");
      if (valPompa) {
        const statusPompa = data.status_sistem.pompa;
        valPompa.innerText = statusPompa;
        valPompa.className =
          statusPompa === "ON"
            ? "text-base font-bold text-brand-green"
            : "text-base font-bold text-red-500";
      }
    }
  }
});
