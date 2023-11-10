var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

function handleDefense() {
    //console.log("IN HANDLE DEFENSE");
    var checkBox = $('.attackCheck');
    var action = $('.action');
    //action.text("Uključi");
    console.log("SHOULD HAVE CHANGED");
    if (checkBox.prop('checked')) {
        action.text("Isključi");
    }
    else {
        action.text("Uključi");
    }
}
$(document).ready(function () {
    var action = $('.action');
    action.text("Uključi");
    //console.log("ON LOAD");
    handleDefense();
});
