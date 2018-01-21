var currentuser; //Current user data
var desktopMenuView = undefined; //View for desktop menu
var iscordova = false; //If cordova
var loading = false; //Used to determine if infinite scroll or pull to refresh is loading
//==================================
var currentlocation; //Current location of user
//==================================
const appversion = '1.0.0'; //Version of the app
const modalcancelbutton = {
    text: '<span style="color: #f44336;">Cancel</span>',
    close: true
} //Cancel button for dialogs