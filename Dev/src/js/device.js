function initializeDeviceOptions() {
    loadElementHtml('#mobilemenu', 'menu/mobilemenu.html', function () {

    });
}

//Checks if on ios and mobile app
function checkIfIOSApp() {
    return app.device.iphone && iscordova;
}

function checkIfIOS() {
    return app.device.iphone;
}

function checkIfAndroid() {
    return app.device.android;
}

function checkIfDesktop() {
    return (!checkIfIOS() && !checkIfAndroid());
}

function checkIfMobile() {
    if (checkIfIOS() || checkIfAndroid()) {
        return true;
    } else {
        return false;
    }
}