import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

// KONFIGURASI FIREBASE
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

// SINKRONISASI STATUS POMPA DARI FIREBASE KE KONTROL MANUAL & SISTEM
onValue(ref(db, "monitoring/status_sistem"), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    // 1. Ambil status mentah dari Firebase
    let statusPompaFinal = data.pompa;

    // 2. CEK INTERVENSI MANUAL (Apakah ada Timer Kontrol Manual yang jalan?)
    const activeTimer = localStorage.getItem("pumpTimerEnd");
    const activeAction = localStorage.getItem("pumpTimerAction");

    // Jika ada timer manual yang aktif, timpa status Firebase dengan status manual
    if (activeTimer && parseInt(activeTimer) > Date.now() && activeAction) {
      statusPompaFinal = activeAction.replace("Pompa ", ""); // Hasilnya: "ON" atau "OFF"
    }

    // 3. UPDATE UI DI HALAMAN SISTEM (Sudah tersinkronisasi)
    const sistemValPompa = document.getElementById("sistem-val-pompa");
    const sistemIconPompa = document.getElementById("sistem-icon-pompa");
    if (sistemValPompa) {
      sistemValPompa.innerText = statusPompaFinal;
      if (statusPompaFinal === "ON") {
        sistemValPompa.className = "text-[10px] text-brand-green font-bold";
        if (sistemIconPompa)
          sistemIconPompa.className = "text-brand-green text-2xl mb-1";
      } else {
        sistemValPompa.className = "text-[10px] text-red-500 font-bold";
        if (sistemIconPompa)
          sistemIconPompa.className = "text-red-500 text-2xl mb-1";
      }
    }

    // 4. UPDATE UI DI HALAMAN KONTROL MANUAL
    const kontrolValPompa = document.getElementById("teks-status-pompa");
    if (kontrolValPompa) {
      // Hanya update jika tidak ada timer lokal yang berjalan
      if (!activeTimer || parseInt(activeTimer) <= Date.now()) {
        kontrolValPompa.innerText = `POMPA ${statusPompaFinal}`;
        kontrolValPompa.className =
          statusPompaFinal === "ON"
            ? "text-3xl font-bold text-brand-green mb-1"
            : "text-3xl font-bold text-red-500 mb-1";
      }
    }
  }
});
