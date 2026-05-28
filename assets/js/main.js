// ==========================================
// FUNGSI LOGIN & DROPDOWN GLOBAL
// ==========================================
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId); const icon = document.getElementById(iconId);
    if (input.type === 'password') { input.type = 'text'; icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); } 
    else { input.type = 'password'; icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
}

function loginUser() {
    const user = document.getElementById('user-user').value; const pass = document.getElementById('user-pass').value;
    if (user === 'user' && pass === 'user123') { window.location.href = 'dashboard.html'; } 
    else { alert('Username atau password salah!'); }
}

window.toggleDropdown = function() { 
    const drop = document.getElementById('userDropdown');
    if(drop) drop.classList.toggle('hidden'); 
};

window.addEventListener('click', function(e) {
    const btn = document.querySelector('button[onclick="toggleDropdown()"]'); 
    const drop = document.getElementById('userDropdown');
    if (btn && drop && !btn.contains(e.target) && !drop.contains(e.target)) {
        drop.classList.add('hidden');
    }
});

// ==========================================
// FUNGSI TIMER & RIWAYAT (STATE MANAGEMENT)
// ==========================================
let globalTimerInterval;

document.addEventListener('DOMContentLoaded', () => {
    checkActiveTimer();
    if(typeof loadActiveProfileName === 'function') loadActiveProfileName();
});

window.startPumpTimer = function(durationMins, action, reason) {
    const startTime = Date.now();
    const endTime = startTime + (durationMins * 60000);
    localStorage.setItem('pumpTimerStart', startTime.toString());
    localStorage.setItem('pumpTimerEnd', endTime.toString());
    localStorage.setItem('pumpTimerAction', action);
    localStorage.setItem('pumpTimerReason', reason);
    localStorage.setItem('pumpTimerDuration', durationMins.toString());
    checkActiveTimer();
};

function checkActiveTimer() {
    const endTime = localStorage.getItem('pumpTimerEnd');
    if (!endTime) return; 

    const targetTime = parseInt(endTime);
    if (Date.now() >= targetTime) { stopActiveTimer(true); return; }

    let widget = document.getElementById('floating-timer-widget');
    if (!widget) {
        widget = document.createElement('div');
        widget.id = 'floating-timer-widget';
        widget.className = 'fixed top-4 right-4 bg-brand-dark text-white px-4 py-2 rounded-full shadow-2xl flex items-center space-x-3 z-[9999] border-2 border-brand-green animate-pulse';
        widget.innerHTML = `<i class="fa-solid fa-stopwatch"></i> <span id="floating-time" class="font-bold font-mono">00:00</span>`;
        document.body.appendChild(widget);
    }

    if(globalTimerInterval) clearInterval(globalTimerInterval);

    globalTimerInterval = setInterval(() => {
        const now = Date.now();
        const distance = targetTime - now;

        if (distance <= 0) {
            stopActiveTimer(true); 
        } else {
            let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let s = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById('floating-time').innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

window.stopActiveTimer = function(autoFinished = false) {
    if(globalTimerInterval) clearInterval(globalTimerInterval);
    const startTime = localStorage.getItem('pumpTimerStart');
    const action = localStorage.getItem('pumpTimerAction');
    const reason = localStorage.getItem('pumpTimerReason');

    if (startTime && action) {
        let durationStr = "";
        if (autoFinished) {
            durationStr = `${localStorage.getItem('pumpTimerDuration')} menit`;
        } else {
            const elapsedSec = Math.floor((Date.now() - parseInt(startTime)) / 1000);
            if (elapsedSec < 60) { durationStr = `${elapsedSec} detik`; } 
            else { const mins = Math.floor(elapsedSec / 60); const secs = elapsedSec % 60; durationStr = `${mins} mnt ${secs} dtk`; }
        }
        addHistoryToStorage(action, durationStr, reason);
    }

    localStorage.removeItem('pumpTimerStart');
    localStorage.removeItem('pumpTimerEnd');
    localStorage.removeItem('pumpTimerAction');
    localStorage.removeItem('pumpTimerReason');
    localStorage.removeItem('pumpTimerDuration');

    const widget = document.getElementById('floating-timer-widget');
    if(widget) widget.remove();

    // SINKRONISASI UI OTOMATIS
    if (typeof window.refreshControlUI === 'function') window.refreshControlUI();
    if (typeof window.updatePumpCardUI === 'function') window.updatePumpCardUI();

    if (autoFinished) {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Waktu Override Habis!", { body: "Sistem kembali ke Mode Otomatis.", icon: "https://cdn-icons-png.flaticon.com/512/1141/1141885.png", vibrate: [200, 100, 200] });
        } else { alert("Waktu Override Habis!\n\nSistem kembali ke Mode Otomatis."); }
    }
};

function addHistoryToStorage(action, durationStr, reason) {
    let history = JSON.parse(localStorage.getItem('manualHistory')) || [];
    const now = new Date();
    const d = now.getDate().toString().padStart(2,'0'); const m = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"][now.getMonth()]; const y = now.getFullYear();
    const hr = now.getHours().toString().padStart(2,'0'); const min = now.getMinutes().toString().padStart(2,'0'); const sec = now.getSeconds().toString().padStart(2,'0');
    const timeStr = `${d} ${m} ${y} ${hr}:${min}:${sec}`;

    history.unshift({ waktu: timeStr, aksi: action, durasi: durationStr, alasan: reason });
    if (history.length > 15) history.pop();
    localStorage.setItem('manualHistory', JSON.stringify(history));
}