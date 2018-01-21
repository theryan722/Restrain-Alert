//Uploads a file to the specified path
function uploadFile(loc, filesrc, mimetype = 'application/zip', callback = undefined) {
    var storageRef = firebase.storage().ref(loc).put(filesrc, { contentType: mimetype });
    storageRef.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
        //var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                app.showIndicator();
                break;
        }
    }, function (error) {
        app.hideIndicator();
        app.alert('There was an error attempting to upload the file.', 'Error');
        return;
    }, function () {
        // Upload completed successfully, now we can get the download URL
        app.hideIndicator();
        if (typeof callback !== 'undefined') {
            callback(storageRef.snapshot.downloadURL);
        }
    });
}

//Uploads an image to the specified path
function uploadImage(loc, img, callback = undefined) {
    var storageRef = firebase.storage().ref(loc).put(img, { contentType: 'image/jpeg' });
    storageRef.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
        //var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                app.showIndicator();
                break;
        }
    }, function (error) {
        app.hideIndicator();
        app.alert('There was an error attempting to upload the image.', 'Error');
        return;
    }, function () {
        // Upload completed successfully, now we can get the download URL
        app.hideIndicator();
        if (typeof callback !== 'undefined') {
            callback(storageRef.snapshot.downloadURL);
        }
    });
}