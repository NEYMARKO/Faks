var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
var warningText = "Ovo je tekst koji objašnjava kako ovaj napad funkcionira. Najvjerojatnije ću imati nekakvu formu preko koje ću izvršiti napad";
document.cookie = "COOKIE";
function handleDefense() {
    //console.log("IN HANDLE DEFENSE");
    var checkBox = $('.form-check-input');
    var defenseStatus = $('.defence-status');
    var instructionsParagraph = $('.instructions');
    //action.text("Uključi");
    //console.log("SHOULD HAVE CHANGED");
    if (checkBox.prop('checked')) {
        defenseStatus.text("Uključena");
        defenseStatus.css('color', 'green');
        instructionsParagraph.css('display', 'none');
    }
    else {
        defenseStatus.text("Isključena");
        instructionsParagraph.text(warningText);
        defenseStatus.css('color', 'red');
        instructionsParagraph.css('display', 'inline-block');
    }
}
$(document).ready(function () {
    var defenseStatus = $('.defense-status');
    defenseStatus.text("Uključena");
    defenseStatus.css('color', 'green');
    //console.log("ON LOAD");
    handleDefense();
});
