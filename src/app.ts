import express from "express";
import path from "path";

const qrcode = require("qrcode-terminal");
const genqr = require("qrcode");

const { Client, LocalAuth } = require("whatsapp-web.js");
const socketIO = require("socket.io");
const http = require("http");

require("dotenv").config();

// Create Expres  s server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Express configuration
console.log(process.env.PORT);
app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 })
);

// Use the saved values
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "client-dos" }),
  puppeteer: {
    headless: true,
  },
});

client.initialize();

// SOCKET IO
io.on("connection", (socket) => {
  socket.emit("message", "Connection ...");

  client.on("qr", (qr: String) => {
    //qrcode.generate(qr, { small: true });
    console.log("QR RECEIVED", qr);

    genqr.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit("message", "QR code received, scan please.");
    });
  });

  client.on("ready", () => {
    console.log("whatsapp is ready");
    socket.emit("message", "whatsapp is ready");
  });
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.post("/send-message", (req, res) => {
  const chatId = req.body.number;
  const message = req.body.message;

  console.log(req.body);

  client
    .sendMessage(chatId, message)
    .then((response) => {
      res.status(200).json({ status: true, response });
    })
    .catch((err) => {
      res.status(500).json({ status: false, err });
    });
});

server.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});
