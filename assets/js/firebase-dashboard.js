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
          data: [],
          borderColor: "#287930",
          tension: 0.4,
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Batas Siram (45%)",
          data: [45, 45, 45, 45, 45, 45, 45, 45, 45],
          borderColor: "#f87171",
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0,
        },
        {
          label: "Batas Stop (80%)",
          data: [80, 80, 80, 80, 80, 80, 80, 80, 80],
          borderColor: "#3b82f6",
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
          data: [],
          borderColor: "#ef4444",
          stepped: true,
          borderWidth: 2,
          pointRadius: 3,
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
    // Ideally fetch 24h data from Firebase again here
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
    chartKelembapan.data.datasets[0].data = [48, 52, 60, 42, 55, 62, 50]; // Mockup 7 days
  } else if (filter === "30d") {
    chartKelembapan.data.labels = [
      "Minggu 1",
      "Minggu 2",
      "Minggu 3",
      "Minggu 4",
    ];
    chartKelembapan.data.datasets[0].data = [52, 48, 56, 51]; // Mockup 30 days
  }
  chartKelembapan.update();
};

onValue(
  ref(db, "monitoring"),
  (snapshot) => {
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
      if (data.zona) {
        const cz1 = document.getElementById("circ-z1");
        if (cz1) {
          cz1.style.setProperty(
            "--progress",
            `${data.zona.z1.rata_rata * 3.6}deg`,
          );
          document.getElementById("circ-val-z1").innerText =
            data.zona.z1.rata_rata + "%";
        }
        const cz2 = document.getElementById("circ-z2");
        if (cz2) {
          cz2.style.setProperty(
            "--progress",
            `${data.zona.z2.rata_rata * 3.6}deg`,
          );
          document.getElementById("circ-val-z2").innerText =
            data.zona.z2.rata_rata + "%";
        }
        const cz3 = document.getElementById("circ-z3");
        if (cz3) {
          cz3.style.setProperty(
            "--progress",
            `${data.zona.z3.rata_rata * 3.6}deg`,
          );
          document.getElementById("circ-val-z3").innerText =
            data.zona.z3.rata_rata + "%";
        }
      }
    }
  },
  (error) => {
    console.error(error);
  },
);

onValue(ref(db, "grafik"), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    if (data.kbedeng_24j && chartKelembapan) {
      chartKelembapan.data.datasets[0].data = data.kbedeng_24j;
      chartKelembapan.update();
    }
    if (data.pompa_24j && chartPompa) {
      chartPompa.data.datasets[0].data = data.pompa_24j;
      chartPompa.update();
    }
  }
});
