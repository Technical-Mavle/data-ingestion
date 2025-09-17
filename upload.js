// In upload.js

// IMPORTANT: Use the 'anon' key, which is safe to expose in a browser.
const SUPABASE_URL = 'https://oqeribgmlhatwezqutvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZXJpYmdtbGhhdHdlenF1dHZsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODEyNjUxMiwiZXhwIjoyMDczNzAyNTEyfQ.wWJK5VVTXXsEb8EEYHa4KcMxu6XjP2KB5UBH9fppsIc';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Get all HTML elements ---
// Login elements
const loginSection = document.getElementById('loginSection');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const loginError = document.getElementById('loginError');

// Upload elements
const uploadSection = document.getElementById('uploadSection');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const statusDiv = document.getElementById('status');

// --- Login Logic ---
loginButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Check against the hardcoded credentials
    if (username === 'prasannapal21' && password === 'asdfasdf') {
        // If correct, hide login and show uploader
        loginSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
    } else {
        // If incorrect, show an error message
        loginError.textContent = 'Invalid username or password.';
    }
});

// --- Upload Logic (no changes needed here) ---
uploadButton.addEventListener('click', async () => {
    const file = fileInput.files[0];

    if (!file) {
        statusDiv.textContent = 'Please select a file to upload.';
        return;
    }

    statusDiv.textContent = `Uploading ${file.name}...`;

    const { data, error } = await sb
        .storage
        .from('raw-uploads')
        .upload(file.name, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) {
        statusDiv.textContent = `Upload failed: ${error.message}`;
        console.error(error);
    } else {
        statusDiv.textContent = `Successfully uploaded ${file.name}! Processing will start automatically.`;
        console.log('Upload successful:', data);
    }
});