// In upload.js

// IMPORTANT: Use the 'anon' key, which is safe to expose in a browser.
const SUPABASE_URL = (window.ENV && window.ENV.SUPABASE_URL) || '';
const SUPABASE_ANON_KEY = (window.ENV && window.ENV.SUPABASE_ANON_KEY) || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables. Ensure env.js is loaded with SUPABASE_URL and SUPABASE_ANON_KEY.');
}

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

    const expectedUsername = (window.ENV && window.ENV.LOGIN_USERNAME) || '';
    const expectedPassword = (window.ENV && window.ENV.LOGIN_PASSWORD) || '';

    if (username === expectedUsername && password === expectedPassword) {
        loginSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
        loginError.textContent = '';
    } else {
        loginError.textContent = 'Invalid username or password.';
    }
});

// --- Upload Logic ---
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