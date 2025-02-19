// Přihlašovací funkce
document.getElementById('login-button').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Přihlášení úspěšné
            console.log('Přihlášení úspěšné:', userCredential.user);
        })
        .catch((error) => {
            console.error('Chyba při přihlašování:', error.message);
        });
});

// Funkce pro nahrávání souborů
document.getElementById('upload-button').addEventListener('click', function() {
    const file = document.getElementById('file-input').files[0];
    const storageRef = firebase.storage().ref('uploads/' + file.name);
    storageRef.put(file).then((snapshot) => {
        console.log('Soubor nahrán úspěšně:', snapshot);
    }).catch((error) => {
        console.error('Chyba při nahrávání souboru:', error.message);
    });
});
