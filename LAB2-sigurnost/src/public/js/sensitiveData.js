var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
var warningText = "OPREZ! ISKLJUČENA VAM JE OBRANA!";
var attackInstructions = "Upute: Nakon unosa korisničkih podataka u input-ove, podaci se pohranjuju u local storage. U slučaju kada obrana nije aktivna,"
    + " podaci se predaju u originalnom obliku (čisti tekst), a kada je obrana aktivna, lozinka se kriptira. Ukoliko se obrana isključi/uključi potrebno je"
    + " ponovno kliknuti na gumb za spremanje podataka, prije prikaza pohranjenih podataka kako bi promjene bile vidljive.";

document.cookie = "COOKIE";

function submitData() {
    var userName = $('#userName').val();
    var password = $('#password').val();
    var shouldDefend = $('.defence-bool').val();
    var data = {};

    console.log("USERNAME: " + userName);
    console.log("password: " + password);
    console.log("shouldDefend: " + shouldDefend);

    if (shouldDefend === "true") {
        data = { userName: userName, password: password, shouldEncrypt: true };
    } else {
        data = { userName: userName, password: password, shouldEncrypt: false };
    }

    $.ajax({
        url: '/sensitive-data/submit',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log('Success:');
            var userObject = {userName: response.userName, password: response.password};
            localStorage.setItem("userData", JSON.stringify(userObject));
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

function getData() {
    var userInfoDiv = $('.user-info');
    var userObject = JSON.parse(localStorage.getItem('userData'));
    var userName = userObject.userName;
    var password = userObject.password;
    userInfoDiv.text(`Korisničko ime: ${userName} Lozinka: ${password}`);
}
function disableVisibility() {
    var instructionsParagraph = $('.instructions');
    var attackList = $('.attack-types');

    instructionsParagraph.css('display', 'none');
    attackList.css('display', 'none');
}

function enableVisibility() {
    var instructionsParagraph = $('.instructions');
    var attackList = $('.attack-types');

    instructionsParagraph.text(warningText);
    instructionsParagraph.css('display', 'inline-block');


    attackList.css('display', 'inline-block');
}

function handleDefence() {
    var checkBox = $('.xss-checkbox');
    var defenceStatus = $('.defence-status');
    var defenceBoolForBack = $('.defence-bool');

    if (checkBox.prop('checked')) {
        defenceStatus.text("Uključena");
        defenceStatus.css('color', 'green');
        defenceBoolForBack.val("true");
        disableVisibility();
    }
    else {
        defenceStatus.text("Isključena");
        defenceStatus.css('color', 'red');
        defenceBoolForBack.val("false");
        enableVisibility();
    }
}
$(document).ready(function () {
    var defenceStatus = $('.defence-status');
    var defenceBoolForBack = $('.defence-bool');
    var attackInstructionsElement = $('.attack-instructions-text');
    attackInstructionsElement.css('display', 'inline-block');
    attackInstructionsElement.text(attackInstructions);
    defenceStatus.text("Uključena");
    defenceStatus.css('color', 'green');
    defenceBoolForBack.val("true");

});
