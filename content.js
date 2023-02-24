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
async function connect() {
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
        const sendButton = Array.from(document.getElementsByClassName('artdeco-button artdeco-button--2 artdeco-button--primary ember-view ml1'));
        if(sendButton.length > 0){
          sendButton[0].click();
          console.log('Connection request sent');
          chrome.runtime.sendMessage({action: 'success'});
        }else{
          console.log('Unable to send connect request')
        }
      } else {
        console.log('No connect button found');
      }
    }, randomNumber(3000,6000));

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


// Function to generate random number between range
function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
