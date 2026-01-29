import { updateSensorStatus } from './main.js';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Leaflet map
    const map = L.map('map').setView([39.7392, -104.9903], 13); 

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create a marker for the GPS location
    const marker = L.marker([39.7392, -104.9903]).addTo(map);
    
    // Function to update GPS location
    function updateGPS(lat, lon) {
        marker.setLatLng([lat, lon]);
        map.setView([lat, lon], 13);
    }

    // Mock GPS data update
    setInterval(() => {
        // Randomize coordinates for testing purposes (replace with actual GPS data)
        const lat = 39.7392 + (Math.random() * 0.01);
        const lon = -104.9903 + (Math.random() * 0.01);
        updateGPS(lat, lon);
    }, 5000);

    setInterval(updateSensorStatus("gps-status"), 5000);        

    // Connect to the WebSocket server running on Raspberry Pi
    const socket = new WebSocket('ws://192.168.137.1:1880/ws/sensor');

    // Event listener for when the connection is opened
    socket.addEventListener('open', (event) => {
        console.log('Connected to WebSocket server');
    });

    // Event listener for when a message is received from the server
    socket.addEventListener('message', (event) => {
        console.log('Message from server:', event.data);
    });

    let keysHeld = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };
    
    // Map the arrow keys to their respective commands
    const keyMap = {
        ArrowUp: 'B',
        ArrowDown: 'F',
        ArrowRight: 'R',
        ArrowLeft: 'L'
    };
    
    // Function to send the appropriate command to the socket
    function sendCommand(key, stop = false) {
        if (key in keyMap) {
            const command = stop ? 'S' : keyMap[key]; // Send 'S' to stop
            socket.send(command);
            console.log(`Sent: ${command}`);
        }
    }
    
    // Activate click handlers for each arrow key
    function activeKey(id) {
        document.getElementById(id).onclick = () => sendCommand(id);
    }
    
    // Attach click listeners for all arrow keys
    Object.keys(keyMap).forEach(activeKey);
    
    // Handle keydown events
    document.addEventListener('keydown', (event) => {
        if (event.code in keysHeld && !keysHeld[event.code]) {
            keysHeld[event.code] = true;
            document.getElementById(event.code).classList.add("held"); // Add visual feedback
            sendCommand(event.code);
        }
    });
    
    // Handle keyup events to stop the action
    document.addEventListener('keyup', (event) => {
        if (event.code in keysHeld) {
            keysHeld[event.code] = false;
            sendCommand(event.code, true); // Send stop command ('S')
            document.getElementById(event.code).classList.remove("held"); // Remove visual feedback
        }
    });    

});