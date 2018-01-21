function initializeDeviceOptions() {
    if (app.device.iphone || app.device.android) {
        loadElementHtml('#mobilemenu', 'menu/mobilemenu.html', function () {
            updateMenuUserInfo();
        });
    } else {
        if (typeof desktopMenuView === 'undefined') {
            $$('<link rel="stylesheet" href="css/desktop.css">').insertAfter('#f7_colors');
            getHtmlFromFile('menu/desktopmenu.html', function (deskmenusrc) {
                $$('.views').prepend(deskmenusrc);
                desktopMenuView = app.addView('.view-left');
                //Display user info
                updateMenuUserInfo();
            });
        }
    }
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