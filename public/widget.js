// Create a button element
const chatButton = document.createElement("button");
chatButton.innerHTML = "<i class='fas fa-robot'></i>";
// Set styles for the button
chatButton.style.position = "fixed";
chatButton.style.bottom = "20px";
chatButton.style.right = "20px";
chatButton.style.backgroundColor = "#3498db";
chatButton.style.borderRadius = "50%";
chatButton.style.height = "60px";
chatButton.style.width = "60px";
chatButton.style.color = "#fff";
chatButton.style.border = "none";
chatButton.style.padding = "10px";
chatButton.style.cursor = "pointer";
chatButton.style.fontSize = "20px"
chatButton.style.boxShadow = "rgb(110 104 104 / 38%) 0px 4px 10px"

// Append the button to the body
document.body.appendChild(chatButton);

// Create a div element for the chat widget
const chatWidget = document.createElement("div");
chatWidget.style.display = "none";
chatWidget.style.position = "fixed";
chatWidget.style.bottom = "50px";
chatWidget.style.right = "20px";
chatWidget.style.width = "300px";
chatWidget.style.height = "400px"; // Increased height
chatWidget.style.border = "1px solid #ccc";
chatWidget.style.backgroundColor = "#fff";
chatWidget.style.zIndex = "999";
chatWidget.style.margin = "10px"; // Added margin
chatWidget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)"; // Added soft shadow

// Sample messages array
const messages = [
  { user: "User", text: "Hello!" },
  { user: "Bot", text: "Hi there! How can I help you?" },
];

// Function to display messages in the chat widget
function displayMessages() {
  const chatBody = document.getElementById("chatBody");
  chatBody.innerHTML = "";

  messages.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = `${message.text}`;
    const iconClass = message.user === 'User' ? 'fas fa-user' : 'fas fa-robot';
//     messageDiv.innerHTML = `
//     <i class="${iconClass}"></i>
//     <span>${message.text}</span>
//   `;
    messageDiv.style.padding = "8px";
    messageDiv.style.borderRadius =
      message.user === "User" ? "5px 5px 5px 0" : "5px 5px 0 5px";
    messageDiv.style.backgroundColor =
      message.user === "User" ? "#3498db" : "#f1f1f1";
    messageDiv.style.color = message.user === "User" ? "#fff" : "#333";
    messageDiv.style.marginBottom = "8px";
    messageDiv.style.maxWidth = "70%";
    messageDiv.style.wordWrap = "break-word";
    messageDiv.style.alignSelf =
      message.user === "User" ? "flex-end" : "flex-start";

    chatBody.appendChild(messageDiv);
  });

  // Scroll to the bottom to show the latest message
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Set up the chat widget content (you can customize this part)
chatWidget.innerHTML = `
  <div style="background-color: #3498db; color: #fff; padding: 10px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center;">
    <span>Word AI</span>
    <button onclick="closeChat()" style="background: none; border: none; color: #fff; cursor: pointer;">&times;</button>
  </div>
  <div id="chatBody" style="max-height: 300px; overflow-y: auto; padding: 10px;     display: flex;
  flex-direction: column;"></div>
  <div style="position: absolute;padding: 10px;border: 1px solid #dadada;padding: 0;margin: 4px;border-radius: 50px;bottom: 0;right: 0;left: 0;">
    <input onfocus="changeBorderStyle(this)" type="text" id="messageInput" placeholder="Type your message..." style="padding: 8px;border-radius: 50px;border: none;width: 80%;">
    <button id="sendButton" onclick="sendMessage()" style="position: absolute;right: 0px;top: 50%;transform: translateY(-50%);background-color: #3498db;color: #fff;border: none;/* padding: 8px; */cursor: pointer;border-radius: 50%;height: 30px;width: 30px;display: flex;justify-content: center;align-items: center;">
      <i class="fas fa-paper-plane"></i> <!-- Font Awesome send icon -->
    </button>
  </div>
`;

// Append the chat widget to the body
document.body.appendChild(chatWidget);

// Function to send a new message
async function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const userMessage = messageInput.value.trim();

  if (userMessage !== "") {
    // Disable the send button while making the API call
    const sendButton = document.getElementById("sendButton");
    sendButton.disabled = true;
    sendButton.style.backgroundColor = '#d8d8d8';
    sendButton.style.color = '#333';
    sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; // Loading spinner icon

    // Simulate an API call (replace with your actual API endpoint)
    try {
      const response = await fetch("https://word-ai-lovat.vercel.app/api/v3/model/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
             question: userMessage,
             newChat: false,
             conversationID: "NothAvailable"
         }),
      });

      if (response.ok) {
        // Successfully sent message
        const botMessage = await response.json();
        console.log(botMessage);
        messages.push({ user: "User", text: userMessage });
        messages.push({ user: "Bot", text: botMessage?.data?.answer });

        // Display messages
        displayMessages();
      } else {
        // Handle API error
        console.error("Error sending message:", response.status);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error:", error);
    } finally {
      // Enable the send button after the API call is complete
      sendButton.disabled = false;
      sendButton.style.backgroundColor = "#3498db";
      sendButton.style.color = "#fff";
      sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>'; // Revert to paper plane icon

    //   isLoading = false; // Reset loading state

      // Clear the input field
      messageInput.value = "";
    }
  }
}

// Display initial messages
displayMessages();

function changeBorderStyle(element) {
  element.style.outline = "none";
}

// Show/hide the chat widget when the button is clicked
chatButton.addEventListener("click", () => {
  chatWidget.style.display =
    chatWidget.style.display === "none" ? "block" : "none";
});

// Function to close the chat widget
function closeChat() {
  chatWidget.style.display = "none";
}
