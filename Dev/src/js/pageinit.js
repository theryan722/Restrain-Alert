app.onPageInit('*', function (page) {
    if (page.name !== null) {
        setPageURL(page.name);
        updatePageTitle();
    }
});

app.onPageAfterBack('*', function (page) {
    if (mainView.activePage.name === 'panel-left') {
        setTimeout(function () {
            loadHomePage();
        }, 150);
    }
});

app.onPageInit('about', function (page) {
    $$('#about_appversion').html('Version ' + appversion);
});

app.onPageInit('warning_victim', function (page) {
    runcheckinterval = false;
});

app.onPageInit('warning_abuser', function (page) {
    runcheckinterval = false;
});

app.onPageBeforeRemove('warning_victim', function (page) {
    runcheckinterval = true;
});

app.onPageBeforeRemove('warning_abuser', function (page) {
    runcheckinterval = true;
});