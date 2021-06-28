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