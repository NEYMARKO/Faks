var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
var warningText = "Ovo je tekst koji objašnjava kako ovaj napad funkcionira. Najvjerojatnije ću imati nekakvu formu preko koje ću izvršiti napad";
document.cookie = "COOKIE";

function handleDefence() {
    //console.log("IN HANDLE DEFENSE");
    var checkBox = $('.xss-checkbox');
    var defenceStatus = $('.defence-status');
    var instructionsParagraph = $('.instructions');
    var defenceBoolForBack = $('.defence-bool');
    //action.text("Uključi");
    //console.log("SHOULD HAVE CHANGED");
    if (checkBox.prop('checked')) {
        defenceStatus.text("Uključena");
        defenceStatus.css('color', 'green');
        instructionsParagraph.css('display', 'none');
        defenceBoolForBack.val("true");
    }
    else {
        defenceStatus.text("Isključena");
        instructionsParagraph.text(warningText);
        defenceStatus.css('color', 'red');
        instructionsParagraph.css('display', 'inline-block');
        defenceBoolForBack.val("false");
    }
}
$(document).ready(function () {
    var defenceStatus = $('.defence-status');
    var defenceBoolForBack = $('.defence-bool');

    defenceStatus.text("Uključena");
    defenceStatus.css('color', 'green');
    defenceBoolForBack.val("true");

    //console.log("ON LOAD");
    //handleDefence();
});
