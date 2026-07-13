let currentAudio=new Audio()
let song_list=[]
let currentIndex=-1

async function getSongs() {
    let res = await fetch("spotify.json")
    let songs = await res.json()
    return songs
}

function playSong(index){
    let selected_song=song_list[index]
    currentAudio.src=selected_song.file
    currentAudio.play()
    currentIndex=index
    let playBtn=document.getElementById("playBtn")
    if(playBtn) playBtn.src="Images/pause.svg"
    
}

async function song_data() {
    song_list = await getSongs()
    console.log(song_list)

    let songUL = document.querySelector(".song-list ul")
    songUL.innerHTML = ""

    song_list.forEach((song, index) => {
        songUL.innerHTML += `
        <li data-index="${index}">
            <div class="left-part">
                <img src="Images/music.svg" class="music invert">
                
                <div class="song_box">
                    <div class="song_name">${song.title}</div>
                    <div class="song_artist">${song.artist}</div>
                </div>
            </div>

            <div class="play-btn">
                <img src="Images/play.svg" class="invert" >
            </div>
        </li>`
    })
    document.querySelectorAll(".song-list li").forEach((li)=>{
        li.addEventListener("click", (li)=>{
           let index=li.getAttribute("data-index")
           playSong(index)
        })
    })
}

document.addEventListener("DOMContentLoaded",()=>{
    let playBtn=document.getElementById("playBtn")
    playBtn.addEventListener("click", ()=>{
        if(!currentAudio.src) return
        if(currentAudio.paused){
            currentAudio.play()
            playBtn.src="Images/pause.svg"
        }
        else{
            currentAudio.pause()
            playBtn.src="Images/play.svg"
        }

    })

    currentAudio.addEventListener("ended",()=>{
        playBtn.src="Images/play.svg"
    })
    song_data()

})

