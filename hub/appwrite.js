// Make sure you include Appwrite SDK in your project
// <script src="https://cdn.jsdelivr.net/npm/appwrite/dist/appwrite.min.js"></script>

const sdk = new Appwrite();

sdk
  .setEndpoint('https://YOUR_APPWRITE_ENDPOINT/v1') // Your Appwrite Endpoint
  .setProject('698453930017e185ce48'); // Your project ID

let currentUserId = null;

// Function to set loader progress
function setLoadingProgress(percent) {
  document.querySelector('.loader').style.width = percent + '%';
}
