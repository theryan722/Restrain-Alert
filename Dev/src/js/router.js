function goBack() {
    return new Promise(function (resolve, reject) {
        if ($$('.modal-in').length > 0) {
            app.closeModal();
        } else if ($$('.panel-left').hasClass('active')) {
            app.closePanel();
        } else {
            if (mainView.activePage.name === 'courses') {
                exitApp();
            } else {
                mainView.router.back();
            }
        }
        resolve();
    });
}

function onAndroidBackKeyDown() {
    goBack();
}

function onAndroidMenuKeyDown() {
    app.openPanel('left');
}

//Cleans the url of hashes and search parameters
function cleanURL() {
    return new Promise(function (resolve, reject) {
        let nurl = '';
        if (window.location.hash) {
            nurl = window.location.href.substr(0, window.location.href.indexOf('#'));
        }
        nurl = nurl.substr(0, window.location.href.indexOf('?'));
        history.pushState('', document.title, nurl);
        resolve();
    });
}

//Sets the page url
function setPageURL(pagename, urlparams = undefined) {
    cleanURL().then(function () {
        switch (pagename) {
            case 'course_professormenu':
            case 'course_studentmenu':
            case 'panel-left':
            case 'desktopmainmenu':
                break;
            case 'coursehome':
                location.hash = pagename;
                setTimeout(function () {
                    setURLParameters([{ paramname: 'id', paramvalue: currentcourse.courseid }]);
                }, 300);
                break;
            default:
                location.hash = pagename;
                if (typeof urlparams !== 'undefined') {
                    setTimeout(function () {
                        setURLParameters(urlparams);
                    }, 300);
                }
        }
    });
}

//Set and add parameters to the url
function setURLParameters(paramobjs) {
    let nurl = new URL(window.location.href);
    let first = true;
    for (let key in paramobjs) {
        if (first) {
            nurl.searchParams.set(paramobjs[key].paramname, paramobjs[key].paramvalue);
            first = false;
        } else {
            nurl.searchParams.append(paramobjs[key].paramname, paramobjs[key].paramvalue);
        }
    }
    history.pushState('', document.title, nurl.toString());
}

function updatePageTitle(title = '') {
    if (title) {
        document.title = title;
    } else {
        let last_title = '';
        $$('.pagetitle').each(function (index, e) {
            last_title = $$(e).text();
        });
        document.title = last_title;
    }
}

//Runs commands or loads pages based on hash and search parameters
function checkIfUserInitialized() {
    if (currentuser) {
        loadHomePage();
    } else {
        setUserFromLocalStorage().then(function (uset) {
            if (uset) {
                loadHomePage();
            } else {
                loadLoginPage();
            }
        });
    }
}

$$(window).on('hashchange', function () {
    if (window.location.hash === '#panel-left') {
        loadHomePage();
    }
});