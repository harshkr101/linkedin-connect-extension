let intervalId;

// Store the timeout IDs in an array
const timeouts = [];

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
      connect();
  } else if (request.action === 'stop') {
    stop();
  }
});

// Function to send connection request
function connect() {
  console.log('Sending connection request');
  //get all buttons on page
  const buttons = document.getElementsByClassName('artdeco-button artdeco-button--2 artdeco-button--secondary ember-view');
  // filter for buttons with Connect text
  const connectButtons = Array.from(buttons).filter(button => button.textContent.includes('Connect'));
  // loop over the connect buttons
  for (let i = 0; i < connectButtons.length; i++) {
    const connectButton = connectButtons[i];
    const timeoutId = setTimeout(() => {
      if (connectButton) {
        connectButton.click();
        const sendButton = document.getElementsByClassName('artdeco-button artdeco-button--2 artdeco-button--primary ember-view ml1')
        console.log('Send button',sendButton);
        if(sendButton){
          sendButton.click();
          console.log("Send request for ",i+1);
          console.log('Connection request sent');
          chrome.runtime.sendMessage({action: 'success'});
        }
      } else {
        console.log('No send button found');
      }
    }, 5000 * i+1); // Use a different delay for each button

    // Add the timeout ID to the array
    timeouts.push(timeoutId);
  }
}

// Function to stop sending connection requests
function stop() {
  chrome.runtime.sendMessage({action: 'stop'});
  console.log('Stopping connection requests');
  if(timeouts.length > 0) {
      // Clear all pending timeouts
  timeouts.forEach(timeoutId => clearTimeout(timeoutId));
  }
  return;
}
