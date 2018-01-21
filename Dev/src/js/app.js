//Exits the mobile app
function exitApp() {
    navigator.app.exitApp();
}

function loginUser() {
    if ($$('input[name=login_id]').val()) {
        updateCurrentUser($$('input[name=login_id]').val()).then(function (res) {
            if (res) {
                loadHomePage();
                updateMenuUserInfo();
                startGPS();
            } else {
                app.addNotification({message: 'That ID does not appear to exist.'});
            }
        });
    }
}

function updateMenuUserInfo() {
    $$('.menu_account_name').html(currentuser.name);
    $$('.menu_account_role').html(currentuser.type.charAt(0).toUpperCase() + currentuser.type.substring(1));
}

function updateCurrentUser(userid) {
    return new Promise(function (resolve, reject) {
        localStorage.setItem('restrainalert_userid', userid);
        firebase.firestore().collection('users').doc(userid).get().then(function (uinfo) {
            if (uinfo.exists) {
                currentuser = {
                    id: userid,
                    type: uinfo.data().type,
                    name: uinfo.data().name,
                    summary: uinfo.data().summary,
                    other: uinfo.data().other,
                    distance: uinfo.data().distance
                }
                updateMenuUserInfo();
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(function (error) {
            reject(error);
            app.alert('There was an error attempting to get the userinfo. Is the userid correct?', 'Error');
        });
    });
}

function setUserFromLocalStorage() {
    return new Promise(function (resolve, reject) {
        let localid = localStorage.getItem('restrainalert_userid');
        if (localid) {
            firebase.firestore().collection('users').doc(localid).get().then(function (uinfo) {
                if (uinfo.exists) {
                    currentuser = {
                        id: localid,
                        type: uinfo.data().type,
                        name: uinfo.data().name,
                        summary: uinfo.data().summary,
                        other: uinfo.data().other,
                        distance: uinfo.data().distance
                    }
                    updateMenuUserInfo();
                    resolve(true);
                    startGPS();
                } else {
                    resolve(false);
                }
            }).catch(function (error) {
                reject(error);
                app.alert('There was an error attempting to get the userinfo. Is the userid correct?', 'Error');
            });
        } else {
            resolve(false);
        }
    });
}

function getTempUsers() {
    firebase.firestore().collection('users').get().then(function (victs) {
        victs.forEach(function (vict) {
            console.log('id: ' + vict.id + ' data: ', vict.data());
        });
    });
}

function setupTempUsers() {
    firebase.firestore().collection('users').doc('a1z').set({
        name: 'Jackie Wang',
        type: 'victim',
        summary: 'Abused by his boyfriend',
        other: 'bb8',
        distance: 50
    });
    firebase.firestore().collection('users').doc('bb8').set({
        name: 'Chris Wong',
        type: 'abuser',
        summary: 'Beat his boyfriend every night',
        other: 'a1z',
        distance: 50
    });
}

function sendUserLocation() {
    return new Promise(function (resolve, reject) {
        getCurrentLocation().then(function (locdata) {
            let location = {
                latitude: locdata.coords.latitude,
                longitude: locdata.coords.longitude
            }
            currentlocation = location;
            firebase.firestore().collection('users').doc(currentuser.id).update({
                lastseen: firebase.firestore.FieldValue.serverTimestamp(),
                location
            }).then(function () {
                resolve();
            });
        });
    });
}


function getLocationOfOtherPerson() {
    return new Promise(function (resolve, reject) {
        if (currentuser && currentuser.other) {
            firebase.firestore().collection('users').doc(currentuser.other).get().then(function (oinfo) {
                if (oinfo.exists) {
                    if (oinfo.data().location) {
                        resolve(oinfo.data().location);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            });
        } else {
            reject();
        }
    });
}

function checkIfTooCloseToPerson() {
    return new Promise(function (resolve, reject) {
        getLocationOfOtherPerson().then(function (oloc) {
            if (oloc) {
                if (currentlocation) {
                    if (getDistanceInFeet(currentlocation.latitude, currentlocation.longitude, oloc.latitude, oloc.longitude) < currentuser.distance) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    reject();
                }
            } else {
                resolve(false);
            }
        }).catch(function (error) {
            reject();
        });
    });
}

function startGPS() {
    app.addNotification({message: 'Started GPS tracking...'});
    setInterval(function () {
        if (runsendinterval) {
            sendUserLocation();
        }
    }, 6000);
    setInterval(function () {
        if (runcheckinterval) {
            checkIfTooCloseToPerson().then(function (isclose) {
                if (isclose) {
                    if (currentuser.type === 'victim') {
                        loadWarningVictimPage();
                    } else {
                        //abuser
                        loadWarningAbuserPage();
                    }
                }
            });
        }
    }, 4000);
}

function signOut() {
    app.confirm('Are you sure you want to sign out?', 'Sign Out', function  () {
        localStorage.removeItem('restrainalert_userid');
        location.reload();
    });
}

function alertAuthorities() {
    app.alert('In this scenario, either 911 or some other operator would be dialed. They will also receive the users location in real time and the last time they were seen.', 'Alert Emergency Services');
}