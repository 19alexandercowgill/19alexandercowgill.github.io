// Check if Network Information API is supported
function isNetworkSupported() {
    return 'connection' in navigator;
}

// Get the effective connection type (2g, 3g, 4g, slow-2g)
function getConnectionType() {
    if (!isNetworkSupported()) {
        console.warn("Network Information API is not supported.");
        return null;
    }

    try {
        return navigator.connection.effectiveType;
    } catch (error) {
        console.error("Error retrieving connection type:", error);
        return null;
    }
}

// Check if there is an internet connection
function isConnected() {
    // This checks whether we're online
    return navigator.onLine;
}

// Get the round-trip time (RTT) for connection quality
function getRTT() {
    if (!isNetworkSupported() || !navigator.connection.rtt) {
        //console.warn("RTT not supported or available.");
        return "no";
    }

    try {
        return navigator.connection.rtt;
    } catch (error) {
        console.error("Error retrieving RTT:", error);
        return null;
    }
}

// Map RTT to a quality bar (signal_cellular_4_bar to signal_cellular_0_bar)
function getSignalQualityBar(rtt) {
    if (rtt === null) {
        return "signal_cellular_0_bar"; // Default if RTT is unavailable
    }

    // Max RTT is 3000ms, so 2000ms maps to 0 bar (worst connection)
    if (rtt <= 500) {
        return "signal_cellular_4_bar"; // Excellent connection (Low RTT)
    } else if (rtt <= 1000) {
        return "signal_cellular_3_bar"; // Good connection
    } else if (rtt <= 1500) {
        return "signal_cellular_2_bar"; // Fair connection
    } else if (rtt <= 2000) {
        return "signal_cellular_1_bar"; // Poor connection
     
    } else if (rtt == "no") {
        return "network_locked"; // Poor connection
    } else {
        return "signal_cellular_0_bar"; // Very poor connection or high RTT
    }
}

// Update the wifi-status element based on the connection type or no internet
function updateWifiStatus() {
    const wifiStatusElement = document.getElementById("wifi-status");

    // Check if Network API is supported
    if (!isNetworkSupported()) {
        wifiStatusElement.innerHTML = "signal_wifi_statusbar_not_connected";
        return;
    }

    // If no internet connection (offline)
    if (!isConnected()) {
        wifiStatusElement.innerHTML = "signal_wifi_bad";
        return;
    }

    // Get the connection type
    const connectionType = getConnectionType();

    if (connectionType === "slow-2g") {
        wifiStatusElement.innerHTML = "signal_wifi_1_bar";
    } else if (connectionType === "2g") {
        wifiStatusElement.innerHTML = "network_wifi_2_bar";
    } else if (connectionType === "3g") {
        wifiStatusElement.innerHTML = "network_wifi_3_bar";
    } else if (connectionType === "4g") {
        wifiStatusElement.innerHTML = "signal_wifi_4_bar";
    } else {
        wifiStatusElement.innerHTML = "signal_wifi_statusbar_not_connected";
    }
}

// Update the quality-status element based on RTT (Round Trip Time)
function updateQualityStatus() {
    const qualityStatusElement = document.getElementById("quality-status");

    const rtt = getRTT(); // Get the RTT value

    // Get the corresponding signal quality bar
    const signalQualityBar = getSignalQualityBar(rtt);

    // Update the element with the appropriate signal quality icon
    qualityStatusElement.innerHTML = signalQualityBar;
}

// Continuously check and update wifi status and quality status every 2 seconds
setInterval(() => {
    updateWifiStatus();      // Update wifi status
    updateQualityStatus();   // Update network quality status
}, 2000);
