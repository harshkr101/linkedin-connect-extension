let connectCount = 0;
let isRunning = false;

const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const statusText = document.getElementById('status');
const timerText = document.getElementById('timer');

stopButton.hidden = true;


function start() {
  isRunning = true;
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'start'}, (response) => {
      console.log(response.message);
    });
  });
}

function stop() {
  isRunning = false;
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'stop'}, (response) => {
      console.log(response.message);
    });
  });
}

startButton.addEventListener('click', () => {
  start();
  startButton.disabled = true;
  stopButton.disabled = false;
  startButton.hidden = true;
  stopButton.hidden = false;
  statusText.textContent = 'Sending connection requests...';
});

stopButton.addEventListener('click', () => {
  stop();
  startButton.disabled = false;
  stopButton.disabled = true;
  startButton.hidden = false;
  stopButton.hidden = true;
  statusText.textContent = '';
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'success') {
    connectCount++;
    statusText.textContent = `Requests sent: ${connectCount}`;
  } else if (request.action === 'stop') {
    stop();
  }
});
