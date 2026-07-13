// global variables and state
let currentAudio=new Audio()
let song_list=[]
let currentIndex=-1

// fetching the data

async function getSongs() {
    let res = await fetch("spotify.json")
    let songs = await res.json()
    return songs
}


// formatting the duration

function secondsTominuteSeconds(seconds){
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }
    let minutes=Math.floor(seconds/60)
    let remainingSeconds=Math.floor(seconds%60)
    let formattedMinutes=String(minutes).padStart(2,'0')
    // string.padStart(targetLength, padCharacter) padStart() is a JavaScript string method used to add characters at the beginning of a string until it reaches a desired length.
    let formattedSeconds=String(remainingSeconds).padStart(2,'0')
    return `${formattedMinutes}:${formattedSeconds}`
}


// play/pause
function playSong(index,pause=false){
    let selected_song = song_list[index]

    currentAudio.src = selected_song.file
  
    
    currentIndex = index
    let playBtn=document.getElementById("playBtn")

    if(!pause){
       
        if(playBtn){
             currentAudio.play()
            playBtn.src="Images/pause.svg"
        }
        else{
               currentAudio.pause()
               playBtn.src="Images/play.svg"
        }
       
    }


    

//   update the playbar info

    let songInfo=document.querySelector(".song-info")
    songInfo.innerHTML=`${selected_song.title}`

    let songTime=document.querySelector(".song-time")
    songTime.innerHTML="00:00/00:00"
  
}

// songs searching functions
// search for songcards
function rendercards(songstorender){
  
let cardContainer=document.getElementById("cardContainer")
cardContainer.innerHTML=""
songstorender.forEach((song)=>{
    let originalIndex=song_list.findIndex(s=>s.title===song.title)
    cardContainer.innerHTML +=`
              <div class="card" data-index="${originalIndex}">
              <img src="${song.image}"  />

              <h1>${song.title}</h1>
           
              <div class="play-butu">
                <span class="material-icons">play_arrow</span>
              </div>
              </div>`
})

document.querySelectorAll(".card").forEach((card)=>{
    card.addEventListener("click",()=>{
        let index=card.getAttribute("data-index")
        playSong(index)
    })
})
}

async function song_data() {
    song_list = await getSongs()
    console.log(song_list)



rendercards(song_list)
rendersongs(song_list)
if(song_list.length>0){
    playSong(0,true)
}
}
function seachsongs(query){
    const filtered=song_list.filter(song=>{
      return  song.title.toLowerCase().includes(query.toLowerCase())||
        song.artist.toLowerCase().includes(query.toLowerCase())
    
    })
    rendersongs(filtered)
    rendercards(filtered)
}
    
// seach for songs in library
function rendersongs(songstorender){


    let songUL = document.querySelector(".song-list ul")
    songUL.innerHTML = ""

    songstorender.forEach((song, index) => {
        let originalIndex=song_list.findIndex(s=> s.title === song.title)
        songUL.innerHTML += `
        <li data-index="${originalIndex}">
     
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

    // attach click listener to cards
    document.querySelectorAll(".song-list li").forEach((li)=>{
        li.addEventListener("click", ()=>{
           let index=li.getAttribute("data-index")
           playSong(index)
        })
    })
}


document.addEventListener("DOMContentLoaded",()=>{
    let playBtn=document.getElementById("playBtn")
    let previousbtn=document.getElementById("previous")
    let next_btn=document.getElementById("next")
// seaching the song
   let search_input=document.getElementById("search")
   search_input.addEventListener("input",(e)=>{
    seachsongs(e.target.value)
   })

// volume increasing and decreasing
    let volume_range=document.querySelector('input[type="range"]')
    let volume_icon=document.querySelector(".volume img")
    //   to set the volume in browser when we refresh we will get that data
        let  saved_volume=localStorage.getItem("user_volume")
        if(saved_volume!==null){
            currentAudio.volume=saved_volume/100
            volume_range.value=saved_volume

        }
        else{
            currentAudio.volume=0.1
            volume_range.value=10
        }

    volume_range.addEventListener("input",()=>{
        let volume_value=volume_range.value
        currentAudio.volume=volume_value/100
        localStorage.setItem("user_volume",volume_value)
        if(volume_value===0){
            volume_icon.src="Images/volume_off.svg"
        }
        else if(volume_value<50){
            volume_icon.src="Images/volume_down.svg"
        }
        else{
            volume_icon.src="Images/volume_up.svg"
        }
    })

//   click events to play pause buttons
    playBtn.addEventListener("click", ()=>{
        if(!currentAudio.src)
            return
        if(currentAudio.paused){
            currentAudio.play()
            playBtn.src="Images/pause.svg"
        }
        else{
            currentAudio.pause()
            playBtn.src="Images/play.svg"
        }

    })
// privious song 
    next_btn.addEventListener("click",()=>{
        if(song_list.length===0) 
            return
        else{
           currentIndex=(currentIndex+1)%song_list.length
           playSong(currentIndex)
        }
    })
    // next song
    previousbtn.addEventListener("click",()=>{
        if(song_list.length==0)
            return
        else{
            currentIndex=((currentIndex-1)+song_list.length)%song_list.length
            playSong(currentIndex)
        }
    })
    

    
// updating the playbar
   
    currentAudio.addEventListener("timeupdate",()=>{
        document.querySelector(".song-time").innerHTML=`${secondsTominuteSeconds(currentAudio.currentTime)}/${secondsTominuteSeconds(currentAudio.duration)}`
        document.querySelector(".circle").style.left=(currentAudio.currentTime/currentAudio.duration)*100+"%"
    })


    document.querySelector(".seekbar").addEventListener("click",e =>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent + "%";
        currentAudio.currentTime=((currentAudio.duration)*percent)/100;

    })



    currentAudio.addEventListener("ended",()=>{
        playBtn.src="Images/play.svg"
    })

  
   
// changing of volume
    volume_icon.addEventListener("click",()=>{
        if(currentAudio.volume>0){
            currentAudio.volume=0
            volume_range.value=0
            volume_icon.src="Images/volume_off.svg"
        }
        else{
            currentAudio.volume=0.5
            volume_range.value=50
            volume_icon.src="Images/volume_up.svg"
        }
    
   })


    song_data().then(() => {
        if (song_list.length > 0) {
            playSong(0, true)
        }
    })

    
    // adding the menu functionality in mobile view
    
    document.querySelector("#menu").addEventListener("click",()=>{
        document.querySelector(".left-sec").style.left="0";
    })
    document.querySelector("#close").addEventListener("click",()=>{
        document.querySelector(".left-sec").style.left="-100%"
    })


})

  
