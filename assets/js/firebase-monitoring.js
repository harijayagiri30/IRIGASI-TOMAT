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

window.lastFirebasePumpStatus = "OFF";

window.updatePumpCardUI = function () {
  const valPompa = document.getElementById("val-pompa");
  if (!valPompa) return;

  let statusPompa = window.lastFirebasePumpStatus;

  // Cek Intervensi Override Lokal
  const activeTimer = localStorage.getItem("pumpTimerEnd");
  const activeAction = localStorage.getItem("pumpTimerAction");

  if (activeTimer && parseInt(activeTimer) > Date.now() && activeAction) {
    statusPompa = activeAction.replace("Pompa ", "");
  }

  valPompa.innerText = statusPompa;
  valPompa.className =
    statusPompa === "ON"
      ? "text-base font-bold text-brand-green"
      : "text-base font-bold text-red-500";
};

// ... (Abaikan konfigurasi Chart.js yang sama seperti kode sebelumnya, salin utuh jika Anda mau, tapi fokus utama di fungsi onValue) ...

// Ini blok onValue Monitoring
onValue(ref(db, "monitoring"), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const fbStatus = document.getElementById("fb-status");
    if (fbStatus) {
      fbStatus.innerHTML =
        '<i class="fa-solid fa-check-circle mr-1"></i> Firebase Terhubung';
      fbStatus.className =
        "text-[10px] md:text-xs text-brand-green mt-1 font-semibold";
    }

    if (data.zona) {
      const cz1 = document.getElementById("val-z1");
      if (cz1) {
        cz1.innerText = data.zona.z1.rata_rata + "%";
        document.getElementById("stat-z1").innerText = data.zona.z1.status;
      }
      const cz2 = document.getElementById("val-z2");
      if (cz2) {
        cz2.innerText = data.zona.z2.rata_rata + "%";
        document.getElementById("stat-z2").innerText = data.zona.z2.status;
      }
      const cz3 = document.getElementById("val-z3");
      if (cz3) {
        cz3.innerText = data.zona.z3.rata_rata + "%";
        document.getElementById("stat-z3").innerText = data.zona.z3.status;
      }
    }

    if (data.sensor) {
      const s1 = document.getElementById("val-s1");
      if (s1) s1.innerText = data.sensor.s1 + "%";
      const s2 = document.getElementById("val-s2");
      if (s2) s2.innerText = data.sensor.s2 + "%";
      const s3 = document.getElementById("val-s3");
      if (s3) s3.innerText = data.sensor.s3 + "%";
      const s4 = document.getElementById("val-s4");
      if (s4) s4.innerText = data.sensor.s4 + "%";
      const s5 = document.getElementById("val-s5");
      if (s5) s5.innerText = data.sensor.s5 + "%";
      const s6 = document.getElementById("val-s6");
      if (s6) s6.innerText = data.sensor.s6 + "%";
      document.querySelectorAll('[id^="val-s"]').forEach((el) => {
        el.classList.remove("text-gray-400");
        el.classList.add("text-brand-dark");
      });

      const sensors = {
        "Sensor 1": data.sensor.s1,
        "Sensor 2": data.sensor.s2,
        "Sensor 3": data.sensor.s3,
        "Sensor 4": data.sensor.s4,
        "Sensor 5": data.sensor.s5,
        "Sensor 6": data.sensor.s6,
      };
      let lowestSensor = "Sensor 1";
      let lowestValue = sensors["Sensor 1"];
      for (const [key, value] of Object.entries(sensors)) {
        if (value < lowestValue) {
          lowestValue = value;
          lowestSensor = key;
        }
      }
      const terendah = document.getElementById("val-terendah");
      if (terendah) terendah.innerText = `${lowestSensor} (${lowestValue}%)`;
    }

    if (data.zona) {
      const zones = {
        "Zona 1": data.zona.z1.rata_rata,
        "Zona 2": data.zona.z2.rata_rata,
        "Zona 3": data.zona.z3.rata_rata,
      };
      let lowestZone = "Zona 1";
      let lowestZoneVal = zones["Zona 1"];
      for (const [key, value] of Object.entries(zones)) {
        if (value < lowestZoneVal) {
          lowestZoneVal = value;
          lowestZone = key;
        }
      }
      const terkering = document.getElementById("val-terkering");
      if (terkering) terkering.innerText = `${lowestZone} (${lowestZoneVal}%)`;
    }

    // PENARIKAN STATUS POMPA (MENGGUNAKAN UPDATEPUMPCARDUI)
    if (data.status_sistem) {
      window.lastFirebasePumpStatus = data.status_sistem.pompa;
      window.updatePumpCardUI();
    }
  }
});
