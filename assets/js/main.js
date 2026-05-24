// Fungsi untuk melihat/menyembunyikan password
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

// Fungsi Login Tunggal (Hanya User)
function loginUser() {
  const user = document.getElementById("user-user").value;
  const pass = document.getElementById("user-pass").value;

  if (user === "user" && pass === "user123") {
    // Karena file dashboard.html sekarang sejajar dengan index.html
    window.location.href = "dashboard.html";
  } else {
    alert("Username atau password salah! \n(Gunakan: user / user123)");
  }
}
