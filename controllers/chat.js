const WebSocket = require("ws");
const Message = require("../models/message"); // Assuming you have a Mongoose model for chats

// WebSocket server instance
const wss = new WebSocket.Server({ noServer: true });

// Function to handle WebSocket connections and messages
wss.on("connection", async (ws) => {
  console.log("WebSocket connection established");

  
  try {
    const chatHistory = await Message.find().sort({ timestamp: 1 }).lean();
    ws.send(JSON.stringify({ type: "chatHistory", data: chatHistory }));
  } catch (error) {
    console.error("Error retrieving chat history:", error);
  }

  ws.on("message", async (data) => {
    try {
      const messageData = JSON.parse(data);
      // Save the message to the database
      const chatMessage = new Message({
        sender: messageData.sender,
        receiver: messageData.receiver,
        message: messageData.message,
        timestamp: new Date(),
      });
      await chatMessage.save();
      // Broadcast the message to the sender and receiver
      ws.send(JSON.stringify(chatMessage));
      const receiverSocket = Array.from(wss.clients).find(
        (client) => client.id === messageData.receiver
      );
      if (receiverSocket) {
        receiverSocket.send(JSON.stringify(chatMessage));
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// Function to handle WebSocket upgrade requests
function handleUpgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
}

module.exports = { handleUpgrade };
