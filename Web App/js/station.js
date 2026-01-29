import { updateSensorStatus } from './main.js';

document.addEventListener('DOMContentLoaded', function () {
   
    // Connect to the WebSocket server running on Raspberry Pi
    const socket = new WebSocket('ws://192.168.209.50:8080');

    // Event listener for when the connection is opened
    socket.addEventListener('open', (event) => {
        console.log('Connected to WebSocket server');
    });

    // Event listener for when a message is received from the server
    socket.addEventListener('message', (event) => {
        console.log('Message from server:', JSON.parse(event.data));

        document.getElementById('gyroX').innerText = `Gyro X: ${sensorData.gyro.x}`;
        document.getElementById('gyroY').innerText = `Gyro Y: ${sensorData.gyro.y}`;
        document.getElementById('gyroZ').innerText = `Gyro Z: ${sensorData.gyro.z}`;

        sensorData.flame_detected ? document.getElementById('fire-alarm').classList.add("alarm") : document.getElementById('fire-alarm').classList.remove("alarm");
    });

    document.getElementById("open").addEventListener('click', () => {
        socket.send('-1');
        console.log('Sent: -1');
    });

    document.getElementById("close").addEventListener('click', () => {
        socket.send('0');
        console.log('Sent: 0');
    });

});