const Game_Screen = document.querySelector(".gameScreen")
let Characters = {
    "enemy" : document.createElement("div")
}

document.querySelectorAll(".mainMenu > section section").forEach( BoxEscolhas => {
    BoxEscolhas.querySelectorAll("div").forEach( div => {
        let OneActive = false
        div.addEventListener("click",()=>{
            if(BoxEscolhas.querySelector("div.active")){
                BoxEscolhas.querySelectorAll("div").forEach( div => {
                    div.classList.value = ''
                })
            }
            div.classList.value = 'active'
        })
    })
})

document.querySelector("#startGame").addEventListener("click",() => {
    const divsActive = document.querySelectorAll(".mainMenu > section section div.active")
    const presets = {
        "dificultyLevel" :  divsActive[0].innerHTML,
        "playerNumber" :  divsActive[1].innerHTML,

    }
})

function startGame(){
    changeScreen("mainMenu","gameScreen")
    for(let person in Characters){
        Characters[person].setAttribute('id',person)
        Game_Screen.appendChild(Characters[person])
    }
}

function changeScreen(screenIn,screenOut){
    document.querySelector(`.${screenIn}`).classList.remove('active')
    document.querySelector(`.${screenOut}`).classList.add('active')
}