// ==========================================
// FUNGSI LOGIN DASAR
// ==========================================
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}
function loginUser() {
  const user = document.getElementById("user-user").value;
  const pass = document.getElementById("user-pass").value;
  if (user === "user" && pass === "user123") {
    window.location.href = "dashboard.html";
  } else {
    alert("Username atau password salah!");
  }
}

// ==========================================
// FUNGSI KONTROL TIMER & REKOR RIWAYAT RIIL
// ==========================================
let globalTimerInterval;

if ("Notification" in window) {
  if (
    Notification.permission !== "granted" &&
    Notification.permission !== "denied"
  ) {
    Notification.requestPermission();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkActiveTimer();
});

// Memulai Timer
window.startPumpTimer = function (durationMins, action, reason) {
  const startTime = Date.now();
  const endTime = startTime + durationMins * 60000;

  localStorage.setItem("pumpTimerStart", startTime.toString());
  localStorage.setItem("pumpTimerEnd", endTime.toString());
  localStorage.setItem("pumpTimerAction", action);
  localStorage.setItem("pumpTimerReason", reason);
  localStorage.setItem("pumpTimerDuration", durationMins.toString());

  checkActiveTimer();
};

function checkActiveTimer() {
  const endTime = localStorage.getItem("pumpTimerEnd");
  if (!endTime) return;

  const targetTime = parseInt(endTime);
  if (Date.now() >= targetTime) {
    stopActiveTimer(true); // Otomatis selesai jika waktu habis
    return;
  }

  let widget = document.getElementById("floating-timer-widget");
  if (!widget) {
    widget = document.createElement("div");
    widget.id = "floating-timer-widget";
    widget.className =
      "fixed top-4 right-4 bg-brand-dark text-white px-4 py-2 rounded-full shadow-2xl flex items-center space-x-3 z-[9999] border-2 border-brand-green animate-pulse";
    widget.innerHTML = `<i class="fa-solid fa-stopwatch"></i> <span id="floating-time" class="font-bold font-mono">00:00</span>`;
    document.body.appendChild(widget);
  }

  if (globalTimerInterval) clearInterval(globalTimerInterval);

  globalTimerInterval = setInterval(() => {
    const now = Date.now();
    const distance = targetTime - now;

    if (distance <= 0) {
      stopActiveTimer(true); // Selesai alami
    } else {
      let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let s = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById("floating-time").innerText =
        `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
  }, 1000);
}

// Menghentikan Timer & Menghitung Durasi Riil
window.stopActiveTimer = function (autoFinished = false) {
  if (globalTimerInterval) clearInterval(globalTimerInterval);

  const startTime = localStorage.getItem("pumpTimerStart");
  const action = localStorage.getItem("pumpTimerAction");
  const reason = localStorage.getItem("pumpTimerReason");
  const duration = localStorage.getItem("pumpTimerDuration");

  // Jika ada timer aktif, catat ke riwayat
  if (startTime && action) {
    let durationStr = "";
    if (autoFinished) {
      durationStr = `${duration} menit`;
    } else {
      // Hitung selisih detik riil
      const elapsedSec = Math.floor((Date.now() - parseInt(startTime)) / 1000);
      if (elapsedSec < 60) {
        durationStr = `${elapsedSec} detik`;
      } else {
        const mins = Math.floor(elapsedSec / 60);
        const secs = elapsedSec % 60;
        durationStr = `${mins} mnt ${secs} dtk`;
      }
    }
    // Catat ke log local storage
    addHistoryToStorage(action, durationStr, reason);
  }

  // Bersihkan Memory
  localStorage.removeItem("pumpTimerStart");
  localStorage.removeItem("pumpTimerEnd");
  localStorage.removeItem("pumpTimerAction");
  localStorage.removeItem("pumpTimerReason");
  localStorage.removeItem("pumpTimerDuration");

  const widget = document.getElementById("floating-timer-widget");
  if (widget) widget.remove();

  // Segarkan UI jika berada di halaman kontrol manual
  if (typeof refreshControlUI === "function") {
    refreshControlUI();
  }

  if (autoFinished) {
    showNotification();
  }
};

// Fungsi mencatat data ke Local Storage agar tidak hilang saat refresh
function addHistoryToStorage(action, durationStr, reason) {
  let history = JSON.parse(localStorage.getItem("manualHistory")) || [
    {
      waktu: "22 Mei 2026 14:10:32",
      aksi: "Pompa ON",
      durasi: "10 menit",
      alasan: "Kalibrasi Debit Air",
    },
    {
      waktu: "21 Mei 2026 16:22:18",
      aksi: "Pompa OFF",
      durasi: "5 menit",
      alasan: "Pemupukan",
    },
    {
      waktu: "20 Mei 2026 09:05:44",
      aksi: "Pompa ON",
      durasi: "15 menit",
      alasan: "Siram Lahan",
    },
  ];

  const now = new Date();
  const d = now.getDate().toString().padStart(2, "0");
  const m = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ][now.getMonth()];
  const y = now.getFullYear();
  const hr = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  const sec = now.getSeconds().toString().padStart(2, "0");
  const timeStr = `${d} ${m} ${y} ${hr}:${min}:${sec}`;

  history.unshift({
    waktu: timeStr,
    aksi: action,
    durasi: durationStr,
    alasan: reason,
  });

  // Batasi histori maksimal 15 baris agar rapi
  if (history.length > 15) history.pop();

  localStorage.setItem("manualHistory", JSON.stringify(history));
}

function showNotification() {
  const title = "Waktu Override Habis!";
  const options = {
    body: "Kontrol manual selesai. Sistem pompa irigasi kini kembali ke Mode Otomatis.",
    icon: "https://cdn-icons-png.flaticon.com/512/1141/1141885.png",
    vibrate: [200, 100, 200],
  };
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, options);
  } else {
    alert(title + "\n\n" + options.body);
  }
}
