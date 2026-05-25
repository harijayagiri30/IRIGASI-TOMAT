// ==========================================
// FUNGSI LOGIN & UI DASAR
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
    alert("Username atau password salah! \n(Gunakan: user / user123)");
  }
}

// ==========================================
// FUNGSI INTEGRASI API CUACA OPEN-METEO
// ==========================================
async function fetchWeatherData() {
  // Mengecek apakah elemen cuaca ada di halaman ini (agar tidak error di halaman login)
  const teksCuaca = document.getElementById("teks-cuaca");
  const iconCuaca = document.getElementById("icon-cuaca");
  const teksPeluang = document.getElementById("teks-peluang");

  if (!teksCuaca || !teksPeluang) return;

  // Koordinat yang Anda berikan
  const lat = -7.0851452;
  const lon = 110.3616954;

  // URL API Open-Meteo (Menarik kode cuaca saat ini & peluang hujan harian maksimum)
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code&daily=precipitation_probability_max&timezone=Asia%2FJakarta`;

  try {
    // Berikan efek loading
    teksCuaca.innerText = "Loading...";
    teksPeluang.innerText = "...";

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Ambil Data
    const weatherCode = data.current.weather_code;
    const probHujan = data.daily.precipitation_probability_max[0]; // Peluang hujan hari ini

    // Terjemahkan Kode Cuaca (WMO Code) ke Bahasa Indonesia & Ikon
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

    // Terapkan ke HTML
    teksCuaca.innerText = cuacaStr;
    teksCuaca.title = cuacaStr;
    iconCuaca.innerHTML = iconHtml;
    teksPeluang.innerText = probHujan + "%";
  } catch (error) {
    console.error("Gagal mengambil data cuaca:", error);
    teksCuaca.innerText = "Error API";
    teksPeluang.innerText = "Error";
  }
}

// Jalankan saat halaman web selesai dimuat
window.addEventListener("DOMContentLoaded", fetchWeatherData);
