// KONTRAK API: ESP32 -> NETLIFY -> FIREBASE
exports.handler = async (event, context) => {
  // 1. Keamanan: Hanya izinkan alat yang mengirim data pakai metode POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Hanya menerima method POST dari ESP32" }),
    };
  }

  try {
    // 2. Tangkap data JSON yang dikirim oleh ESP32
    const payloadFromESP = JSON.parse(event.body);

    // 3. URL Database Firebase Anda (Menuju node 'monitoring')
    const firebaseDbUrl =
      "https://irigasi-tomat-web-default-rtdb.asia-southeast1.firebasedatabase.app/monitoring.json";

    // 4. Teruskan data ke Firebase (Pakai PATCH agar hanya mengupdate yang berubah)
    const response = await fetch(firebaseDbUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadFromESP),
    });

    if (response.ok) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          status: "success",
          message: "Data ESP32 berhasil diteruskan ke Firebase!",
        }),
      };
    } else {
      return {
        statusCode: response.status,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Gagal meneruskan data ke Firebase" }),
      };
    }
  } catch (error) {
    // Tangkap jika format data dari ESP32 salah
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Format data salah atau Server Error",
        detail: error.toString(),
      }),
    };
  }
};
