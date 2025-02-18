interface Aria2cResponse {
    jsonrpc: '2.0';
    id: string;
    result?: any;
    error?: {
        code: number;
        message: string;
    };
}

// Get DOM elements (using type assertions for better type safety)
const addButton = document.getElementById('add-button') as HTMLButtonElement;
const urlInput = document.getElementById('url-input') as HTMLInputElement;
const resultArea = document.getElementById('result-aria') as HTMLPreElement;
const activeDownloadsButton = document.getElementById('active') as HTMLButtonElement;
const stoppedDownloadsButton = document.getElementById('stoped') as HTMLButtonElement;
const waitingDownloadsButton = document.getElementById('waiting') as HTMLButtonElement;

// Add Download Button Event Listener
addButton.addEventListener('click', () => {
    const url = urlInput.value;
    if (url) {
        // CORRECT: Use window.electronAPI, as defined in preload.ts
        window.electronAPI.addDownload(url);
    } else {
        console.warn('Please enter a URL.');
    }
});

// Active Downloads Button Event Listener
activeDownloadsButton.addEventListener('click', () => {
    window.electronAPI.tellActive();
});

// Stopped Downloads Button Event Listener
stoppedDownloadsButton.addEventListener('click', () => {
    window.electronAPI.tellStopped();
});

// Waiting Downloads Button Event Listener
waitingDownloadsButton.addEventListener('click', () => {
    window.electronAPI.tellWaiting();
});

// Listen for responses from the main process.  Use a named function.
function handleAria2cResponse(event: Electron.IpcRendererEvent, response: Aria2cResponse) {
    console.log('Received response from main process:', response);

    // Update the UI based on the response
    if (response.result) {
        resultArea.innerText = JSON.stringify(response.result, null, 2);
    } else if (response.error) {
        resultArea.innerText = `Error: ${response.error.message} (Code: ${response.error.code})`;
    }
}

// CORRECT: Use window.electronAPI to set up the listener
window.electronAPI.onAria2cResponse(handleAria2cResponse);

// Optional: Remove listener
window.addEventListener('beforeunload', () => {
    window.electronAPI.removeAria2cListener(handleAria2cResponse);
});



