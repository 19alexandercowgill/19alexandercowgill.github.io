// Check if Battery Status API is supported
function isBatterySupported() {
    return 'getBattery' in navigator;
}

// Get battery level as a percentage
async function getBatteryAsAPercentage(battery) {
    try {
        const levelPercentage = (battery.level * 100).toFixed(0);
        return levelPercentage + ""; // Convert to percentage
    } catch (error) {
        return "100%";
    }
}

// Check if the device is charging
async function amICharging(battery) {
    try {
        return battery.charging;
    } catch (error) {
        return false;
    }
}

// Get battery icon based on level and charging status
async function getBatteryBar(battery) {
    const levelPercentage = (battery.level * 100).toFixed(0);
    const isCharging = battery.charging;

    // Choose the icon based on charging status and level
    if (isCharging) {
        if (levelPercentage >= 90) return "battery_charging_full";
        else if (levelPercentage >= 80) return "battery_charging_80";
        else if (levelPercentage >= 60) return "battery_charging_60";
        else if (levelPercentage >= 50) return "battery_charging_50";
        else if (levelPercentage >= 30) return "battery_charging_30";
        else return "battery_charging_20"; // for any level below 30%
    } else {
        if (levelPercentage >= 100) return "battery_full";
        else if (levelPercentage >= 80) return "battery_6_bar";
        else if (levelPercentage >= 60) return "battery_5_bar";
        else if (levelPercentage >= 40) return "battery_4_bar";
        else if (levelPercentage >= 20) return "battery_3_bar";
        else if (levelPercentage >= 10) return "battery_2_bar";
        else if (levelPercentage >= 5) return "battery_1_bar";
        else return "battery_alert"; // for any level below 5%
    }
}

// Function to fetch and update battery status
async function updateBatteryStatus() {
    let battery;
    let isSupported = isBatterySupported();

    if (isSupported) {
        try {
            battery = await navigator.getBattery();

            // Get battery level as a percentage
            let batteryLevel = await getBatteryAsAPercentage(battery);
            // Get charging status
            let isCharging = await amICharging(battery);
            // Get battery icon based on charging status and level
            let batteryIcon = await getBatteryBar(battery);

            // Update the HTML elements with battery info
            document.getElementById("battery-percent").innerHTML = batteryLevel + "%";
            document.getElementById("battery-icon").innerHTML = batteryIcon;

        } catch (error) {
            //console.error("Error fetching battery status:", error);
            document.getElementById("battery-icon").innerHTML = "";
            document.getElementById("battery-percent").innerHTML = "";
        }
    } else {
        document.getElementById("battery-icon").innerHTML = "";
        document.getElementById("battery-percent").innerHTML = "";
    }
}

// Update battery status every second
setInterval(updateBatteryStatus, 1000);
