console.log("Script loaded");

// Run only on SOS page
window.onload = () => {
  if (document.getElementById("timerText")) {
    startAutoSOS();
  }
};

let timeLeft = 60;
let interval;

function startAutoSOS() {
  const timerText = document.getElementById("timerText");

  interval = setInterval(() => {
    timeLeft--;
    timerText.innerText = `Auto SOS in ${timeLeft} seconds...`;
    console.log("Timer:", timeLeft);

    if (timeLeft <= 0) {
      clearInterval(interval);
      sendAutoSOS();
    }
  }, 1000);
}

// Manual SOS
function sendManualSOS() {
  clearInterval(interval);
  sendSOS("Manual SOS triggered");
}

// Auto SOS
function sendAutoSOS() {
  sendSOS("User did not respond. Auto SOS triggered");
}

// Common SOS logic
function sendSOS(reason) {
  if (!navigator.geolocation) {
    alert("GPS not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const mapLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      const message = `🚨 SOS ALERT 🚨
📍 Location:
${mapLink}
⚠️ ${reason}`;

      fetch("http://localhost:5000/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        alert("SOS Sent Successfully!");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to send SOS");
      });
    },
    err => {
      alert("Location permission denied");
    }
  );
}
