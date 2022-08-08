import request from "supertest";
import app from "../src/app";


client.on('qr',( qr:String) => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    let chatId = 
});

describe("GET /api", () => {
  it("should return 200 OK", () => {
    return request(app).get("/api").expect(200);
  });
});
