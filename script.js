// Přihlašovací funkce
document.getElementById('login-button').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Přihlášení úspěšné
            console.log('Přihlášení úspěšné:', userCredential.user);
            document.getElementById('upload-form').style.display = 'block';
            document.getElementById('login-form').style.display = 'none';
        })
        .catch((error) => {
            console.error('Chyba při přihlašování:', error.message);
        });
});

// Funkce pro nahrávání souborů
document.getElementById('upload-button').addEventListener('click', function() {
    const file = document.getElementById('file-input').files[0];
    const storageRef = firebase.storage().ref('videos/' + file.name);
    storageRef.put(file).then((snapshot) => {
        console.log('Video nahráno úspěšně:', snapshot);
    }).catch((error) => {
        console.error('Chyba při nahrávání videa:', error.message);
    });
});
