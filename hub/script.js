// Show loader during fetch
async function fetchWithLoading(fetchFunc) {
  setLoadingProgress(0);
  // simulate progress
  for (let i = 0; i <= 100; i+=20) {
    setLoadingProgress(i);
    await new Promise(r => setTimeout(r, 100));
  }
  const result = await fetchFunc();
  setLoadingProgress(100);
  setTimeout(() => { setLoadingProgress(0); }, 300);
  return result;
}

// Register
async function register() {
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    await sdk.account.create('unique()', email, password, name);
    alert('Registration successful! Please log in.');
  } catch (e) {
    alert('Error: ' + e.message);
  }
}

// Login
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const session = await sdk.account.createSession(email, password);
    currentUserId = session.$id;
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('forum-section').style.display = 'block';
    loadTopics();
  } catch (e) {
    alert('Login failed: ' + e.message);
  }
}

// Logout
async function logout() {
  await sdk.account.deleteSession('current');
  currentUserId = null;
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('forum-section').style.display = 'none';
}

// Load Topics
async function loadTopics() {
  const response = await fetchWithLoading(async () => {
    return await sdk.database.listDocuments('YOUR_DATABASE_ID', 'topics');
  });
  const topicsContainer = document.getElementById('topics');
  topicsContainer.innerHTML = '';

  response.documents.forEach(topic => {
    const div = document.createElement('div');
    div.className = 'topic';
    div.innerHTML = `<h3>${topic.title}</h3><div class="responses" id="responses-${topic.$id}"></div>
                     <input type="text" placeholder="Your response..." id="response-input-${topic.$id}" />
                     <button class="response-btn" onclick="postResponse('${topic.$id}')">Respond</button>`;
    div.onclick = () => toggleResponses(topic.$id);
    topicsContainer.appendChild(div);
    loadResponses(topic.$id);
  });
}

async function toggleResponses(topicId) {
  const responsesDiv = document.getElementById(`responses-${topicId}`);
  responsesDiv.style.display = responsesDiv.style.display === 'block' ? 'none' : 'block';
}

// Load responses for a topic
async function loadResponses(topicId) {
  const response = await sdk.database.listDocuments('YOUR_DATABASE_ID', 'responses', [
    sdk.Query.equal('topicId', topicId)
  ]);

  const responsesDiv = document.getElementById(`responses-${topicId}`);
  responsesDiv.innerHTML = '';

  response.documents.forEach(res => {
    const div = document.createElement('div');
    div.className = 'response';
    div.innerText = res.responseText;
    responsesDiv.appendChild(div);
  });
}

// Post response
async function postResponse(topicId) {
  const input = document.getElementById(`response-input-${topicId}`);
  const text = input.value;
  if (!text) return;

  await sdk.database.createDocument('YOUR_DATABASE_ID', 'responses', 'unique()', {
    topicId,
    userId: currentUserId,
    responseText: text,
    timestamp: new Date().toISOString()
  });
  input.value = '';
  loadResponses(topicId);
}

// Initialize with predefined topics (if not already created)
async function initTopics() {
  const existing = await sdk.database.listDocuments('YOUR_DATABASE_ID', 'topics');
  if (existing.total === 0) {
    const topics = [
      "Tips for a Date on Valentine's",
      "How to Have a Great Day",
      "Flowers to Buy",
      "Tea Parties Ideas",
      "Best Candy"
    ];
    for (const title of topics) {
      await sdk.database.createDocument('YOUR_DATABASE_ID', 'topics', 'unique()', { title });
    }
  }
}

// Run initial setup
initTopics();
