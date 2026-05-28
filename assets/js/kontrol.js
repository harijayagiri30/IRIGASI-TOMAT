let currentMode = "otomatis";
let selectedMins = 0;
let selectedReasonText = "";
let switchTimerInterval;

// PERBAIKAN: Mengecek memori saat halaman Kontrol dimuat
window.initManualMode = function () {
  const activeTimer = localStorage.getItem("pumpTimerEnd");
  const activeAction = localStorage.getItem("pumpTimerAction");

  if (activeTimer && parseInt(activeTimer) > Date.now()) {
    // Resume mode manual jika ada timer
    forceSetMode("manual");
    const status = activeAction.replace("Pompa ", "");
    document.getElementById("teks-status-pompa").innerText = activeAction;
    document.getElementById("teks-status-pompa").className =
      status === "ON"
        ? "text-3xl font-bold text-brand-green mb-1"
        : "text-3xl font-bold text-red-500 mb-1";
    document.getElementById("teks-desc-pompa").innerText =
      `Sedang override ke ${status}`;
  } else {
    forceSetMode("otomatis");
  }
  renderHistoryTable();
};

window.refreshControlUI = function () {
  const statPompa = document.getElementById("teks-status-pompa");
  if (statPompa) {
    statPompa.innerText = `POMPA OFF`;
    statPompa.className = "text-3xl font-bold text-red-500 mb-1";
    document.getElementById("teks-desc-pompa").innerText =
      "Kontrol dikembalikan ke otomatis";
  }
  forceSetMode("otomatis");
  renderHistoryTable();
  resetSelections();
};

window.showAlertModal = function (title, message) {
  document.getElementById("alert-title").innerText = title;
  document.getElementById("alert-message").innerHTML = message;
  document.getElementById("modal-alert").classList.remove("hidden");
};

window.requestOtomatisMode = function () {
  if (currentMode === "otomatis") return;
  document.getElementById("modal-confirm-off").classList.remove("hidden");
};

window.confirmTurnOff = function (isYes) {
  document.getElementById("modal-confirm-off").classList.add("hidden");
  if (isYes) {
    if (typeof window.stopActiveTimer === "function")
      window.stopActiveTimer(false);
    forceSetMode("otomatis");
    renderHistoryTable();
  }
};

window.requestManualMode = function () {
  if (currentMode === "manual") return;
  document.getElementById("modal-switch").classList.remove("hidden");
  const btnYa = document.getElementById("btn-ya-switch");
  btnYa.disabled = true;
  btnYa.classList.add("opacity-50", "cursor-not-allowed");

  let timeLeft = 5;
  btnYa.innerText = `Ya (${timeLeft}s)`;
  switchTimerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(switchTimerInterval);
      btnYa.disabled = false;
      btnYa.classList.remove("opacity-50", "cursor-not-allowed");
      btnYa.innerText = "Ya, Switch";
    } else {
      btnYa.innerText = `Ya (${timeLeft}s)`;
    }
  }, 1000);
};

window.confirmSwitch = function (isYes) {
  clearInterval(switchTimerInterval);
  document.getElementById("modal-switch").classList.add("hidden");
  if (isYes) forceSetMode("manual");
};

function forceSetMode(mode) {
  currentMode = mode;
  const btnAuto = document.getElementById("btn-mode-otomatis");
  const btnManual = document.getElementById("btn-mode-manual");
  const btnPumpOn = document.getElementById("btn-pompa-on");
  const btnPumpOff = document.getElementById("btn-pompa-off");
  const teksDesc = document.getElementById("teks-desc-pompa");
  const durBtns = document.querySelectorAll(".duration-btn");
  const rsnBtns = document.querySelectorAll(".reason-btn");
  const customInput = document.getElementById("custom-dur");
  const customContainer = document.getElementById("dur-custom-container");

  if (mode === "otomatis") {
    btnAuto.className =
      "flex-1 md:w-40 flex items-center justify-center space-x-2 py-2 rounded-md font-bold text-sm bg-brand-green text-white shadow-sm transition-all cursor-pointer";
    btnManual.className =
      "flex-1 md:w-40 flex items-center justify-center space-x-2 py-2 rounded-md font-medium text-sm text-gray-500 hover:bg-gray-100 transition-all cursor-pointer";
    if (teksDesc) teksDesc.innerText = "Sistem dikendalikan otomatis";
    btnPumpOn.className =
      "flex-1 md:w-40 py-4 rounded-xl font-bold text-gray-400 bg-gray-200 cursor-not-allowed transition-all flex justify-center items-center space-x-2";
    btnPumpOff.className =
      "flex-1 md:w-40 py-4 rounded-xl font-bold text-gray-400 bg-gray-200 cursor-not-allowed transition-all flex justify-center items-center space-x-2";
    customInput.disabled = true;
    customContainer.classList.add(
      "bg-gray-100",
      "opacity-60",
      "cursor-not-allowed",
    );
    durBtns.forEach(
      (b) =>
        (b.className =
          "duration-btn bg-gray-100 border border-gray-200 text-gray-400 px-4 py-2 rounded-lg text-sm cursor-not-allowed w-[80px]"),
    );
    rsnBtns.forEach((b) => {
      b.className =
        "reason-btn flex items-center space-x-2 bg-gray-100 border border-gray-200 text-gray-400 px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-60";
      b.querySelector("i").className = "fa-solid fa-leaf text-gray-400";
    });
  } else {
    btnManual.className =
      "flex-1 md:w-40 flex items-center justify-center space-x-2 py-2 rounded-md font-bold text-sm bg-brand-green text-white shadow-sm transition-all cursor-pointer";
    btnAuto.className =
      "flex-1 md:w-40 flex items-center justify-center space-x-2 py-2 rounded-md font-medium text-sm text-gray-500 hover:bg-gray-100 transition-all cursor-pointer";
    if (teksDesc && !localStorage.getItem("pumpTimerEnd"))
      teksDesc.innerText = "Sistem dalam mode manual (Menunggu Perintah)";
    btnPumpOn.className =
      "flex-1 md:w-40 py-4 rounded-xl font-bold text-white bg-brand-green hover:bg-green-800 cursor-pointer shadow-sm transition-all flex justify-center items-center space-x-2";
    btnPumpOff.className =
      "flex-1 md:w-40 py-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 cursor-pointer shadow-sm transition-all flex justify-center items-center space-x-2";
    customInput.disabled = false;
    customContainer.classList.remove(
      "bg-gray-100",
      "opacity-60",
      "cursor-not-allowed",
      "border-brand-green",
    );
    durBtns.forEach(
      (b) =>
        (b.className =
          "duration-btn bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:border-brand-green hover:text-brand-green cursor-pointer shadow-sm transition-all w-[80px]"),
    );
    rsnBtns.forEach((b) => {
      b.className =
        "reason-btn flex items-center space-x-2 bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:border-brand-green shadow-sm cursor-pointer transition-all";
    });
    resetSelections();
  }
}

function resetSelections() {
  selectedMins = 0;
  selectedReasonText = "";
  document.getElementById("custom-dur").value = "";
  document
    .getElementById("dur-custom-container")
    .classList.remove("border-brand-green", "bg-brand-light");
  document.querySelectorAll(".duration-btn").forEach((btn) => {
    btn.classList.remove(
      "border-brand-green",
      "text-brand-green",
      "font-bold",
      "bg-brand-light",
    );
    btn.classList.add("border-gray-200", "text-gray-600");
  });
  document.querySelectorAll(".reason-btn").forEach((b) => {
    b.classList.remove("border-brand-green", "bg-brand-light");
    b.classList.add("border-gray-200", "bg-white");
  });
  document.getElementById("rsn-1").querySelector("i").className =
    "fa-solid fa-wrench text-brand-green";
  document.getElementById("rsn-2").querySelector("i").className =
    "fa-solid fa-droplet text-blue-500";
  document.getElementById("rsn-3").querySelector("i").className =
    "fa-solid fa-leaf text-brand-green";
}

window.selectDuration = function (id, val) {
  if (currentMode === "otomatis") return;
  selectedMins = val;
  document.getElementById("custom-dur").value = "";
  document
    .getElementById("dur-custom-container")
    .classList.remove("border-brand-green", "bg-brand-light");
  document.querySelectorAll(".duration-btn").forEach((btn) => {
    btn.classList.remove(
      "border-brand-green",
      "text-brand-green",
      "font-bold",
      "bg-brand-light",
    );
    btn.classList.add("border-gray-200", "text-gray-600");
  });
  document
    .getElementById(id)
    .classList.add(
      "border-brand-green",
      "text-brand-green",
      "font-bold",
      "bg-brand-light",
    );
};

window.selectCustomDuration = function () {
  if (currentMode === "otomatis") return;
  const val = parseInt(document.getElementById("custom-dur").value);
  selectedMins = val > 0 ? val : 0;
  document.querySelectorAll(".duration-btn").forEach((btn) => {
    btn.classList.remove(
      "border-brand-green",
      "text-brand-green",
      "font-bold",
      "bg-brand-light",
    );
    btn.classList.add("border-gray-200", "text-gray-600");
  });
  document
    .getElementById("dur-custom-container")
    .classList.add("border-brand-green", "bg-brand-light");
};

window.selectReason = function (id, text) {
  if (currentMode === "otomatis") return;
  selectedReasonText = text;
  document.querySelectorAll(".reason-btn").forEach((b) => {
    b.classList.remove("border-brand-green", "bg-brand-light");
    b.classList.add("border-gray-200", "bg-white");
  });
  document
    .getElementById(id)
    .classList.add("border-brand-green", "bg-brand-light");
};

window.eksekusiPompa = function (status) {
  if (currentMode === "otomatis") return;
  if (selectedMins <= 0 || isNaN(selectedMins)) {
    showAlertModal(
      "Langkah Belum Lengkap",
      `Silakan pilih <b>Durasi Override</b> terlebih dahulu.`,
    );
    return;
  }
  if (selectedReasonText === "") {
    showAlertModal(
      "Langkah Belum Lengkap",
      `Silakan pilih <b>Alasan Override</b> terlebih dahulu.`,
    );
    return;
  }

  if (localStorage.getItem("pumpTimerStart")) {
    if (typeof window.stopActiveTimer === "function")
      window.stopActiveTimer(false);
  }
  if (typeof window.startPumpTimer === "function")
    window.startPumpTimer(selectedMins, `Pompa ${status}`, selectedReasonText);

  document.getElementById("teks-status-pompa").innerText = `POMPA ${status}`;
  document.getElementById("teks-status-pompa").className =
    status === "ON"
      ? "text-3xl font-bold text-brand-green mb-1"
      : "text-3xl font-bold text-red-500 mb-1";
  document.getElementById("teks-desc-pompa").innerText =
    `Sedang override ke ${status}`;
  renderHistoryTable();
  resetSelections();
};

window.eksekusiPompaOFF = function () {
  if (currentMode === "otomatis") return;
  if (localStorage.getItem("pumpTimerStart")) {
    document.getElementById("modal-confirm-off").classList.remove("hidden");
  } else {
    eksekusiPompa("OFF");
  }
};

function renderHistoryTable() {
  const tbody = document.getElementById("history-table-body");
  if (!tbody) return;
  let history = JSON.parse(localStorage.getItem("manualHistory")) || [];
  tbody.innerHTML = "";
  history.forEach((item) => {
    const tr = document.createElement("tr");
    tr.className =
      "border-b border-gray-100 hover:bg-gray-50 transition-colors";
    const colorClass =
      item.aksi === "Pompa ON" ? "text-brand-green" : "text-red-500";
    tr.innerHTML = `<td class="py-3 px-5 whitespace-nowrap">${item.waktu}</td><td class="py-3 px-5 font-bold ${colorClass}">${item.aksi}</td><td class="py-3 px-5">${item.durasi}</td><td class="py-3 px-5">${item.alasan}</td>`;
    tbody.appendChild(tr);
  });
}
