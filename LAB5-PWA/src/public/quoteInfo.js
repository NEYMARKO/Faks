window.onload = function() {
    console.log("loaded page");
    const data = [
        {
            "number": 1, "artist": "Uesugi Kenshin", "title": "Warrior", "album": "Samurai quotes",
            "text": "Uesugi Kenshin, born in 1530, was not only a skilled military tactician but also a master swordsman. "
                + "Known for his unwavering loyalty to the Buddhist deity Bishamonten, Kenshin was often called the God of War."
                + " His leadership in battles like the Fourth Battle of Kawanakajima against Takeda Shingen and his emphasis on justice and compassion made"
                + " him a respected and enigmatic figure of his time."
        },
        {
            "number": 2, "artist": "Ishida Mitsunari", "title": "Combat", "album": "Samurai quotes",
            "text": "Ishida Mitsunari, born in 1560, rose to prominence as a trusted retainer of Toyotomi Hideyoshi. Following Hideyoshi's death, Mitsunari found"
                + "himself leading the Western Army in the Battle of Sekigahara, a pivotal conflict that marked the end of the Sengoku period. His strategic prowess"
                + " and loyalty to the Toyotomi clan left a lasting legacy, even in defeat."
        },
        {
            "number": 3, "artist": "Unknown samurai", "title": "Essence of samurai", "album": "Samurai quotes",
            "text": "The term Unknown Samurai encompasses the countless warriors whose names have faded into history but whose deeds and dedication to the samurai"
                + " code remain influential. These samurai, often uncelebrated in historical records, contributed to the shaping of Japan's martial traditions. Their stories,"
                + " though obscured by time, echo the broader narrative of honor, duty, and sacrifice within the samurai class."
        }
    ];

    let selectedValue = localStorage.getItem("value") || 1;
    console.log("value: " + selectedValue);
    let selectedObject = data.find(obj => obj.number === parseInt(selectedValue));

    let cardTitle = document.querySelector('.card-title');
    let cardText = document.querySelector('.card-text');
    let quoteInfo = document.querySelector('.quote-info');

    cardTitle.innerHTML = selectedObject.title;
    cardText.innerHTML = selectedObject.artist;
    quoteInfo.innerHTML = selectedObject.text;
    
    //inace se nikad nece prvi quote prikazat jer se na njega nikad ne klikne kad je po defaultu pokazan
    localStorage.clear();
}
