
const data = [
  { "number": 1, "artist": "Uesugi Kenshin", "title": "Warrior quote", "album": "Samurai quotes" },
  { "number": 2, "artist": "Ishida Mitsunari", "title": "Combat quote", "album": "Samurai quotes" },
  { "number": 3, "artist": "Unknown samurai", "title": "Long quote", "album": "Samurai quotes" }
];

function handleSelectionChange(event) {
  let selectedValue = parseInt(event.target.value);
  let selectedObject = data.find(obj => obj.number === selectedValue);

  if (selectedObject) {
    console.log(selectedObject);

    updateAudioSource(selectedValue);

    updateMediaSessionMetadata(selectedObject);
  } else {
    console.log("Object not found for the selected value");
  }
}

function updateAudioSource(selectedValue) {
  audio = document.getElementById("samurai_audio_player");
  source = document.getElementById("audio_source");

  source.src = `quotes/quote${selectedValue}.mp3`;

  audio.load();
}

function updateMediaSessionMetadata(selectedObject) {
  if ('mediaSession' in navigator) {
    const player = document.querySelector('audio');
    
    navigator.mediaSession.metadata = new MediaMetadata({
      title: selectedObject.title || "",
      artist: selectedObject.artist || "",
      album: selectedObject.album || "",
      artwork: [
        {
          src: '/images/samurai_image-64_x_64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/images/samurai_image-128_x_128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: '/images/samurai_image-256_x_256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: '/images/samurai_image-512_x_512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => player.play());
    navigator.mediaSession.setActionHandler('pause', () => player.pause());
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skipTime = details.seekOffset || 1;
      player.currentTime = Math.max(player.currentTime - skipTime, 0);
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset || 1;
      player.currentTime = Math.min(player.currentTime + skipTime, player.duration);
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.fastSeek && 'fastSeek' in player) {
        player.fastSeek(details.seekTime);
        return;
      }
      player.currentTime = details.seekTime;
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      player.currentTime = 0;
    });
  }
}