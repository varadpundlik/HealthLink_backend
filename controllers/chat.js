const WebSocket = require("ws");
const Message = require("../models/message"); // Assuming you have a Mongoose model for chats
const Patient = require("../models/patient");

const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.receiverId },
        { sender: req.params.receiverId, receiver: req.user.id },
      ],
    });
    let patient = await Patient.findOne({user:req.params.receiverId});
    if (!patient) {
      patient = await Patient.findOne({ user: req.user.id });
    }
    console.log(patient);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }
    const analytics = patient.analytics;
    res.status(200).json({chats:chatHistory,lts_analytics:analytics});
  } catch (error) {
    res.status(500).send("Error retrieving chat history");
  }
}

// WebSocket server instance
const wss = new WebSocket.Server({ noServer: true });
const clientsMap = new Map();
// Function to handle WebSocket connections and messages
wss.on("connection", async (ws, request) => {
  console.log("WebSocket connection established");

  ws.on("message", async (data) => {
    try {
      const messageData = JSON.parse(data);
      const { type, senderId, receiverId, message } = messageData;

      if (type === "init") {
        // Store the WebSocket connection and its associated sender ID
        clientsMap.set(ws, senderId);
        console.log("Client connected with ID:", senderId);
      } else if (type === "chat") {
        // Save the message to the database
        const chatMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          message: message,
          timestamp: new Date(),
        });
        await chatMessage.save();

        // Broadcast the message to the sender and receiver
        ws.send(JSON.stringify(chatMessage));
        wss.clients.forEach((client) => {
          const clientSenderId = clientsMap.get(client);
          if (client.readyState === WebSocket.OPEN && clientSenderId === receiverId) {
            client.send(chatMessage.message);
            console.log("Message sent to:", clientSenderId);
          }
        });
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    // Remove the closed WebSocket connection from the map
    clientsMap.delete(ws);
  });
});


// Function to handle WebSocket upgrade requests
function handleUpgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
}

module.exports = { handleUpgrade, getChatHistory };
