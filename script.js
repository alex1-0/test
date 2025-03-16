const supabaseUrl = "https://mxxnouarxeonqinbpqic.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eG5vdWFyeGVvbnFpbmJwcWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDAzMTksImV4cCI6MjA1NzQ3NjMxOX0.K5D6m5G3_EXbiIZaOiPIkGFGeL3cQXCsGTjX1lTqiaA";

// UI-Elemente abrufen
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authSection = document.getElementById("auth-section");
const dashboard = document.getElementById("dashboard");
const mainContent = document.getElementById("main-content");
const usernameDisplay = document.getElementById("username");
const balanceDisplay = document.getElementById("balance");

let currentUser = null;

// Login-/Registrierungs-Buttons korrekt anzeigen
loginBtn.addEventListener("click", () => {
    authSection.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    mainContent.classList.add("hidden");
});

registerBtn.addEventListener("click", () => {
    authSection.classList.remove("hidden");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    mainContent.classList.add("hidden");
});

// Registrierung mit vorheriger Überprüfung
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const profilePicture = document.getElementById("profile-picture").value;

    // Prüfen, ob E-Mail bereits existiert
    let { data: existingUser } = await fetchData(`/rest/v1/users?email=eq.${email}&select=id`);
    if (existingUser.length > 0) {
        alert("Diese E-Mail wird bereits verwendet.");
        return;
    }

    // Neuen Nutzer erstellen
    const { data, error } = await postData("/rest/v1/users", {
        name, email, password, profile_picture: profilePicture, balance: 0
    });

    if (error) {
        alert("Fehler beim Registrieren.");
    } else {
        alert("Erfolgreich registriert!");
        loginUser(email, password); // Direkt anmelden
    }
});

// Anmelden
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let { data: user } = await fetchData(`/rest/v1/users?email=eq.${email}&select=*`);

    if (user.length === 0 || user[0].password !== password) {
        alert("Falsche Anmeldedaten!");
        return;
    }

    loginUser(user[0]);
});

// Benutzer einloggen
function loginUser(user) {
    currentUser = user;
    usernameDisplay.innerText = user.name;
    balanceDisplay.innerText = user.balance.toFixed(2);

    // UI umschalten
    authSection.classList.add("hidden");
    mainContent.classList.add("hidden");
    dashboard.classList.remove("hidden");

    loadUserList();
}

// Hilfsfunktionen für API-Anfragen
async function fetchData(endpoint) {
    const res = await fetch(supabaseUrl + endpoint, { headers: { "apikey": supabaseKey } });
    return res.json();
}

async function postData(endpoint, body) {
    return await fetch(supabaseUrl + endpoint, { 
        method: "POST", 
        headers: { "Content-Type": "application/json", "apikey": supabaseKey },
        body: JSON.stringify(body) 
    }).then(res => res.json());
}
