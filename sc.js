console.log("lets write a javascript");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder

    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    

    //yaha par div create kar rha ho
    let div = document.createElement("div")

    //div ka andar response daal da
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")//yaha par tag name hain jisma song hain

     songs = []

    // as kitna uspa loop chalana hain
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        //music ka end mp3 ho fetch ho jaaya
        if (element.href.endsWith(".mp3")) {
            //ek empty array song usma push kar dena
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

     
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    //songUL.innerHTML = ""
      
     // Replace %20 with a space for each song
    for (const song of songs) {
        // Use backticks for multi-line strings
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")}</div>
            <div>Harry</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="playbar.svg" alt="">
        </div> </li>`;
    }

    //Attached an event listnear to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {


           console.log(e.querySelector(".info").firstElementChild.innerHTML)
           playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
      
   })








    return songs
}



      const playMusic = (track, pause=false) => {
    // let audio = new Audio("/${folder}/" + track)
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    
  
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }
     // Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })

}



       async function main() {

    // get the list of all the songs
     songs = await getSongs("songs/ncs");
    console.log(songs);
    playMusic(songs[0], true)

   


    

// attach an event listener to play next and previous

play.addEventListener("click", ()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src = "pause.svg"
    } else{
        currentSong.pause()
        play.src = "playbar.svg"
    }
})
// listean for time update event
currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
})
// add an event listnear to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent =(  e.offsetX/e.target.getBoundingClientRect().width)*100 
    document.querySelector(".circle").style.left=+ "%"
    currentSong.currentTime = ((currentSong.duration)*percent)/100
 })
  // add an event listnesr for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})
// add an event listener for close
document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "-120%"
})


// add an event listener for previous
previous.addEventListener("click", ()=>{
    console.log("Previous clicked" )
    console.log(currentSong)
    let index = songs.indexOf( currentSong.src.split("/").slice(-1)[0])
    if((index-1)>= 0){
        playMusic(songs[index-1])
   
    }

})

// add an event listener for next
next.addEventListener("click", ()=>{
    console.log("next clicked" )

    let index = songs.indexOf( currentSong.src.split("/").slice(-1)[0])
    if((index+1)< songs.length){
        playMusic(songs[index+1])
   
    }


    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })
   

})


  








}
main()