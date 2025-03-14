document.getElementById('loginBtn').addEventListener('click', function() {
    alert('Anmelden ausgewählt');
});

document.getElementById('registerBtn').addEventListener('click', function() {
    alert('Registrieren ausgewählt');
});

document.getElementById('sendBtn').addEventListener('click', function() {
    const recipient = document.getElementById('recipient').value;
    const amount = document.getElementById('amount').value;
    if (recipient && amount) {
        alert(`€${amount} an ${recipient} gesendet`);
    } else {
        alert('Bitte geben Sie einen Empfänger und einen Betrag ein.');
    }
});

document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const profilePicture = document.getElementById('profilePicture').files[0];
    alert(`Profil gespeichert: ${name}, ${email}, ${profilePicture ? profilePicture.name : 'Kein Bild ausgewählt'}`);
});
