// Importiere Supabase-Client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://mxxnouarxeonqinbpqic.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eG5vdWFyeGVvbnFpbmJwcWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDAzMTksImV4cCI6MjA1NzQ3NjMxOX0.K5D6m5G3_EXbiIZaOiPIkGFGeL3cQXCsGTjX1lTqiaA'
const supabase = createClient(supabaseUrl, supabaseKey)

// Registrierungsfunktion
document.getElementById('registerBtn').addEventListener('click', async function() {
    const email = prompt('Bitte geben Sie Ihre E-Mail ein:')
    const password = prompt('Bitte geben Sie Ihr Passwort ein:')
    if (email && password) {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
            alert(`Fehler bei der Registrierung: ${error.message}`)
        } else {
            alert('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail zur Bestätigung.')
        }
    } else {
        alert('Bitte geben Sie eine E-Mail und ein Passwort ein.')
    }
})

// Anmeldefunktion
document.getElementById('loginBtn').addEventListener('click', async function() {
    const email = prompt('Bitte geben Sie Ihre E-Mail ein:')
    const password = prompt('Bitte geben Sie Ihr Passwort ein:')
    if (email && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            alert(`Fehler bei der Anmeldung: ${error.message}`)
        } else {
            alert('Erfolgreich angemeldet!')
            // Lade Benutzerdaten oder aktualisiere die UI
        }
    } else {
        alert('Bitte geben Sie eine E-Mail und ein Passwort ein.')
    }
})

// Geld senden
document.getElementById('sendBtn').addEventListener('click', async function() {
    const recipient = document.getElementById('recipient').value
    const amount = parseFloat(document.getElementById('amount').value)
    if (recipient && amount) {
        const { data: recipientData, error: recipientError } = await supabase
            .from('accounts')
            .select('*')
            .eq('email', recipient)
        if (recipientError) {
            alert(`Fehler beim Suchen des Empfängers: ${recipientError.message}`)
        } else if (recipientData.length > 0) {
            const { data: senderData, error: senderError } = await supabase
                .from('accounts')
                .select('balance')
                .eq('email', supabase.auth.user()?.email)
            if (senderError) {
                alert(`Fehler beim Abrufen des Guthabens: ${senderError.message}`)
            } else if (senderData[0].balance >= amount) {
                const { error: updateSenderError } = await supabase
                    .from('accounts')
                    .update({ balance: senderData[0].balance - amount })
                    .eq('email', supabase.auth.user()?.email)
                const { error: updateRecipientError } = await supabase
                    .from('accounts')
                    .update({ balance: recipientData[0].balance + amount })
                    .eq('email', recipient)
                if (updateSenderError || updateRecipientError) {
                    alert('Fehler beim Senden des Geldes.')
                } else {
                    alert(`€${amount} an ${recipientData[0].email} gesendet.`)
                    loadTransactions()
                }
            } else {
                alert('Nicht genug Guthaben.')
            }
        } else {
            alert('Empfänger nicht gefunden.')
        }
    } else {
        alert('Bitte geben Sie einen Empfänger und einen Betrag ein.')
    }
})

// Profil bearbeiten
document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const profilePicture = document.getElementById('profilePicture').files[0]
    if (name && email) {
        const { data, error } = await supabase
            .from('accounts')
            .update({ name, email, profile_picture_url: profilePicture ? URL.createObjectURL(profilePicture) : null })
            .eq('email', supabase.auth.user()?.email)
        if (error) {
            alert(`Fehler beim Speichern des Profils: ${error.message}`)
        } else {
            alert('Profil erfolgreich gespeichert.')
        }
    } else {
        alert('Bitte geben Sie einen Namen und eine E-Mail ein.')
    }
})

// Transaktionen laden
async function loadTransactions() {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_email', supabase.auth.user()?.email)
    if (error) {
        alert(`Fehler beim Laden der Transaktionen: ${error.message}`)
    } else {
        const transactionList = document.getElementById('transactionList')
        transactionList.innerHTML = data.map(transaction => `
            <li>
                <strong>${transaction.amount}€</strong> an ${transaction.recipient_email} am ${new Date(transaction.created_at).toLocaleDateString()}
            </li>
        `).join('')
    }
}

// Initial Transaktionen laden
loadTransactions()
