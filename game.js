const Game_Screen = document.querySelector(".gameScreen")
const displayTurnOff = document.querySelector(".turnOF")
const lineOfBalance = document.querySelector(".line")
const bonus = document.querySelector(".bonusArea")
let turnOff = 0
let Characters = {}
let balanceIsAtivo = false
let presets
let percent = 30
let finalDamage
let danoAcumulado, bonusDamage = 0
let contDamageBalance = 0
let operationLv
let inGame  = true

// Tela Principal Funções dos Botões
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
    presets = {
        "dificultyLevel" :  divsActive[0].innerHTML,
        "playerNumber" :  divsActive[1].innerHTML,
    }
    startGame(presets)
    var audio = new Audio('assets/theme.mp3');
    audio.addEventListener('canplaythrough', function() {
        audio.play();
        audio.volume = 0.09
    });
    document.querySelector("body").style.background = 'url("bgnl.png")'
})


// Funções Auxiliares

function HealthBar(target,amount){
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
    if(target){
        let bar = document.querySelector(`#${target} .lifeBar`)
        let damage = document.createElement("span")
        damage.setAttribute("class","damageProp")
        damage.innerHTML = "-" + amount
        setTimeout(()=>{
            let live = document.querySelector(`#${target} .lifeBar .damageProp`)
            live.remove()
        },1900)
        bar.appendChild(damage)
    }
}

function changeScreen(screenIn,screenOut){
    if(screenIn){
        document.querySelector(`.${screenIn}`).classList.remove('active')
    }
    if(screenOut){
        document.querySelector(`.${screenOut}`).classList.add('active')
    }
}

function ModifyLife(target,amount,type){
    switch (type) {
        case "damage":
            if(typeof(target) === "object"){
                target.forEach(character => {
                    if((Characters[character].health - amount) >= 1){
                        Characters[character].health -= amount
                    }else{
                        Characters[character].health -= amount
                        endGame(target)
                    }
                })
            }else{
                if((Characters[target].health - amount) >= 1){
                    Characters[target].health -= amount
                }else{
                    Characters[target].health -= amount
                    endGame(target)
                }
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

    HealthBar(target,amount)
}

function endGame(target){
    setTimeout(()=>{
        if(target === 'boss'){
            alert('BOSS PERDEU')
        }else{
            alert('BOSS VENCEU')
        }
        changeScreen('gameScreen')
        changeScreen('gameActions',`mainMenu`)
        inGame = false
    },1500)
}

// Funções do Jogo

// Começa o Jogo

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
    let bossBaseLife = 0
    switch (presets.dificultyLevel) {
        case 'Fácil':
            bossBaseLife = 200
            break;
        case 'Medio':
            bossBaseLife = 300
            break;
        case 'Dificil':
            bossBaseLife = 500
            break;
    }
    Characters["boss"] = {
        "obj" : document.createElement("div"),
        "health" : bossBaseLife * presets.playerNumber,
        "maxHealth" : bossBaseLife * presets.playerNumber
    }
    for(let person in Characters){
        Characters[person]['obj'].setAttribute('id',person)
        Characters[person]['obj'].setAttribute('class','gameObj')
        Game_Screen.appendChild(Characters[person]['obj'])
    }
    HealthBar()
    turnStart()
}

// Primeiro Turno
function turnStart(){
    displayTurnOff.innerHTML = Object.keys(Characters)[turnOff]
    genBonusArea()
}

function actionSelect(selected){
    document.querySelector(".balance").classList.toggle("active")
    document.querySelector(".actionSelect").classList.toggle("active")
    balanceBar()
    resetThisFuck()
    balanceIsAtivo = true
    operationLv = selected
}

function genBonusArea(){
    if(percent > 2){
            percent = 30 - (bonusDamage * 2)
        }
    bonus.style.width = percent + '%'
    bonus.style.left = Math.floor(Math.random() * (100 - percent )) + "%"
    bonusDamage++
    finalDamage = 40 + (bonusDamage * 10)
    document.querySelector(".damageBoostText").innerHTML = finalDamage + '%'
    lineGoesReset = true
}


let positionOfLine = 0
let lineDirectionIsBack = false
let lineGoesReset = false
function balanceBar(){
    if(balanceIsAtivo){
        if(lineDirectionIsBack === true){
            positionOfLine = positionOfLine - 1
        }else{
            positionOfLine = positionOfLine + 1
        }
        if(positionOfLine === 0){
            lineDirectionIsBack = false
        }
        if(positionOfLine === 100){
            if(lineGoesReset){
                lineDirectionIsBack = true
                lineGoesReset = false
            }else{
                balanceIsAtivo = false
                runMathOperation()
                document.querySelector(".balance").classList.toggle("active")
            }
        }
        lineOfBalance.style.left = positionOfLine + "%"
    }
}

function resetThisFuck(){
    bonusDamage = 0
    percent = 30
    positionOfLine = 0
    balanceIsAtivo = true
    genBonusArea()
}

setInterval(balanceBar, 10)

addEventListener("keydown",(e) => {
    if(e.key === " "){
        let d1 = parseInt(document.querySelector(".bonusArea").style.left.slice(0,-1))
        let d2 = d1 + parseInt(document.querySelector(".bonusArea").style.width.slice(0,-1))
        let d3 = parseInt(lineOfBalance.style.left.slice(0,-1))
        if(d3 >= d1 && d3 <= d2 && lineDirectionIsBack === false){
            lineOfBalance.style.background = 'blue'
            genBonusArea()
        }
    }
} )

let operacoes,numeros
function runMathOperation(){
    document.querySelector(".operationScreen").classList.toggle("active")
    let divEquation = document.querySelector(".equation")
    let divOpScreen = document.querySelector(".operationScreen")
    switch  (operationLv) {
        case 0:
            switch (presets.dificultyLevel) {
                case "Fácil":
                    operacoes = ["x","/","+","-"]
                    numeros = [1,2,3,4,5,6,7,8,9,10]
                    break;
                case "Medio":
                    operacoes = ["x","/","+","-"]
                    numeros = [1,2,3,4,5,6,7,8]
                    break;
                case "Dificil":
                    operacoes = ["x","/","+","-"]
                    numeros = [ 1,2,3,4,5]
                    break;
            }
        break;
        case 1:
            switch (presets.dificultyLevel) {
                case "Fácil":
                    operacoes = ["x","/","+","-","**","+%"]
                    numeros = [1,2,3,4,5,6,7,8,9,10]
                    break;
                case "Medio":
                    operacoes = ["x","/","+","-","**","+%"]
                    numeros = [1,2,3,4,5,6,7]
                    break;
                case "Dificil":
                    operacoes = ["x","/","+","-","**","+%"]
                    numeros = [ 1,2,3,4,5]
                    break;
            }
            
        break;  
    }
    let lastOp
    let numeroDeNumeros

    switch (presets.dificultyLevel) {
        case "Fácil":
            numeroDeNumeros = Math.floor(Math.random() * 2) + 2
            break;
        case "Medio":
            numeroDeNumeros = Math.floor(Math.random() * 3) + 2
            break;
        case "Dificil":
            numeroDeNumeros = Math.floor(Math.random() * 6) + 2
            break;
    }

    for(let i = 0; i < numeroDeNumeros; i++){
        let dropArea = document.createElement("div")
        if(lastOp === "**"){
            dropArea.classList.value = "drop-area-e"
        }else{
            dropArea.classList.value = "drop-area"
        }
        dropArea.setAttribute("ondragover","onDragOver(event)")
        dropArea.setAttribute("ondrop","onDrop(event)")
        divEquation.appendChild(dropArea)
        if(i + 1 < numeroDeNumeros){
            let spanOperator = document.createElement("span")
            spanOperator.classList.value = "operator"
            let operadorIndex = Math.floor(Math.random() * operacoes.length)
            spanOperator.innerHTML = operacoes[operadorIndex]
            lastOp = operacoes[operadorIndex]
            if(lastOp === "**"){
                spanOperator.style.display = 'none'
                divEquation.appendChild(spanOperator)
            }else{
                divEquation.appendChild(spanOperator)
            }
        }
        let NumberOptions = document.createElement("span")
        NumberOptions.setAttribute("id",`opc${i}`)
        NumberOptions.setAttribute("class",`opcs`)
        NumberOptions.setAttribute("draggable",`true`)
        NumberOptions.setAttribute("ondragstart",`onDragStart(event)`)
        let NumberIndex = Math.floor(Math.random() * numeros.length)
        NumberOptions.innerHTML = numeros[NumberIndex]
        divOpScreen.appendChild(NumberOptions)
    }
}

function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();
    if(document.querySelectorAll(".operationScreen > .opcs").length === 0){
        realiseMath()
    }
}

function realiseMath(){
    document.querySelector(".operationScreen").classList.toggle("active")
    let math = document.querySelectorAll(".equation span")
    let str = ''
    math.forEach( ele => {
        str += ele.innerHTML
    })
    let result = Math.ceil(calcularExpressaoString(str));

    if(result < 0){
        result = Math.abs(result)
    }
    
    result = (finalDamage * result) / 100

    result = Math.ceil(result)

    console.log(str,result)

    ModifyLife('boss',result,'damage')

    NextTurn()
}

function calcularExpressaoString(expressao) {
    let numeros = [];
    let operadores = [];

    // Função auxiliar para avaliar a precedência de operadores
    function precedencia(operator) {
        switch (operator) {
            case '+':
            case '-':
                return 1;
            case 'x':
            case '/':
            case '+%':
                return 2;
            case '**':
                return 3; // Elevado e Mais Porcentagem têm a maior precedência
            default:
                return 0;
        }
    }

    // Função auxiliar para realizar uma operação
    function realizarOperacao() {
        let operador = operadores.pop();
        let b = numeros.pop();
        let a = numeros.pop();

        switch (operador) {
            case '+':
                numeros.push(a + b);
                break;
            case '-':
                numeros.push(a - b);
                break;
            case 'x':
                numeros.push(a * b);
                break;
            case '/':
                numeros.push(a / b);
                break;
            case '**':
                numeros.push(Math.pow(a, b));
                break;
            case '+%':
                numeros.push(a + (a * (b / 100)));
                break;
            default:
                throw new Error(`Operador desconhecido: ${operador}`);
        }
    }

    // Remover espaços em branco da expressão
    expressao = expressao.replace(/\s/g, '');

    // Dividir a expressão em números e operadores usando uma expressão regular
    let partes = expressao.match(/(\d+|\*\*|\+\%|\D)/g);

    // Iterar sobre as partes da expressão
    partes.forEach(parte => {
        if (parseInt(parte)) {
            // Se a parte atual é um número, adicione à pilha de números
            numeros.push(parseFloat(parte)); // Use parseFloat para suportar números decimais
        } else {
            // Se a parte atual é um operador, verifique a precedência
            while (
                operadores.length > 0 &&
                precedencia(operadores[operadores.length - 1]) >= precedencia(parte)
            ) {
                realizarOperacao();
            }
            operadores.push(parte);
        }
    });

    // Realizar operações restantes na pilha
    while (operadores.length > 0) {
        realizarOperacao();
    }

    // O resultado final deve ser o único elemento restante na pilha de números
    return Math.floor(numeros[0]);
}

function NextTurn(){
    let numTurns = Object.keys(Characters).length - 1
    document.querySelector(".equation").innerHTML = ""

    if(turnOff == numTurns){
        turnOff = 0
    }else{
        turnOff += 1
    }

    if(Object.keys(Characters)[turnOff] === "boss"){
        BossAtack()
    }else{
        document.querySelector(".actionSelect").classList.toggle("active")
    }

    document.querySelector(".turnOF").innerHTML = Object.keys(Characters)[turnOff]
}

function BossAtack(){
    if(inGame){
        let conta = ''
        let number = 4
        console.log(operacoes , numeros)
        for(let i = 0; i < number;i++){
            let opc = operacoes[Math.floor(Math.random() * operacoes.length)]
            let num = numeros[Math.floor(Math.random() * numeros.length)] + parseInt(presets.playerNumber)
            conta += num
            if(i + 1 < number){
                conta += opc
            }
        }
        let bossDamage = calcularExpressaoString(conta)
        console.log(conta,bossDamage)
        if(bossDamage < 0){
            bossDamage =  Math.abs(bossDamage)
        }
        let DamagePerPlayer = bossDamage / presets.playerNumber
        setTimeout(()=>{
            for(let i = 1;i <= presets.playerNumber;i++){
                ModifyLife(`player${i}`,DamagePerPlayer,'damage')
            }
            NextTurn()
        },2000)
    }
}