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

onValue(ref(db, "monitoring/status_sistem"), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const realFirebasePumpStatus = data.pompa;

    // UPDATE DI HALAMAN SISTEM
    const sistemValPompa = document.getElementById("sistem-val-pompa");
    const sistemIconPompa = document.getElementById("sistem-icon-pompa");
    if (sistemValPompa) {
      sistemValPompa.innerText = realFirebasePumpStatus;
      if (realFirebasePumpStatus === "ON") {
        sistemValPompa.className = "text-[10px] text-brand-green font-bold";
        if (sistemIconPompa)
          sistemIconPompa.className = "text-brand-green text-2xl mb-1";
      } else {
        sistemValPompa.className = "text-[10px] text-red-500 font-bold";
        if (sistemIconPompa)
          sistemIconPompa.className = "text-red-500 text-2xl mb-1";
      }
    }

    // UPDATE DI HALAMAN KONTROL MANUAL (Hanya jika mode otomatis & tidak ada timer)
    const kontrolValPompa = document.getElementById("teks-status-pompa");
    if (kontrolValPompa) {
      const activeTimer = localStorage.getItem("pumpTimerEnd");
      if (!activeTimer || parseInt(activeTimer) <= Date.now()) {
        kontrolValPompa.innerText = `POMPA ${realFirebasePumpStatus}`;
        kontrolValPompa.className =
          realFirebasePumpStatus === "ON"
            ? "text-3xl font-bold text-brand-green mb-1"
            : "text-3xl font-bold text-red-500 mb-1";
      }
    }
  }
});
