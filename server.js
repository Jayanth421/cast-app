const express = require("express");
const http = require("http");   // ← THIS LINE WAS MISSING
const WebSocket = require("ws");

const app = express();
app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", ws => {
    clients.push(ws);

    ws.on("message", message => {
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        clients = clients.filter(c => c !== ws);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Running"));
