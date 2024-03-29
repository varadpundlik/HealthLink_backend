const WebSocket = require("ws");
const Message = require("../models/message"); // Assuming you have a Mongoose model for chats


const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.receiverId },
        { sender: req.params.receiverId, receiver: req.user.id },
      ],
    });
    res.status(200).json(chatHistory);
  } catch (error) {
    res.status(500).send("Error retrieving chat history");
  }
}

// WebSocket server instance
const wss = new WebSocket.Server({ noServer: true });

// Function to handle WebSocket connections and messages
wss.on("connection", async (ws, request) => {
  console.log("WebSocket connection established");

  // Extract sender and receiver IDs from query parameters
  const urlParams = new URLSearchParams(request.url.split("?")[1]);
  const senderId = urlParams.get("sender");
  console.log("sender",senderId);
  const receiverId = urlParams.get("receiver");
  console.log("receiver",receiverId);

  ws.on("message", async (data) => {
    try {
      const messageData = JSON.parse(data);
      // Save the message to the database
      const chatMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        message: messageData.message,
        timestamp: new Date(),
      });
      console.log(chatMessage);
      await chatMessage.save();
      // Broadcast the message to the sender and receiver
      ws.send(JSON.stringify(chatMessage));
      // Find the receiver's WebSocket and send the message
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
          const clientParams = new URLSearchParams(client.upgradeReq.url.split("?")[1]);
          if (clientParams.get("sender") === receiverId && clientParams.get("receiver") === senderId) {
            client.send(JSON.stringify(chatMessage));
            console.log("message sent to",clientParams.get("sender"));
          }
        }
      });
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

module.exports = { handleUpgrade, getChatHistory };
