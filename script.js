import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://mxxnouarxeonqinbpqic.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eG5vdWFyeGVvbnFpbmJwcWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDAzMTksImV4cCI6MjA1NzQ3NjMxOX0.K5D6m5G3_EXbiIZaOiPIkGFGeL3cQXCsGTjX1lTqiaA'
const supabase = createClient(supabaseUrl, supabaseKey)

document.getElementById('loginBtn').addEventListener('click', async function() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'user@example.com',
        password: 'password'
    })
    if (error) alert(error.message)
    else alert('Erfolgreich angemeldet')
})

document.getElementById('registerBtn').addEventListener('click', async function() {
    const { data, error } = await supabase.auth.signUp({
        email: 'user@example.com',
        password: 'password'
    })
    if (error) alert(error.message)
    else alert('Registrierung erfolgreich')
})

document.getElementById('sendBtn').addEventListener('click', async function() {
    const recipient = document.getElementById('recipient').value
    if (recipient) {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('email', recipient)
        if (error) alert(error.message)
        else if (data.length > 0) alert(`Geld senden an ${data[0].name}`)
        else alert('Empfänger nicht gefunden')
    } else {
        alert('Bitte geben Sie einen Empfänger ein.')
    }
})

document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const profilePicture = document.getElementById('profilePicture').files[0]
    const { data, error } = await supabase
        .from('accounts')
        .upsert([{ name, email, profile_picture_url: profilePicture ? URL.createObjectURL(profilePicture) : null }])
    if (error) alert(error.message)
    else alert('Profil gespeichert')
})
