app.onPageInit('*', function (page) {
    //If on desktop, remove mobile nav button
    if (checkIfDesktop()) {
        $$('.mobilemenubutton').remove();
    }
    if (page.name !== null) {
        setPageURL(page.name);
        updatePageTitle();
    }
});

app.onPageAfterBack('*', function (page) {
    if (mainView.activePage.name === 'panel-left') {
        setTimeout(function () {
            loadCoursesPage();
        }, 150);
    }
});

app.onPageInit('about', function (page) {
    $$('#about_appversion').html('Version ' + appversion);
});