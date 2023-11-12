var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
var warningText = "OPREZ! ISKLJUČENA VAM JE OBRANA!";
var attackInstructions = "Upute: Dok obrana nije aktivna, mogu se slati razne naredbe uz pomoć <script> taga koje iskorištavaju slabosti ove stranice"
+". Neke od naredbi za iskorištavanje slabosti:";

document.cookie = "COOKIE";



async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function submitData() {
    var userName = $('#userName').val();
    var password = $('#password').val();
    var shouldDefend = $('.defence-bool').val();

    console.log("USERNAME: " + userName);
    console.log("Password: "+ password);

    if (shouldDefend === "true") {
        password = sha256(password);
    }
    userObject = {userName: userName, password: password}
    localStorage.setItem("userData", JSON.stringify(userObject));
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
    var attackInstructionsElement = $('.attack-instructions-text');
    var attackList = $('.attack-types');

    instructionsParagraph.css('display', 'none');
    attackInstructionsElement.css('display', 'none');
    attackList.css('display', 'none');
}

function enableVisibility() {
    var instructionsParagraph = $('.instructions');
    var attackInstructionsElement = $('.attack-instructions-text');
    var attackList = $('.attack-types');

    instructionsParagraph.text(warningText);
    instructionsParagraph.css('display', 'inline-block');
    
    attackInstructionsElement.css('display', 'inline-block');
    attackInstructionsElement.text(attackInstructions);

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

    defenceStatus.text("Uključena");
    defenceStatus.css('color', 'green');
    defenceBoolForBack.val("true");
    
});
