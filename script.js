// Game Initialization Settings:   

const showWelcomeAlert = (onSelectLevel) =>{
    const configWelcomeAlert = {title: "!Bienvenida!",
        text: "En matcheADAs tu objetivo es juntar tres o más items del mismo tipo, ya sea en fila o en columna. Para eso, selecciona un item y a continuación un item adyacente para intercambiarlos de lugar. \n \n Si se forma un grupo, esos items se eliminarán y ganarás puntos. ¡Sigue armando grupos de tres o más antes de que se acabe el tiempo! \n \n Controles \n Click izquierdo: selección. \n Enter o espacio: selección. \n Flechas o WASD: movimiento e intercambio." ,
        button: "A Jugar",
        closeOnClickOutside: false,
    }
    swal(configWelcomeAlert).then((valor) => {
        showGameDifficultyOptionsAlert(onSelectLevel);
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

window.addEventListener('load', showWelcomeAlert((level) => {
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
}));

// Initialize Matrix Game:

const matrixData = [];

const initilizeMatrix = (size) => {
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

const displayGrid = () => {
    let positionY = 0;
    const cellWidth = (grid.offsetWidth / matrixData.length);
    const cellHeight = (grid.offsetHeight / matrixData.length);
    for(let y = 0; y < matrixData.length; y++){
        let positionX = 0;
        for(let x = 0; x < matrixData[y].length; x++){
            let cellDiv = document.createElement('div');
            let image=document.createElement("img");
            image.className = "image-cell";
            image.style.pointerEvents = 'none';
            cellDiv.style.width = cellWidth + 'px';
            cellDiv.style.height = cellHeight + 'px';
            cellDiv.style.left = positionX + 'px';
            cellDiv.style.top = positionY + 'px';
            cellDiv.style.borderRadius = '5px'; 
            cellDiv.className = 'grid-cell';
            cellDiv.setAttribute('data-x', x);
            cellDiv.setAttribute('data-y', y);
            cellDiv.addEventListener('click', cellClick);
            grid.appendChild(cellDiv);
            cellDiv.appendChild(image);
            const value = matrixData[y][x]
            cellDiv.setAttribute('data-value', value);
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
            positionX += cellWidth;
        }
        positionY += cellHeight;
    }
};

// Item onclick event:

let currentSelectX;
let currentSelectY;
let currentSellectCell;

const cellClick = (event) =>{
    const newPositionX = parseInt(event.target.getAttribute('data-x'));
    const newPositionY = parseInt(event.target.getAttribute('data-y'));

    if((currentSelectX == newPositionX && currentSelectY == newPositionY - 1) || 
        (currentSelectX == newPositionX && currentSelectY == newPositionY + 1) ||
        (currentSelectX == newPositionX - 1 && currentSelectY == newPositionY) ||
        (currentSelectX == newPositionX + 1 && currentSelectY == newPositionY)){
        // TODO: add check for blocks and animations. 
    }else{
        if(currentSellectCell != undefined){
            currentSellectCell.classList.remove('grid-cell-selected');
        }
        event.target.classList.add('grid-cell-selected');
        currentSelectX = newPositionX;
        currentSelectY = newPositionY;
        currentSellectCell = event.target;    
    }
}