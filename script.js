// Configurations:

const animationMilliseconds = 500;

// Game Initialization Settings:   

const showWelcomeAlert = (onPlayGame) =>{
    const configWelcomeAlert = {title: "!Bienvenida!",
        text: "En matcheADAs tu objetivo es juntar tres o más items del mismo tipo, ya sea en fila o en columna. Para eso, selecciona un item y a continuación un item adyacente para intercambiarlos de lugar. \n \n Si se forma un grupo, esos items se eliminarán y ganarás puntos. ¡Sigue armando grupos de tres o más antes de que se acabe el tiempo! \n \n Controles \n Click izquierdo: selección. \n Enter o espacio: selección. \n Flechas o WASD: movimiento e intercambio." ,
        button: "A Jugar",
        closeOnClickOutside: false,
    }
    swal(configWelcomeAlert).then((valor) => {
        onPlayGame();
    });
};

const showGameDifficultyOptionsAlert = (onSelectLevel) =>{
    const configGameOptionsAlert = {title: "Nuevo juego",
            text: "Selecciona una dificultad",
            closeOnClickOutside: false,
            buttons: {
                facil: {
                    text: "Fácil",
                    value: "easy",
                },
                normal: {
                    text: "Normal",
                    value: "normal",
                },
                dificil: {
                    text: "Difícil",
                    value: "difficult",
                }
            },
        };
        
    swal(configGameOptionsAlert).then(onSelectLevel);
}

let currentLevel;

const startGameByLevel = (level) =>{
    currentLevel = level;
    let size;
    switch (level) {
        case "easy":
        size = 9;
        break;
        
        case "normal":
        size = 8;
        break;
    
        case "difficult":
        size = 7;
        break;
    }
    initilizeMatrix(size);
    displayGrid();
    startCountdown();
    resetCombo();
    resetScore();
    allowSelection = true;
}

const initializeGame = () =>{
    showWelcomeAlert(() => {
        showGameDifficultyOptionsAlert((level) => {
            startGameByLevel(level);
        });
    });
}

window.addEventListener('load', initializeGame);

// Initialize Matrix Game:

let matrixData = [];

const initilizeMatrix = (size) => {
    matrixData = [];
    for(let i = 0; i < size; i ++){
        let row = [];
        for(let j = 0; j < size; j ++){
            let duplicateValueX;
            if(j - 2 >= 0 && row[j - 1] == row[j - 2]){
                duplicateValueX = row[j-1];
            }
            let duplicateValueY;
            if(i - 2 >= 0 && matrixData[i - 1][j] == matrixData[i - 2][j]){
                duplicateValueY = matrixData[i - 1][j];
            }
            let temporaryArray = [];
            for(let k = 1; k <= 6; k++){
                if(k !== duplicateValueX && k !== duplicateValueY){
                    temporaryArray.push(k);
                }
            }
            const positionRandom = Math.floor(Math.random() * (temporaryArray.length - 0));
            const cell = temporaryArray[positionRandom];
            row.push(cell);
        }
        matrixData.push(row);
    }
}

// Display Grid game:

const grid = document.getElementById('grid');
let cellWidth;
let cellHeight;

const displayGrid = () => {
    grid.innerHTML = '';
    cellWidth = (grid.offsetWidth / matrixData.length);
    cellHeight = (grid.offsetHeight / matrixData.length);
    for(let y = 0; y < matrixData.length; y++){
        for(let x = 0; x < matrixData[y].length; x++){
            const value = matrixData[y][x];
            grid.appendChild(getNewCell(x, y, value));
        }
    }
};

// Item onclick event - select and change position item:

let currentSellectCell;
let allowSelection = true;

const cellClick = (event) =>{
    if(!allowSelection){
        return;
    }
    allowSelection = false;
    const newPositionX = parseInt(event.target.getAttribute('data-x'));
    const newPositionY = parseInt(event.target.getAttribute('data-y'));
    let currentSelectX;
    let currentSelectY;
    if(currentSellectCell != undefined){
        currentSelectX = parseInt(currentSellectCell.getAttribute('data-x'));
        currentSelectY = parseInt(currentSellectCell.getAttribute('data-y'));
    }
    if((currentSelectX === newPositionX && currentSelectY === newPositionY - 1) || 
        (currentSelectX === newPositionX && currentSelectY === newPositionY + 1) ||
        (currentSelectX === newPositionX - 1 && currentSelectY === newPositionY) ||
        (currentSelectX === newPositionX + 1 && currentSelectY === newPositionY)){
        toggleCells(currentSellectCell, event.target);
        const resultFindMatches = findMatches();
        setTimeout(() => {
            if(resultFindMatches.hasBlocks){
                searchRecursiveBlocks(resultFindMatches);
            }else{
                toggleCells(event.target, currentSellectCell);
                setTimeout(() => {
                    allowSelection = true;
                }, animationMilliseconds);
            }
        }, animationMilliseconds);
    } else{
        if(currentSellectCell != undefined){
            currentSellectCell.classList.remove('grid-cell-selected');
        }
        event.target.classList.add('grid-cell-selected');
        currentSellectCell = event.target;
        allowSelection = true;
    }
}

const toggleCells = (cellA, cellB) =>{
    const aX = parseInt(cellA.getAttribute('data-x'));
    const aY = parseInt(cellA.getAttribute('data-y'));
    const aValue = cellA.getAttribute('data-value');
    const aLeft = cellA.style.left;
    const aTop = cellA.style.top;

    const bX = parseInt(cellB.getAttribute('data-x'));
    const bY = parseInt(cellB.getAttribute('data-y'));
    const bValue = cellB.getAttribute('data-value');
    const bLeft = cellB.style.left;
    const bTop = cellB.style.top;

    cellA.setAttribute('data-x', bX);
    cellA.setAttribute('data-y', bY);
    cellA.setAttribute('data-value', bValue);
    cellA.style.left = bLeft;
    cellA.style.top = bTop;

    cellB.setAttribute('data-x', aX);
    cellB.setAttribute('data-y', aY);
    cellB.setAttribute('data-value', aValue);
    cellB.style.left = aLeft;
    cellB.style.top = aTop;

    matrixData[aY][aX] = parseInt(bValue);
    matrixData[bY][bX] = parseInt(aValue);
}

// Find Matches, keep positions and remove blocks:

const findMatches = () =>{
    let blocksHorizontal = [];
    let blocksVertical = [];
    for(let i = 0; i < matrixData.length; i ++){
        for(let j = 0; j < matrixData[i].length; j ++){
            if(j < matrixData[i].length - 2 && matrixData[i][j] == matrixData[i][j + 1] && matrixData[i][j] == matrixData[i][j +2]){
                blocksHorizontal.push(`${i},${j}`);
                blocksHorizontal.push(`${i},${j + 1}`);
                blocksHorizontal.push(`${i},${j + 2}`);
            }
            if(i < matrixData.length - 2 && matrixData[i][j] == matrixData[i + 1][j] && matrixData[i][j] == matrixData[i + 2][j]){
                blocksVertical.push(`${i},${j}`);
                blocksVertical.push(`${i + 1},${j}`);
                blocksVertical.push(`${i + 2},${j}`);
            }
        }
    }
    const blocksHorizontalFilter = blocksHorizontal.filter(function (value, index){
        return blocksHorizontal.indexOf(value) == index;
    })
    const blocksVerticalFilter = blocksVertical.filter(function (value, index){
        return blocksVertical.indexOf(value) == index;
    })
    const hasBlocks = blocksHorizontalFilter.length > 0 || blocksVerticalFilter.length > 0;
    const resultObj = {
        hasBlocks: hasBlocks, 
        blocksHorizontal: blocksHorizontalFilter, 
        blocksVertical: blocksVerticalFilter
    }
    return resultObj;
}

const removeBlocks = (findBlocks, onCompleteRemoveBlocks) =>{
    let cellsToRemove = [];
    for(let i = 0; i < grid.childNodes.length; i ++){
        const cell = grid.childNodes[i];
        const cellX = cell.getAttribute('data-x');
        const cellY = cell.getAttribute('data-y');
        if(findBlocks.blocksHorizontal.includes(`${cellY},${cellX}`) || findBlocks.blocksVertical.includes(`${cellY},${cellX}`)){
            cell.style.transform = 'scale(0)';  
            cellsToRemove.push(cell); 
        }
    }
    setTimeout(() => {
        for(let i = 0; i < cellsToRemove.length; i ++){
            const cell = cellsToRemove[i];
            const cellX = cell.getAttribute('data-x');
            const cellY = cell.getAttribute('data-y');
            grid.removeChild(cell);
            matrixData[cellY][cellX] = 'X';
        }
        moveCellsDown(onCompleteRemoveBlocks);
    }, animationMilliseconds);
}

// Move cells down:

const moveCellsDown = (onCompleteMoveCellsDown) =>{
    for(let i = 0; i < matrixData[0].length; i ++){
        let increaseX = 0;
        for(let j = matrixData.length - 1; j >= 0; j--){
            if(matrixData[j][i] === 'X'){
                increaseX ++;
            } else if(increaseX > 0){
                matrixData[j + increaseX][i] = matrixData[j][i];
                matrixData[j][i] = 'X';
                let cell = findCellByCordinate(i, j);
                const top = cellHeight * (j + increaseX);
                cell.style.top = top + 'px';
                cell.setAttribute('data-y', j + increaseX);
            }
        }
    }
    setTimeout(() =>{
        generateNewRandomCells(() => {
            onCompleteMoveCellsDown();
        });
    }, animationMilliseconds); 
}

const findCellByCordinate = (x, y) => {
    for(const cell of  grid.childNodes){
        const cellX = parseInt(cell.getAttribute('data-x'));
        const cellY = parseInt(cell.getAttribute('data-y'));
        if(cellX == x && cellY == y){
            return cell;
        }
    }
}

// Fill with new cells random:

const generateNewRandomCells = (onComplete) =>{
    let newCells = [];
    for(let i = 0; i < matrixData[0].length; i++){
        for(let j = 0; j < matrixData.length; j ++){
            if(matrixData[j][i] === 'X'){
                matrixData[j][i] = Math.floor(Math.random() * (7 - 1)) + 1;
                let newCell = getNewCell(i, j, matrixData[j][i]);
                newCell.style.transform = 'scale(0)';
                grid.appendChild(newCell);
                newCells.push(newCell);
            }
        }
    }
	setTimeout(() => {
        for(let cell of newCells){
            cell.style.transform = 'scale(1)';
        }
        onComplete();
    }, animationMilliseconds );
}

const getNewCell = (x, y, value) =>{
    let cellDiv = document.createElement('div');
    cellDiv.style.width = cellWidth + 'px';
    cellDiv.style.height = cellHeight + 'px';
    cellDiv.style.left = (x * cellWidth) + 'px';
    cellDiv.style.top = (y * cellHeight) + 'px'; 
    cellDiv.className = 'grid-cell';
    cellDiv.setAttribute('data-x', x);
    cellDiv.setAttribute('data-y', y);
    cellDiv.setAttribute('data-value', value);
    cellDiv.addEventListener('click', cellClick);
    let image = document.createElement("img");
    cellDiv.appendChild(image);
    image.className = "image-cell";
    image.style.pointerEvents = 'none';      
    switch(value){
        case 1:
            image.setAttribute("src","./images/asteroide.png");
            break;
        case 2:
            image.setAttribute("src","./images/astronauta.png");
            break;
        case 3:
            image.setAttribute("src","./images/cohete.png");
            break;
        case 4:
            image.setAttribute("src","./images/extraterrestre.png");
            break;
        case 5:
            image.setAttribute("src","./images/saturno.png");
            break;
        case 6:
            image.setAttribute("src","./images/galaxia.png");
            break;           
    } 
    return cellDiv;
}

// Score:

let score = 0;

const addScore = (blocks) =>{
    score += (blocks.blocksHorizontal.length + blocks.blocksVertical.length) * (100 * combo);
    const displayScore = document.getElementById('score');
    displayScore.innerHTML = score;
}

const resetScore = () =>{
    score = 0;
    document.getElementById('score').innerHTML = '0';
}

// Combo:

let combo = 1;

const addCombo = () =>{
    combo += 1;
    document.getElementById('combo').innerHTML = combo;
}

const resetCombo = () =>{
    combo = 1;
    document.getElementById('combo').innerHTML = combo;
}

// Search recursive blocks:

const searchRecursiveBlocks = (resultFindMatches) => {
    removeBlocks(resultFindMatches, () => {
        addCombo();
        addScore(resultFindMatches);
        const resultObj = findMatches();
        if(resultObj.hasBlocks){
            searchRecursiveBlocks(resultObj);
        }else{  
            resetCombo();
            currentSellectCell = undefined;
            allowSelection = true;
        }
    });
}

// Countdown timer:

let time;
let processID;
const startCountdown = () =>{
    time = 30;
    continueCountDown();
}

const continueCountDown = () => {
    processID = setInterval(() => {
        const timeRemaining = document.getElementById('time-remaining');
        if(time >= 10){
            timeRemaining.innerHTML = `0:${time}`;
        } else if(time >= 0){
            timeRemaining.innerHTML = `0:0${time}`;
        } else{
            clearInterval(processID);
            showFinalScoreAlert();
        }
        time --;
    }, 1000)
}

const pauseConstdown = () => {
    clearInterval(processID);
}

// Game alerts:

const infoButtonOnClick = () =>{
    pauseConstdown();
    showWelcomeAlert(() => {
        continueCountDown();
    });
}

document.getElementById('help-button').addEventListener('click', infoButtonOnClick);

const restartGame = () =>{
    pauseConstdown();
    const configRestartAlert = {
        title: "¿Reiniciar juego?",
        text: "¡Perderás todo el puntaje acumulado!",
        buttons: {
            cancel: "Cancelar",
            newGame: {
                text: "Nuevo juego",
                value: "new-game",
            },
        },
        closeOnClickOutside: false,
    }
    swal(configRestartAlert).then((value) => {
        if(value === "new-game"){
            showGameDifficultyOptionsAlert((level) => {
                startGameByLevel(level);
            });
       } else {
            continueCountDown();
       }
    });
}

document.getElementById('restart-button').addEventListener('click', restartGame);

const showFinalScoreAlert = () =>{
    const configFinalScoreAlert = {title: "¡Juego Terminado!",
            text: `Puntaje Final: ${score}`,
            closeOnClickOutside: false,
            buttons: {
                newGame: {
                    text: "Nuevo juego",
                    value: "new-game"
                },
                restart: {
                    text: "Reiniciar",
                    value: "restart"
                }
            }
        };
        
    swal(configFinalScoreAlert).then((value) =>{
        if(value === "new-game"){
            showGameDifficultyOptionsAlert((level) => {
                startGameByLevel(level);
            });
        } else{
            startGameByLevel(currentLevel);
        }
    });
}