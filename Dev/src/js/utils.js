//Load the contents of the url into the specified id
function loadElementHtml(element, url, callback = undefined) {
    $$.get(url, undefined, function (data) {
        $$(element).html(data);
        if (typeof callback !== 'undefined') { callback(); }
    });
}

//Gets html from a file
function getHtmlFromFile(url, callback) {
    $$.get(url, undefined, function (data) {
        callback(data);
    });
}

//Returns current locale/language
function getLocale() {
    return navigator.language || navigator.userLanguage;
}

//Converts epoch time to proper format in users local time
function formatTimeStamp(time, format = 'full') {
    let res;
    if (format === 'full') {
        res = new Date(parseFloat(time)).toLocaleDateString(getLocale(), { hour: "2-digit", minute: "2-digit" });
    } else if (format === 'date') {
        res = new Date(parseFloat(time)).toLocaleDateString(getLocale(), { hour: "2-digit", minute: "2-digit" }).split(', ')[0];
    } else if (format === 'time') {
        res = new Date(parseFloat(time)).toLocaleDateString(getLocale(), { hour: "2-digit", minute: "2-digit" }).split(', ')[1]
    } else if (format === 'chart') {
        let d = new Date(time),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        res = [year, month, day].join('-');
    }
    return res;
}

//If the body is longer than the max length, trim it
function shortenText(body, maxlength) {
    return (body.length > maxlength) ? body.substring(0, maxlength) + '...' : body;
}

//Generates a unique ID
function generateID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

//Get URL variables
function getURLParameter(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function openURL(url, useinappbrowser = false, displayurl = true) {
    if (checkIfDesktop()) {
        window.open(url, '_blank');
    } else {
        if (useinappbrowser) {
            if (displayurl) {
                window.open(url, '_blank', 'location=yes,EnableViewPortScale=yes');
            } else {
                window.open(url, '_blank', 'location=no,EnableViewPortScale=yes');
            }
        } else {
            window.open(url, '_system');
        }
    }
}

//Loads and appends a script to the body
function loadScript(url, callback = undefined) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                if (typeof callback !== 'undefined') {
                    callback();
                }
            }
        };
    } else {
        script.onload = function () {
            if (typeof callback !== 'undefined') {
                callback();
            }
        };
    }
    script.src = url;
    document.getElementsByTagName("body")[0].appendChild(script);
}

//Gets file name from input value
function getFileName(inpval) {
    return inpval.replace(/.*[\/\\]/, '');
}

//Temporary fix for firestore reads not executing after first read
//SEE: https://stackoverflow.com/questions/46899207/second-query-not-working-in-firebase-firestore
function unstickFirestoreDB() {
    firebase.firestore().collection('testcollection').doc('testdoc').set({ fix: Math.random() });
}