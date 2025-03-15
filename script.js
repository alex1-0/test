// Supabase-Initialisierung
const supabaseUrl = 'https://mxxnouarxeonqinbpqic.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eG5vdWFyeGVvbnFpbmJwcWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDAzMTksImV4cCI6MjA1NzQ3NjMxOX0.K5D6m5G3_EXbiIZaOiPIkGFGeL3cQXCsGTjX1lTqiaA';
const supabase = supabase.createClient(supabaseUrl, supabaseKey); // Initialisierung an den Anfang stellen

// DOM-Elemente
const homeSection = document.getElementById('home');
const loginSection = document.getElementById('login');
const registerSection = document.getElementById('register');
const dashboardSection = document.getElementById('dashboard');
const settingsSection = document.getElementById('settings');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const settingsForm = document.getElementById('settingsForm');
const searchUserInput = document.getElementById('searchUser');
const userList = document.getElementById('userList');
const sendMoneyBtn = document.getElementById('sendMoneyBtn');
const transactionList = document.getElementById('transactionList');
const userBalance = document.getElementById('userBalance');
const settingsBtn = document.getElementById('settingsBtn');

let currentUser = null;

// Event-Listener
loginBtn.addEventListener('click', () => {
    homeSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

registerBtn.addEventListener('click', () => {
    homeSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();
    if (data) {
        currentUser = data;
        showDashboard();
    } else {
        alert('Anmeldung fehlgeschlagen');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const profilePicture = document.getElementById('registerProfilePicture').value;
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, password, profile_picture: profilePicture }])
        .select()
        .single();
    if (data) {
        currentUser = data;
        showDashboard();
    } else {
        alert('Registrierung fehlgeschlagen');
    }
});

settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('settingsName').value;
    const password = document.getElementById('settingsPassword').value;
    const { data, error } = await supabase
        .from('users')
        .update({ name, password })
        .eq('id', currentUser.id)
        .select()
        .single();
    if (data) {
        currentUser = data;
        alert('Einstellungen gespeichert');
    } else {
        alert('Fehler beim Speichern');
    }
});

searchUserInput.addEventListener('input', async () => {
    const searchTerm = searchUserInput.value;
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('name', `%${searchTerm}%`);
    if (data) {
        userList.innerHTML = data.map(user => `<li data-id="${user.id}">${user.name}</li>`).join('');
    }
});

sendMoneyBtn.addEventListener('click', async () => {
    const receiverId = userList.querySelector('li[data-id]')?.dataset.id;
    const amount = parseFloat(document.getElementById('sendAmount').value);
    if (receiverId && amount) {
        const { data, error } = await supabase
            .from('transactions')
            .insert([{ sender_id: currentUser.id, receiver_id: receiverId, amount }])
            .select();
        if (data) {
            updateBalance();
            loadTransactions();
        } else {
            alert('Fehler beim Senden');
        }
    }
});

settingsBtn.addEventListener('click', () => {
    dashboardSection.classList.add('hidden');
    settingsSection.classList.remove('hidden');
});

// Funktionen
function showDashboard() {
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    homeSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    updateBalance();
    loadTransactions();
}

async function updateBalance() {
    const { data, error } = await supabase
        .from('users')
        .select('balance')
        .eq('id', currentUser.id)
        .single();
    if (data) {
        userBalance.textContent = `${data.balance.toFixed(2)} €`;
    }
}

async function loadTransactions() {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('timestamp', { ascending: false })
        .limit(5);
    if (data) {
        transactionList.innerHTML = data.map(transaction => `
            <li>
                ${transaction.sender_id === currentUser.id ? 'Gesendet' : 'Erhalten'}: 
                ${transaction.amount.toFixed(2)} €
            </li>
        `).join('');
    }
}
