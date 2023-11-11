const Game_Screen = document.querySelector(".gameScreen")
let turnOff = 'player1'
let Characters = {}

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
    startGame(presets)
})

function changeScreen(screenIn,screenOut){
    if(screenIn){
        document.querySelector(`.${screenIn}`).classList.remove('active')
    }
    if(screenOut){
        document.querySelector(`.${screenOut}`).classList.add('active')
    }
}

function startGame(presets){
    changeScreen("mainMenu","gameScreen")
    changeScreen("", "gameActions")
    let i = 0
    while(presets.playerNumber > i){
        let player = document.createElement("div")
        player.setAttribute("class",`player num_${i + 1}`)
        player.setAttribute("id",`num_${i + 1}`)
        Characters[`player${i + 1}`] = {
            "obj" : document.createElement("div"),
            "maxHealth" : 100,
            "health" : 100
        }
        i++
    }
    Characters["boss"] = {
        "obj" : document.createElement("div"),
        "health" : 300 * presets.playerNumber,
        "maxHealth" : 300 * presets.playerNumber
    }
    for(let person in Characters){
        Characters[person]['obj'].setAttribute('id',person)
        Characters[person]['obj'].setAttribute('class','gameObj')
        Game_Screen.appendChild(Characters[person]['obj'])
    }
    HealthBar(true)
    TurnStart()
}

let damageBalance
function TurnStart(){
    document.querySelector(".turnOF").innerHTML = turnOff
    damageBalance = true
    bonusArea()
}
function HealthBar(){
    for(let obj in Characters){
        document.querySelector(`#${obj}`).innerHTML = ""
        let percentLife = (100 * Characters[obj]["health"]) / Characters[obj]["maxHealth"]
        const lifeBar= document.createElement('div')
        const life= document.createElement('div')
        lifeBar.classList.add("lifeBar")
        life.style.width = percentLife + '%'
        lifeBar.innerHTML = `<span>${Characters[obj]["health"]}/${Characters[obj]["maxHealth"]}<span>`
        lifeBar.appendChild(life)
        document.querySelector(`#${obj}`).appendChild(lifeBar)
        }
}

function ModifyLife(target,amount,type){
    switch (type) {
        case "damage":
            if(typeof(target) === "object"){
                target.forEach(character => {
                    Characters[character].health -= amount
                })
            }else{
                Characters[target].health -= amount
            }
            break;
        case "heal":
            if(typeof(target) === "object"){
                target.forEach(character => {
                    Characters[character].health += amount
                })
            }else{
                Characters[target].health += amount
            }
        break
        default:
            console.log("Erro")
            break;
    }
    HealthBar()
}

function bonusArea(){
    let bonus = document.querySelector(".bonusArea")
    let percent = 30 - (bonusDamage * 2)
    bonus.style.width = percent + '%'
    bonus.style.left = Math.floor(Math.random() * (bonusDamage * 2)) + "%"
    console.log(percent)
    bonusDamage++
}

let danoAcumulado, bonusDamage = 0
let contDamageBalance = 0
let reverse
setInterval(()=>{
    if(damageBalance){
        if(contDamageBalance === 100){
            reverse = true
            bonusArea()
        }
        if(contDamageBalance === 0){
            reverse = false
        }
        if(reverse){
            document.querySelector(".line").style.left = contDamageBalance + "%"
            contDamageBalance--
        }else{
            document.querySelector(".line").style.left = contDamageBalance + "%"
            contDamageBalance++
        }
    }
    },5)

addEventListener("keydown",(e) => {
    if(e.key === " "){
        console.log(contDamageBalance)
    }
})