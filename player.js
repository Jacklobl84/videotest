// Player

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAGq-0JdEbZ5Y4XON0Rtyv9VmF9jk3cZQw",
    authDomain: "video-a2e07test.firebaseapp.com",
    databaseURL: "https://video-a2e07test.firebaseio.com",
    projectId: "video-a2e07test",
    storageBucket: "video-a2e07test.appspot.com",
    messagingSenderId: "856817564614",
    appId: "1:856817564614:web:084ed97f8a305dcad090c7"
};
firebase.initializeApp(firebaseConfig);
database = firebase.database();

const dbRef = database.ref('clicksviews');
dbRef.on('value', gotData, errData);

function errData(err) {
    console.log('Error');
    console.log(err);
}

function gotData(data) {
    const { countView, thumbUp, thumbDown } = data.val();
    state.countView = countView;
    state.upClicks = thumbUp;
    state.downClicks = thumbDown;
    updateDomElements();
}

const updateDomElements = () => {
    $("#thumbsUp").text("thumbsUp:" + state.upClicks);
    $("#thumbsDown").text("thumbsDown:" + state.downClicks);
    $(".viewsLabel").text(state.countView);
};

const updateFirebaseDb = () => {
    dbRef.update({
        thumbUp: state.upClicks,
        thumbDown: state.downClicks,
        countView: state.countView
    });
};

let state = {
    isVideoPlayed: false,
    countView: 0,
    downClicks: 0,
    upClicks: 0
}

$(document).ready(function () {
    $("#myVideo").on(
        "timeupdate",
        function () {
            onTrackedVideoFrame(this.currentTime);
        });
});

function onTrackedVideoFrame(currentTime) {
    $(".currentTime").text(currentTime);
}

document.getElementById("thumbsUp").onclick = function () { 
    state.upClicks += 1;
    updateDomElements();
    updateFirebaseDb();
};
document.getElementById("thumbsDown").onclick = function () { 
    state.downClicks += 1;
    updateDomElements();
    updateFirebaseDb();
};

$('#playPause').click(function () {
    if ($("#myVideo").get(0).paused) {
        $("#myVideo").get(0).play();
        if (!state.isVideoPlayed) {
            state.countView += 1;
            updateDomElements();
            updateFirebaseDb();
            state.isVideoPlayed = true;
        }
    }
    else {
        $("#myVideo").get(0).pause();
    }
});