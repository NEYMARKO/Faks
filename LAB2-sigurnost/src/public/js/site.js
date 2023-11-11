var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
var warningText = "OPREZ! ISKLJUČENA VAM JE OBRANA!";
var attackInstructions = "Upute: Dok obrana nije aktivna, mogu se slati razne naredbe uz pomoć <script> taga koje iskorištavaju slabosti ove stranice"
+". Neke od naredbi za iskorištavanje slabosti:";

var attackExamples = ["<script>alert('XSS attack')</script>", "<script>window.location.href = 'https://google.com'</script>", "<script>alert('XSS attack')</script>"];
document.cookie = "COOKIE";


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
    var attackList = $('.attack-types');

    defenceStatus.text("Uključena");
    defenceStatus.css('color', 'green');
    defenceBoolForBack.val("true");
    
    for (attack in attackExamples) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(attackExamples[attack]));
        attackList.append(li);
    };
    attackList.css('display', 'none');

});
