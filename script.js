document.getElementById('loginBtn').addEventListener('click', function() {
  alert('Anmelden ausgewählt');
});

document.getElementById('registerBtn').addEventListener('click', function() {
  alert('Registrieren ausgewählt');
});

document.getElementById('sendBtn').addEventListener('click', function() {
  const recipient = document.getElementById('recipient').value;
  if (recipient) {
      alert(`Geld senden an ${recipient}`);
  } else {
      alert('Bitte geben Sie einen Empfänger ein.');
  }
});

document.getElementById('profileForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const profilePicture = document.getElementById('profilePicture').files[0];
  alert(`Profil gespeichert: ${name}, ${email}, ${profilePicture ? profilePicture.name : 'Kein Bild ausgewählt'}`);
});
