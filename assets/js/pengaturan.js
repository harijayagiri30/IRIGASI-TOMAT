const defSlot1 = {
  name: "Slot 1 (Custom)",
  kbawah: 45,
  katas: 80,
  kbatas: 45,
  nkering: 2,
  interval: "1 jam",
  tunda: "Aktif",
  curah: 5,
};
const defSlot2 = {
  name: "Slot 2 (Custom)",
  kbawah: 45,
  katas: 80,
  kbatas: 45,
  nkering: 2,
  interval: "1 jam",
  tunda: "Aktif",
  curah: 5,
};
const defSlot3 = {
  name: "Slot 3 (Custom)",
  kbawah: 45,
  katas: 80,
  kbatas: 45,
  nkering: 2,
  interval: "1 jam",
  tunda: "Aktif",
  curah: 5,
};
const paramIds = [
  "kbawah",
  "katas",
  "kbatas",
  "nkering",
  "interval",
  "tunda",
  "curah",
  "slot-name",
];
let resetTimerInterval;

function initSettings() {
  if (!localStorage.getItem("slot1"))
    localStorage.setItem("slot1", JSON.stringify(defSlot1));
  if (!localStorage.getItem("slot2"))
    localStorage.setItem("slot2", JSON.stringify(defSlot2));
  if (!localStorage.getItem("slot3"))
    localStorage.setItem("slot3", JSON.stringify(defSlot3));
  updateDropdownNames();
  const lastActiveProfile = localStorage.getItem("activeProfile") || "auto";
  document.getElementById("preset-profil").value = lastActiveProfile;
  applyPreset();
}

function updateDropdownNames() {
  document.getElementById("opt-slot1").innerText = JSON.parse(
    localStorage.getItem("slot1"),
  ).name;
  document.getElementById("opt-slot2").innerText = JSON.parse(
    localStorage.getItem("slot2"),
  ).name;
  document.getElementById("opt-slot3").innerText = JSON.parse(
    localStorage.getItem("slot3"),
  ).name;
}

function applyPreset() {
  const profil = document.getElementById("preset-profil").value;
  localStorage.setItem("activeProfile", profil);
  const autoMsg = document.getElementById("auto-msg");
  const editMsg = document.getElementById("edit-msg");
  const btnSimpan = document.getElementById("btn-simpan");
  const btnEdit = document.getElementById("btn-edit");
  const btnReset = document.getElementById("btn-reset");
  const nameContainer = document.getElementById("slot-name-container");

  if (profil === "auto") {
    nameContainer.classList.add("hidden");
    btnReset.classList.add("hidden");
    document.getElementById("kbawah").value = 45;
    document.getElementById("katas").value = 80;
    document.getElementById("kbatas").value = 45;
    document.getElementById("nkering").value = 2;
    document.getElementById("interval").value = "1 jam";
    document.getElementById("tunda").value = "Aktif";
    document.getElementById("curah").value = 5;
    autoMsg.classList.remove("hidden");
    editMsg.classList.add("hidden");
    btnSimpan.classList.add("hidden");
    btnEdit.classList.add("hidden");
    lockInputs();
  } else {
    nameContainer.classList.remove("hidden");
    btnReset.classList.remove("hidden");
    const slotData = JSON.parse(localStorage.getItem(profil));
    document.getElementById("kbawah").value = slotData.kbawah;
    document.getElementById("katas").value = slotData.katas;
    document.getElementById("kbatas").value = slotData.kbatas;
    document.getElementById("nkering").value = slotData.nkering;
    document.getElementById("interval").value = slotData.interval;
    document.getElementById("tunda").value = slotData.tunda;
    document.getElementById("curah").value = slotData.curah;
    document.getElementById("slot-name").value = slotData.name;
    autoMsg.classList.add("hidden");
    editMsg.classList.remove("hidden");
    btnSimpan.classList.remove("hidden");
    btnEdit.classList.add("hidden");
    unlockInputs();
  }
}

function saveSettings() {
  const profil = document.getElementById("preset-profil").value;
  if (profil === "auto") return;
  let newName = document.getElementById("slot-name").value;
  if (newName.trim() === "") newName = `Slot ${profil.replace("slot", "")}`;
  const newData = {
    name: newName,
    kbawah: document.getElementById("kbawah").value,
    katas: document.getElementById("katas").value,
    kbatas: document.getElementById("kbatas").value,
    nkering: document.getElementById("nkering").value,
    interval: document.getElementById("interval").value,
    tunda: document.getElementById("tunda").value,
    curah: document.getElementById("curah").value,
  };
  localStorage.setItem(profil, JSON.stringify(newData));
  updateDropdownNames();
  lockInputs();
  document.getElementById("edit-msg").classList.add("hidden");
  document.getElementById("btn-simpan").classList.add("hidden");
  document.getElementById("btn-edit").classList.remove("hidden");
  alert(`Sukses! Data telah disimpan sebagai "${newName}".`);
}

function enableEdit() {
  unlockInputs();
  document.getElementById("edit-msg").classList.remove("hidden");
  document.getElementById("btn-simpan").classList.remove("hidden");
  document.getElementById("btn-edit").classList.add("hidden");
}

function lockInputs() {
  paramIds.concat(["user-name", "user-email"]).forEach((id) => {
    const input = document.getElementById(id);
    input.disabled = true;
    input.classList.add("text-gray-400", "cursor-not-allowed");
    input.classList.remove("text-gray-800", "text-brand-green");
    const card = document.getElementById("card-" + id);
    if (card) {
      card.classList.add("bg-gray-100", "opacity-75");
      card.classList.remove("bg-white");
    }
  });
}

function unlockInputs() {
  paramIds.concat(["user-name", "user-email"]).forEach((id) => {
    const input = document.getElementById(id);
    input.disabled = false;
    input.classList.remove("text-gray-400", "cursor-not-allowed");
    input.classList.add("text-gray-800");
    if (id === "slot-name") input.classList.add("text-brand-green");
    const card = document.getElementById("card-" + id);
    if (card) {
      card.classList.remove("bg-gray-100", "opacity-75");
      card.classList.add("bg-white");
    }
  });
}

function showResetModal() {
  document.getElementById("modal-reset").classList.remove("hidden");
  const btnYa = document.getElementById("btn-ya-reset");
  btnYa.disabled = true;
  btnYa.classList.add("opacity-50", "cursor-not-allowed");
  btnYa.classList.remove("hover:bg-red-600");
  let timeLeft = 5;
  btnYa.innerText = `Ya (${timeLeft}s)`;
  resetTimerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(resetTimerInterval);
      btnYa.disabled = false;
      btnYa.classList.remove("opacity-50", "cursor-not-allowed");
      btnYa.classList.add("hover:bg-red-600");
      btnYa.innerText = "Ya, Hapus";
    } else {
      btnYa.innerText = `Ya (${timeLeft}s)`;
    }
  }, 1000);
}

function confirmReset(isYes) {
  clearInterval(resetTimerInterval);
  document.getElementById("modal-reset").classList.add("hidden");
  if (isYes) {
    const profil = document.getElementById("preset-profil").value;
    if (profil !== "auto") {
      let defData =
        profil === "slot1"
          ? defSlot1
          : profil === "slot2"
            ? defSlot2
            : defSlot3;
      localStorage.setItem(profil, JSON.stringify(defData));
      updateDropdownNames();
      applyPreset();
    }
  }
}
