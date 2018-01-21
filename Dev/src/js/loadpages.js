function checkIfLoggedInBeforeLoadingPage(callback) {
    if (firebase.auth().currentUser) {
        callback();
    } else {
        loadLoginPage();
    }
}

function loadAboutPage() {
    checkIfLoggedInBeforeLoadingPage(function () {
        mainView.router.loadPage('pages/about.html');
    });
}