import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://mxxnouarxeonqinbpqic.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eG5vdWFyeGVvbnFpbmJwcWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDAzMTksImV4cCI6MjA1NzQ3NjMxOX0.K5D6m5G3_EXbiIZaOiPIkGFGeL3cQXCsGTjX1lTqiaA'
const supabase = createClient(supabaseUrl, supabaseKey)

document.getElementById('registerBtn').addEventListener('click', async function() {
    const email = prompt('Bitte geben Sie Ihre E-Mail ein:')
    const password = prompt('Bitte geben Sie Ihr Passwort ein:')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else {
        const { data: userData, error: userError } = await supabase
            .from('accounts')
            .insert([{ email, balance: 0.00 }])
        if (userError) alert(userError.message)
        else alert('Registrierung erfolgreich')
    }
})

document.getElementById('loginBtn').addEventListener('click', async function() {
    const email = prompt('Bitte geben Sie Ihre E-Mail ein:')
    const password = prompt('Bitte geben Sie Ihr Passwort ein:')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else alert('Erfolgreich angemeldet')
})

document.getElementById('sendBtn').addEventListener('click', async function() {
    const recipient = document.getElementById('recipient').value
    const amount = parseFloat(document.getElementById('amount').value)
    if (recipient && amount) {
        const { data: recipientData, error: recipientError } = await supabase
            .from('accounts')
            .select('*')
            .eq('email', recipient)
        if (recipientError) alert(recipientError.message)
        else if (recipientData.length > 0) {
            const { data: senderData, error: senderError } = await supabase
                .from('accounts')
                .select('balance')
                .eq('email', supabase.auth.user().email)
            if (senderError) alert(senderError.message)
            else if (senderData[0].balance >= amount) {
                const { error: updateSenderError } = await supabase
                    .from('accounts')
                    .update({ balance: senderData[0].balance - amount })
                    .eq('email', supabase.auth.user().email)
                const { error: updateRecipientError } = await supabase
                    .from('accounts')
                    .update({ balance: recipientData[0].balance + amount })
                    .eq('email', recipient)
                if (updateSenderError || updateRecipientError) alert('Fehler beim Senden')
                else {
                    alert(`€${amount} an ${recipientData[0].email} gesendet`)
                    loadTransactions()
                }
            } else alert('Nicht genug Guthaben')
        } else alert('Empfänger nicht gefunden')
    } else alert('Bitte geben Sie einen Empfänger und einen Betrag ein')
})

document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const profilePicture = document.getElementById('profilePicture').files[0]
    const { data, error } = await supabase
        .from('accounts')
        .update({ name, email, profile_picture_url: profilePicture ? URL.createObjectURL(profilePicture) : null })
        .eq('email', supabase.auth.user().email)
    if (error) alert(error.message)
    else alert('Profil gespeichert')
})

async function loadTransactions() {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_email', supabase.auth.user().email)
    if (error) alert(error.message)
    else {
        const transactionList = document.getElementById('transactionList')
        transactionList.innerHTML = data.map(transaction => `
            <li>
                <strong>${transaction.amount}€</strong> an ${transaction.recipient_email} am ${new Date(transaction.created_at).toLocaleDateString()}
            </li>
        `).join('')
    }
}

loadTransactions()
