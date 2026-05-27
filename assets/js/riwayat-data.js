// Data Dummy Master untuk disortir
const masterDataRiwayat = [
  {
    waktu: "22 Mei 11:45",
    kbedeng: "52.4",
    kmin: "43.7",
    debit: "1.2",
    cuaca: "Berawan",
    cuacaIcon: "fa-cloud text-gray-400",
    status: "ON",
    alasan: "Kbedeng < 45%",
    timestamp: Date.now() - 3600000,
  },
  {
    waktu: "22 Mei 10:30",
    kbedeng: "41.2",
    kmin: "42.1",
    debit: "1.5",
    cuaca: "Hujan Ringan",
    cuacaIcon: "fa-cloud-rain text-blue-400",
    status: "ON",
    alasan: "Kbedeng < 45%",
    timestamp: Date.now() - 7200000,
  },
  {
    waktu: "22 Mei 09:15",
    kbedeng: "46.8",
    kmin: "45.0",
    debit: "0.0",
    cuaca: "Berawan",
    cuacaIcon: "fa-cloud text-gray-400",
    status: "OFF",
    alasan: "Kbedeng >= 45%",
    timestamp: Date.now() - 10800000,
  },
  {
    waktu: "22 Mei 08:00",
    kbedeng: "72.1",
    kmin: "46.3",
    debit: "0.0",
    cuaca: "Cerah",
    cuacaIcon: "fa-sun text-yellow-400",
    status: "OFF",
    alasan: "Kbedeng >= 45%",
    timestamp: Date.now() - 14400000,
  },
  {
    waktu: "21 Mei 06:45",
    kbedeng: "83.6",
    kmin: "47.2",
    debit: "0.0",
    cuaca: "Cerah",
    cuacaIcon: "fa-sun text-yellow-400",
    status: "INFO",
    alasan: "Sistem dimatikan (Hujan lebat)",
    timestamp: Date.now() - 86400000,
  },
  {
    waktu: "21 Mei 05:30",
    kbedeng: "38.9",
    kmin: "44.0",
    debit: "1.8",
    cuaca: "Hujan Ringan",
    cuacaIcon: "fa-cloud-rain text-blue-400",
    status: "ON",
    alasan: "Kbedeng < 45%",
    timestamp: Date.now() - 90000000,
  },
  {
    waktu: "20 Mei 04:15",
    kbedeng: "44.6",
    kmin: "43.8",
    debit: "1.1",
    cuaca: "Berawan",
    cuacaIcon: "fa-cloud text-gray-400",
    status: "DATA",
    alasan: "Sinkronisasi Node 2",
    timestamp: Date.now() - 172800000,
  },
];

function loadRiwayat() {
  // Tampilkan tanggal hari ini
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
  document.getElementById("hari-ini-label").innerText =
    `${d} ${m} ${now.getFullYear()}`;

  applyTableFilter(); // Muat data pertama kali
}

function applyTableFilter() {
  const filterWaktu = document.getElementById("filter-waktu").value;
  const filterStatus = document.getElementById("filter-status").value;

  let filteredData = masterDataRiwayat;

  // Filter Waktu (Simulasi Logika)
  if (filterWaktu === "24h") {
    const batas = Date.now() - 24 * 60 * 60 * 1000;
    filteredData = filteredData.filter((d) => d.timestamp >= batas);
  } else if (filterWaktu === "7d") {
    const batas = Date.now() - 7 * 24 * 60 * 60 * 1000;
    filteredData = filteredData.filter((d) => d.timestamp >= batas);
  }

  // Filter Status
  if (filterStatus !== "all") {
    filteredData = filteredData.filter((d) => d.status === filterStatus);
  }

  renderFilteredTable(filteredData);
  updateSumMetrics(filteredData);
}

function renderFilteredTable(data) {
  const tbody = document.getElementById("riwayat-table-body");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-gray-400">Tidak ada data untuk filter ini.</td></tr>`;
    document.getElementById("tabel-info").innerText = "Menampilkan 0 data";
    return;
  }

  data.forEach((d) => {
    const tr = document.createElement("tr");
    tr.className =
      "border-b border-gray-100 hover:bg-gray-50 transition-colors";

    let statusBadge = "";
    if (d.status === "ON")
      statusBadge = `<span class="bg-green-100 text-brand-green px-2 py-1 rounded font-bold">ON</span>`;
    else if (d.status === "OFF")
      statusBadge = `<span class="bg-red-50 text-red-500 px-2 py-1 rounded font-bold">OFF</span>`;
    else if (d.status === "INFO")
      statusBadge = `<span class="bg-yellow-50 text-yellow-600 px-2 py-1 rounded font-bold">INFO</span>`;
    else if (d.status === "DATA")
      statusBadge = `<span class="bg-blue-50 text-blue-500 px-2 py-1 rounded font-bold">DATA</span>`;

    tr.innerHTML = `
            <td class="py-4 px-6 text-xs whitespace-nowrap">${d.waktu}</td>
            <td class="py-4 px-6 font-medium">${d.kbedeng}</td>
            <td class="py-4 px-6">${d.kmin}</td>
            <td class="py-4 px-6 font-semibold ${d.debit !== "0.0" ? "text-gray-800" : "text-gray-400"}">${d.debit}</td>
            <td class="py-4 px-6 text-xs whitespace-nowrap"><i class="fa-solid ${d.cuacaIcon} mr-2"></i>${d.cuaca}</td>
            <td class="py-4 px-6">${statusBadge}</td>
            <td class="py-4 px-6 text-xs">${d.alasan}</td>
        `;
    tbody.appendChild(tr);
  });

  document.getElementById("tabel-info").innerText =
    `Menampilkan ${data.length} dari ${masterDataRiwayat.length} data`;
}

function updateSumMetrics(data) {
  const total = data.length;
  const onCount = data.filter((d) => d.status === "ON").length;
  const offCount = data.filter((d) => d.status === "OFF").length;
  const totalDebit = data
    .reduce((sum, d) => sum + parseFloat(d.debit), 0)
    .toFixed(1);

  document.getElementById("sum-total").innerText = total;
  document.getElementById("sum-on").innerText = `${onCount} Kali`;
  document.getElementById("sum-off").innerText = `${offCount} Kali`;
  document.getElementById("sum-debit").innerText = `${totalDebit} L`;
}
