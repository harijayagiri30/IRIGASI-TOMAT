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

let globalTimerInterval;

document.addEventListener("DOMContentLoaded", () => {
  checkActiveTimer();
  loadActiveProfileName();
  fetchWeatherData(); // Memanggil API Cuaca secara otomatis
});

function loadActiveProfileName() {
  const profileEl = document.getElementById("val-active-profile");
  if (!profileEl) return;

  const activeProfile = localStorage.getItem("activeProfile") || "auto";
  let profileName = "Default Sistem";

  if (activeProfile !== "auto") {
    const slotData = localStorage.getItem(activeProfile);
    if (slotData) profileName = JSON.parse(slotData).name;
  }
  profileEl.innerText = profileName;
}

// === PENGAMBILAN API CUACA OPEN-METEO ===
async function fetchWeatherData() {
  const teksCuaca = document.getElementById("teks-cuaca");
  const iconCuaca = document.getElementById("icon-cuaca");
  const teksPeluang = document.getElementById("teks-peluang");

  if (!teksCuaca || !teksPeluang) return;

  const lat = -7.0851452;
  const lon = 110.3616954;
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code&daily=precipitation_probability_max&timezone=Asia%2FJakarta`;

  try {
    teksCuaca.innerText = "Loading...";
    teksPeluang.innerText = "...";

    const response = await fetch(apiUrl);
    const data = await response.json();

    const weatherCode = data.current.weather_code;
    const probHujan = data.daily.precipitation_probability_max[0];

    let cuacaStr = "Tidak Diketahui";
    let iconHtml = "";

    if (weatherCode === 0) {
      cuacaStr = "Cerah";
      iconHtml = '<i class="fa-solid fa-sun text-yellow-400"></i>';
    } else if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
      cuacaStr = "Berawan";
      iconHtml = '<i class="fa-solid fa-cloud text-gray-400"></i>';
    } else if (weatherCode >= 45 && weatherCode <= 48) {
      cuacaStr = "Kabut";
      iconHtml = '<i class="fa-solid fa-smog text-gray-400"></i>';
    } else if (weatherCode >= 51 && weatherCode <= 67) {
      cuacaStr = "Hujan Ringan";
      iconHtml = '<i class="fa-solid fa-cloud-rain text-blue-400"></i>';
    } else if (weatherCode >= 80 && weatherCode <= 82) {
      cuacaStr = "Hujan Lebat";
      iconHtml =
        '<i class="fa-solid fa-cloud-showers-heavy text-blue-600"></i>';
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      cuacaStr = "Badai Petir";
      iconHtml = '<i class="fa-solid fa-cloud-bolt text-gray-600"></i>';
    }

    teksCuaca.innerText = cuacaStr;
    teksCuaca.title = cuacaStr;
    if (iconCuaca) iconCuaca.innerHTML = iconHtml;
    teksPeluang.innerText = probHujan + "%";
  } catch (error) {
    console.error("Gagal cuaca:", error);
    teksCuaca.innerText = "Error API";
    teksPeluang.innerText = "Err";
  }
}

// === LOGIKA TIMER ===
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
    stopActiveTimer(true);
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
      stopActiveTimer(true);
    } else {
      let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let s = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById("floating-time").innerText =
        `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
  }, 1000);
}

window.stopActiveTimer = function (autoFinished = false) {
  if (globalTimerInterval) clearInterval(globalTimerInterval);
  const startTime = localStorage.getItem("pumpTimerStart");
  const action = localStorage.getItem("pumpTimerAction");
  const reason = localStorage.getItem("pumpTimerReason");
  const duration = localStorage.getItem("pumpTimerDuration");

  if (startTime && action) {
    let durationStr = "";
    if (autoFinished) {
      durationStr = `${duration} menit`;
    } else {
      const elapsedSec = Math.floor((Date.now() - parseInt(startTime)) / 1000);
      if (elapsedSec < 60) {
        durationStr = `${elapsedSec} detik`;
      } else {
        const mins = Math.floor(elapsedSec / 60);
        const secs = elapsedSec % 60;
        durationStr = `${mins} mnt ${secs} dtk`;
      }
    }
    addHistoryToStorage(action, durationStr, reason);
  }

  localStorage.removeItem("pumpTimerStart");
  localStorage.removeItem("pumpTimerEnd");
  localStorage.removeItem("pumpTimerAction");
  localStorage.removeItem("pumpTimerReason");
  localStorage.removeItem("pumpTimerDuration");
  const widget = document.getElementById("floating-timer-widget");
  if (widget) widget.remove();
  if (typeof refreshControlUI === "function") refreshControlUI();
};

function addHistoryToStorage(action, durationStr, reason) {
  let history = JSON.parse(localStorage.getItem("manualHistory")) || [];
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
  if (history.length > 15) history.pop();
  localStorage.setItem("manualHistory", JSON.stringify(history));
}
// --- KODE PEMBUKA DROPDOWN (DIKEMBALIKAN) ---
window.toggleDropdown = function () {
  const drop = document.getElementById("userDropdown");
  if (drop) drop.classList.toggle("hidden");
};

window.addEventListener("click", function (e) {
  const btn = document.querySelector('button[onclick="toggleDropdown()"]');
  const drop = document.getElementById("userDropdown");
  if (btn && drop && !btn.contains(e.target) && !drop.contains(e.target)) {
    drop.classList.add("hidden");
  }
});
