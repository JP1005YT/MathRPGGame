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
    // damageBalance = true
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

let percent = 30
function bonusArea(){
    let bonus = document.querySelector(".bonusArea")
    if(percent > 2){
        percent = 30 - (bonusDamage * 2)
    }
    bonus.style.width = percent + '%'
    bonus.style.left = Math.floor(Math.random() * (100 - percent )) + "%"
    bonusDamage++
    let finalDamage = 40 + (bonusDamage * 10)
    document.querySelector(".damageBoostText").innerHTML = finalDamage + '%'
    reset = true
}

let danoAcumulado, bonusDamage = 0
let reset = true
let contDamageBalance = 0
let reverse

setInterval(()=>{ 
    if(damageBalance){
        if(contDamageBalance === 100){
            if(reset){
                reset = false
                reverse = true
                document.querySelector(".line").style.background = 'white'
            }else{
                document.querySelector(".line").style.left = "0%"
                damageBalance = false
                percent = 30
                document.querySelector(".balance").classList.toggle("active")
                runMathOperation()
            }
        }
        if(contDamageBalance === 0){
                document.querySelector(".line").style.background = 'red'
            reverse = false
            reset = false
        }
        if(reverse){
            document.querySelector(".line").style.left = contDamageBalance + "%"
            contDamageBalance--
        }else{
            document.querySelector(".line").style.left = contDamageBalance + "%"
            contDamageBalance++
        }
    }
},10)

addEventListener("keydown",(e) => {
    if(e.key === " "){
        let d1 = parseInt(document.querySelector(".bonusArea").style.left.slice(0,-1))
        let d2 = d1 + parseInt(document.querySelector(".bonusArea").style.width.slice(0,-1))
        let d3 = parseInt(document.querySelector(".line").style.left.slice(0,-1))
        if(d3 >= d1 && d3 <= d2 && reverse === false){
            document.querySelector(".line").style.background = 'blue'
            bonusArea()
        }
    }
})

let mathGround
function actionSelect(selected){
    document.querySelector(".balance").classList.toggle("active")
    document.querySelector(".actionSelect").classList.toggle("active")
    damageBalance = true
    mathGround = selected
}

let operacoes,numeros
function runMathOperation(){
    document.querySelector(".operationScreen").classList.toggle("active")
    let divEquation = document.querySelector(".equation")
    let divOpScreen = document.querySelector(".operationScreen")
    switch (mathGround) {
        case 0:
            operacoes = ["x","/","+","-"]
            numeros = [0,1,2,3,4,5,6,7,8,9]
            
        break;
        case 1:
            operacoes = ["x","/","+","-","**","%+"]
            numeros = [0,1,2,3,4,5,6,7,8,9]
        break;
        case 2:
            
            break;
    }
    let lastOp
    let numeroDeNumeros = Math.floor(Math.random() * 5) + 2
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
    let math = document.querySelectorAll(".equation span")
    let str = ''
    math.forEach( ele => {
        str += ele.innerHTML
    })
    console.log(str)
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
            case '*':
            case '/':
                return 2;
            case '**':
            case '+%':
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
            case '*':
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
    return numeros[0];
}

// Exemplo de uso
let expressao = "123+500";
let resultado = calcularExpressaoString(expressao);
console.log(`${expressao} = ${resultado}`);
