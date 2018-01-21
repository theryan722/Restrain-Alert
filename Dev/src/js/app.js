//Exits the mobile app
function exitApp() {
    navigator.app.exitApp();
}

function loginUser() {
    if ($$('input[name=login_id]').val()) {
        updateCurrentUser($$('input[name=login_id]').val(), $$('#login_type').val()).then(function () {

        });
    }
}

function updateCurrentUser(userid, usertype) {
    return new Promise(function (resolve, reject) {
        localStorage.setItem('restrainalert_userid', userid);
        localStorage.setItem('restrainalert_usertype', usertype);
        firebase.firestore().collection((usertype === 'victim' ? 'victims' : 'abusers')).doc(userid).get().then(function (uinfo) {
            if (uinfo.exists) {
                currentuser = {
                    id: userid,
                    type: usertype,
                    name: uinfo.data().name,
                    summary: uinfo.data().summary
                }
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
        let localtype = localStorage.getItem('retstrainalert_usertype');
        if (localid) {
            firebase.firestore().collection((localtype === 'victim' ? 'victims' : 'abusers')).doc(localid).get().then(function (uinfo) {
                if (uinfo.exists) {
                    currentuser = {
                        id: localid,
                        type: localtype,
                        name: uinfo.data().name,
                        summary: uinfo.data().summary
                    }
                    resolve(true);
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
        summary: 'Abused by his boyfriend'
    });
    firebase.firestore().collection('users').doc('bb8').set({
        name: 'Chris Wong',
        type: 'abuser',
        summary: 'Beat his boyfriend every night'
    });
}

function sendUserLocation() {
    return new Promise(function (resolve, reject) {
        getCurrentLocation().then(function (locdata) {
            let location = {
                latitude: locdata.coords.latitude,
                longitude: locdata.coords.longitude
            }
            firebase.firestore().collection('users').doc(currentuser.id).update({
                lastseen: firebase.firestore.FieldValue.serverTimestamp(),
                location
            }).then(function () {
                resolve();
            });
        });
    });
}