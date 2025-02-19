console.log("Script loaded");

// Přihlašovací funkce
document.getElementById('login-button').addEventListener('click', function() {
    console.log("Login button clicked");
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("Email: " + email + " Password: " + password);

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Přihlášení úspěšné
            console.log('Přihlášení úspěšné:', userCredential.user);
            document.getElementById('upload-form').style.display = 'block';
            document.getElementById('login-form').style.display = 'none';
            loadVideos();
        })
        .catch((error) => {
            console.error('Chyba při přihlašování:', error.message);
        });
});

// Funkce pro nahrávání souborů
document.getElementById('upload-button').addEventListener('click', function() {
    console.log("Upload button clicked");
    const file = document.getElementById('file-input').files[0];
    const storageRef = firebase.storage().ref('videos/' + file.name);
    storageRef.put(file).then((snapshot) => {
        console.log('Video nahráno úspěšně:', snapshot);
        saveVideoInfo(file.name);
    }).catch((error) => {
        console.error('Chyba při nahrávání videa:', error.message);
    });
});

// Uložení informací o videu do Firestore
function saveVideoInfo(fileName) {
    const user = firebase.auth().currentUser;
    db.collection("videos").add({
        userId: user.uid,
        fileName: fileName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then((docRef) => {
        console.log("Informace o videu uloženy s ID: ", docRef.id);
        loadVideos();
    }).catch((error) => {
        console.error("Chyba při ukládání informací o videu: ", error);
    });
}

// Načítání a zobrazování videí
function loadVideos() {
    console.log("Load videos called");
    const videoList = document.getElementById('video-list');
    videoList.innerHTML = '';

    db.collection("videos").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const videoData = doc.data();
            const videoElement = document.createElement('div');
            videoElement.innerHTML = `
                <video width="320" height="240" controls>
                    <source src="https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/videos%2F${videoData.fileName}?alt=media" type="video/mp4">
                </video>
                <p>Od: ${videoData.userId}</p>
                <button onclick="likeVideo('${doc.id}')">Like</button>
                <button onclick="subscribeUser('${videoData.userId}')">Odběr</button>
            `;
            videoList.appendChild(videoElement);
        });
    }).catch((error) => {
        console.error('Chyba při načítání videí:', error.message);
    });
}

// Funkce pro likování videí
function likeVideo(videoId) {
    const user = firebase.auth().currentUser;
    db.collection("likes").add({
        userId: user.uid,
        videoId: videoId
    }).then((docRef) => {
        console.log("Video likováno s ID: ", docRef.id);
    }).catch((error) => {
        console.error("Chyba při likování videa: ", error);
    });
}

// Funkce pro odběr uživatelů
function subscribeUser(userId) {
    const user = firebase.auth().currentUser;
    db.collection("subscriptions").add({
        subscriberId: user.uid,
        subscribedToId: userId
    }).then((docRef) => {
        console.log("Uživatel odebírán s ID: ", docRef.id);
    }).catch((error) => {
        console.error("Chyba při odběru uživatele: ", error);
    });
}
