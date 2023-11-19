let player = null;

let canvasHeight = window.innerHeight;
let canvasWidth = window.innerWidth;
//web stranica nemre registrirati vise keydownova ili keyupova odjednom pa se koristi ova struktura kako bi se 
//znalo koji su keyevi trenutno pritisnuti
//https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript
let pressedKeys = {};

let spawnedAsteroids = [];
//maksimalan broj asteroida koji trebaju biti aktivni u nekom trenutku;
let maxActiveAsteroids = 40;
//najmanji broj vidljivih asteroida - ukoliko ih je manje od toga, trebaju se spawnati novi
let minimalAsteroidCount = 30;

let maxAsteroidSpeed = 10;
let currentAsteroid = null;

let maxSpawnOffset = 150;

let gameStart = null;
let gameEnd = null;

function startGame() {
    //određivanje sredine canvasa - inicijalna pozicija igrača
    let centerWidth = canvasWidth / 2;
    let centerHeight = canvasHeight / 2;
    player = new component(35, 35, "#FF0000", centerWidth, centerHeight, "player");
    //https://css-tricks.com/snippets/javascript/random-hex-color/
    for (let i = 0; i < maxActiveAsteroids; i++) {
        //stvaranje asteroida: velicine i širine su [30, 60] te su obojani u neku nijansu sive boje
        spawnedAsteroids.push(new component(Math.random() * 30 + 30, Math.random() * 30 + 30, generateGrayColor(), canvasWidth, canvasHeight, "asteroid"));
    }
    //bilježenje vremena početka igre
    gameStart = new Date().getTime();
    myGameArea.start();
}

//https://stackoverflow.com/questions/22692588/random-hex-generator-only-grey-colors
//stvaranje nijanse sive boje koja se koristi kod generiranja asteroida
function generateGrayColor() {
    var value = Math.random() * 0xFF | 0;
    var grayscale = (value << 16) | (value << 8) | value;
    return '#' + grayscale.toString(16);
}

var myGameArea = {
    canvas: document.createElement("canvas"),

    //postavljanje izgleda igre - preuzeto s prezentacija
    start: function () {
        this.canvas.id = "myGameCanvas";
        this.canvas.width = canvasWidth * 0.99;
        this.canvas.height = canvasHeight * 0.975;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },

    //funkcija koja zaustavlja igru i uspoređuje trenutni i najbolji rezultat
    stop: function () {
        clearInterval(this.interval);

        //dohvaćanje konačnog vremena te usporedba s onim vremenom koje je pohranjeno u localStorage (najbolje vrijeme)
        let finalScore = gameEnd - gameStart;
        let highScore = parseFloat(localStorage.getItem("highscore")) || 0;

        if (finalScore > highScore) {
            localStorage.setItem("highscore", finalScore);
        }
        //div za prikaz opcije ponavljanja igre postaje vidljiv nakon što je igra završila
        document.querySelector('.restart-game').style.display = 'flex';
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    //funkcija za prikaz trenutnog vremena te najboljeg vremena u canvasu 
    showScore: function () {
        this.context.font = "25px Arial";
        this.context.fillStyle = "#0000000";
        this.context.fillText("Najbolje vrijeme: " + (formatScore(parseFloat(localStorage.getItem("highscore")))), canvasWidth - 0.25 * canvasWidth, canvasHeight - (canvasHeight - 20));
        this.context.fillText("Vrijeme: " + getCurrentTimeScore(), canvasWidth - 0.25 * canvasWidth, canvasHeight - (canvasHeight - 50));
    }

}

//https://stackoverflow.com/questions/33458174/get-current-datetime-in-minutes-and-convert-datetime-d-m-y-hm-to-minutes-java
//funkcija za prikazivanje vremenskog rezultata - racunanje minuta, sekundi i milisekundi
function getCurrentTimeScore() {
    let currentTime = new Date().getTime() - gameStart;
    let minutes = Math.floor(currentTime / (1000 * 60));
    //broj milisekundi potrosenih na minute => ostatak se pretvara u sekunde pa dalje u milisekunde
    currentTime -= minutes * 1000 * 60;
    let seconds = Math.floor(currentTime / 1000);
    currentTime -= seconds * 1000;
    let miliseconds = currentTime;

    //način formatiranja vremena da bude jednak traženom formatu vremena u zadatku
    if (minutes < 10)
    {
        minutes = `0${minutes}`;
    }
    if (seconds < 10)
    {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}.${miliseconds}`;
}

//funkcija za prikaz rezultata u trazenom formatu minutes:seconds.miliseconds 
//(funkcija prima milisekunde te ih pretvara u minute, sekunde i milisekunde)
function formatScore(timeScore) {

    if (isNaN(timeScore))
    {
        return "00:00.00";
    }
    let minutes = Math.floor(timeScore / (1000 * 60));
    timeScore -= minutes * 1000 * 60;
    let seconds = Math.floor(timeScore / 1000);
    timeScore -= seconds * 1000;
    let miliseconds = timeScore;

    //način formatiranja vremena da bude jednak traženom formatu vremena u zadatku
    if (minutes < 10)
    {
        minutes = `0${minutes}`;
    }
    if (seconds < 10)
    {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}.${miliseconds}`;
}

//funkcija za stvaranje objekata tipa player i asteroid
function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;

    //igrač ima konstantne brzine
    if (this.type === "player") {
        this.speed_x = 5;
        this.speed_y = 5;
        this.x = x;
        this.y = y;
    }

    else {
        //rezultat ovog izraza je brzina u rasponu [-maxAsteroidSpeed / 2, maxAsteroidSpeed / 2]
        this.speed_x = Math.floor(Math.random() * maxAsteroidSpeed) - maxAsteroidSpeed / 2;
        this.speed_y = Math.floor(Math.random() * maxAsteroidSpeed) - maxAsteroidSpeed / 2;

        //određivanje odmaka od canvasa na kojem će se asteroid spawnati
        //ne mogu se spawnati na udaljenosti većoj od maxSpawnOffset/2 od ruba
        let spawnOffset = Math.random() * maxSpawnOffset - maxSpawnOffset/2;
        //distance traveled se počinje racunati tek nakon što asteroid uđe u canvas
        this.distanceTraveled = - spawnOffset;
        //ukoliko se asteroid kreće desno, treba ga spawnati na: lijevoj strani canvasa - spawn offset 
        //kako bi zapravo bio vidljiv u canvasu
        if (this.speed_x > 0) {
            this.x = 0 - spawnOffset;
        }
        else {
            this.x = canvasWidth + spawnOffset;
        }
        //ukoliko se asteroid kreće prema gore, treba ga spawnati na: donjoj strani canvasa - spawn offset 
        //kako bi zapravo bio vidljiv u canvasu
        if (this.speed_y > 0) {
            this.y = 0 - spawnOffset;
        }
        else {
            this.y = canvasHeight + spawnOffset;
        }
    }

    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        
        //stavljanje sijene na objekte
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.translate(this.x, this.y);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();

        //računanje granica objekata koje su potrebne za određivanje kolizije
        this.leftBorder = this.x - this.width / 2;
        this.rightBorder = this.x + this.width / 2;
        this.lowerBorder = this.y - this.height / 2;
        this.upperBorder = this.y + this.height / 2;
    }
    //funkcija koja određuje u kojem se smjeru igrač treba micati u ovisnosti o pritisnutim tipkama
    //informacija o tome je li tipka pritisnuta sadržana je u "pressedKeys" te se ažurira u eventListener-ima
    this.movePlayer = function () {

        //lijeva strelica
        if (pressedKeys[37] == true) {
            direction_x = -1;
        }

        //desna strelica
        else if (pressedKeys[39] == true) {
            direction_x = 1;
        }
        else {
            direction_x = 0;
        }

        //strelica prema gore
        if (pressedKeys[38] == true) {
            direction_y = -1;
        }

        //strelica prema dolje
        else if (pressedKeys[40] == true) {
            direction_y = 1;
        }
        else {
            direction_y = 0;
        }
        //računanje pomaka u x i y smjeru
        this.x += direction_x * this.speed_x;
        this.y += direction_y * this.speed_y;

        //horizontalni teleport
        if (this.x + this.width >= canvasWidth && direction_x === 1) {
            this.x = 0;
        }
        else if (this.x < 0) {
            this.x = canvasWidth;
        }

        //vertikalni teleport
        if (this.y + this.height <= 0 && direction_y === -1) {
            this.y = canvasHeight;
        }
        else if (this.y > canvasHeight) {
            this.y = 0;
        }
    }

    //funkcija za pomicanje asteroida - uvijek se kreću u istom smjeru koji im je zadan
    //u trenutku kada su generirani
    this.moveAsteroid = function () {
        this.x += this.speed_x;
        this.y += this.speed_y;
        this.distanceTraveled += Math.sqrt(Math.pow(this.x, 2), Math.pow(this.y, 2));
    }

    //provjerava je li asteroid vidljiv u canvasu, ako nije, briše se
    this.checkAsteroidCanvas = function (position) {
        //ukoliko asteroid još nije prošao cijelom duljinom canvasa (this.distanceTraveled >= maximumDistance nije zadovoljeno)
        //ne smije ga se obrisat. Asteroid također treba biti izvan canvasa kako bi se mogao obrisat
        //najdulji put koji objekt može proći se prelazi u slučaju da ide iz jednog kuta u drugi (po dijagonali)
        //iz tog razloga mora proći po tom putu + maxSpawnOffset prije nego li ga se može obrisati (tada će sigurno proći kroz canvas)
        let maximumDistance = Math.sqrt(Math.pow(canvasHeight, 2), Math.pow(canvasWidth, 2)) + maxSpawnOffset; 
        if (this.distanceTraveled >= maximumDistance && (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight)) {
            spawnedAsteroids.splice(position, 1);
        }
    }
}

//funkcija za provjeravanje je li broj asteroida manji od dopuštenog minimalnog broja vidljivih
//asteroida - ukoliko je, treba generirati nove asteroide kako bi igra mogla trajati beskonačno
function handleAsteroidCount() {
    let activeAsteroids = spawnedAsteroids.length;
    if (activeAsteroids < minimalAsteroidCount) {
        for (let i = 0; i < maxActiveAsteroids - activeAsteroids; i++) {
            spawnedAsteroids.push(new component(Math.random() * 30 + 30, Math.random() * 30 + 30, generateGrayColor(), canvasWidth, canvasHeight, "asteroid"));
        }
    }
}

//funkcija za provjeru kolizije
function checkColission(asteroid) {
    //https://stackoverflow.com/questions/31022269/collision-detection-between-two-rectangles-in-java
    if (player.rightBorder >= asteroid.leftBorder &&
        player.leftBorder <= asteroid.rightBorder &&
        player.upperBorder >= asteroid.lowerBorder &&
        player.lowerBorder <= asteroid.upperBorder) {
        return true;
    }
    return false;
}

//funkcija koja služi kao gameloop - vrti se svaki frame te se u njoj mijenjaju pozicije igrača i asteroida
//te se provjeravaju kolizije i broj vidljivih asteroida
function updateGameArea() {
    myGameArea.clear();
    myGameArea.showScore();
    player.movePlayer();
    player.update();
    //potrebno je za svaki asteroid posebno provjeriti je li u tom frameu došao
    //u koliziju s igračem, je li izašao iz canvasa, te mu je potrebno promijeniti poziciju
    for (let asteroidPos in spawnedAsteroids) {
        currentAsteroid = spawnedAsteroids[asteroidPos];
        currentAsteroid.moveAsteroid();
        currentAsteroid.update();
        //ukoliko je asteroid u koliziji s player-om, igra se završava
        if (checkColission(currentAsteroid)) {
            gameEnd = new Date().getTime();
            //zaustavljanje igre zbog kolizije
            myGameArea.stop();
        }
        //provjera koliko ima vidljivih asteroida
        currentAsteroid.checkAsteroidCanvas(asteroidPos);
    }
    //dodavanje novih asteroida ukoliko ih nema dovoljno u canvasu
    handleAsteroidCount();
}

//funkcija za ponovno učitavanje igre - poziva se klikom na gumb .reset-button
//briše sve asteroide iz liste, miče div za ponavljanje igre, čisti područje igre i postavlja početno
//vrijeme na null te započinje novu igru
function restartGame() 
{
    gameStart = null;
    myGameArea.clear();
    spawnedAsteroids = []
    document.querySelector('.restart-game').style.display = 'none';

    startGame();
}
//postavlja vrijednost ključa (ključ = tipka na tipkovnici) u true, što znači da je pritisnuta
window.addEventListener('keydown', function (event) {
    const key = event.keyCode;
    pressedKeys[key] = true;
});

//postavlja vrijednost ključa (ključ = tipka na tipkovnici) u false, što znači da je tipka otpuštena
window.addEventListener('keyup', function (event) {
    const key = event.keyCode;
    pressedKeys[key] = false;
});