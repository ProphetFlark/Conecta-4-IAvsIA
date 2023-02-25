const colores = { 0: "red", 1: "yellow", "-1": "#e1fff4" };
const columnas = ["a", "b", "c", "d", "e", "f", "g", "h"];
let victorias;
let gameOver;
let jugador;
let tablero;
let oponente;
let botonBajoElMouse;

// Función para iniciar un nuevo juego
function juegoNuevo(opcion) {
  document.getElementById("ganadorletra").innerHTML = "";
  document.getElementById("modo").innerHTML = "Modo actual: Humano vs IA";
  // Asigna la opción del oponente y resetea las estadísticas del juego
  oponente = opcion;
  victorias = [];
  gameOver = false;
  jugador = 0;
  // Crea un tablero vacío
  tablero = [
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
  ];
  // Dibuja el tablero en la pantalla
  dibujarTablero();
}

// Inicia un nuevo juego con un oponente AI al cargar la página
juegoNuevo("ai");

// Agrega un listener al botón "New Game AI" para iniciar un nuevo juego contra AI
document.getElementById("newGameAI").addEventListener("click", () => {
  juegoNuevo("ai");
});

// Agrega un listener al botón "AI vs AI" para iniciar un nuevo juego entre dos AI
document.getElementById("AIvsAI").addEventListener("click", () => {
  juegoNuevo("ai");
  document.getElementById("modo").innerHTML = "Modo actual: IA vs IA";
  for (let i = 0; i < 64; i++) {
    if (!gameOver) {
      let profundidad = Math.round(Math.random() * (5 - 3) + 3);
      setTimeout(() => {
        ai(profundidad);
      }, 500);
    } else {
      break;
    }
  }
});

// Esta función se encarga de realizar un movimiento en el tablero, recibiendo como parámetro la columna en la que se desea hacer el movimiento.
function hacerMovimiento(columna) {
  // Buscamos la primera posición libre (que tenga el valor -1) en la columna especificada del tablero.
  let siguienteEspacio = tablero[columna].indexOf(-1);
  // Colocamos la ficha del jugador actual en la posición libre encontrada en la columna especificada.
  tablero[columna][siguienteEspacio] = jugador;
  // Verificamos si el jugador actual ha ganado.
  verificarGanador();
  // Dibujamos el estado actual del tablero en la pantalla.
  dibujarTablero();
  // Cambiamos al siguiente jugador.
  jugador = 1 - jugador;
}

function dibujarTablero(highlightvictorias = true) {
  for (let columna = 0; columna < 8; columna++) {
    for (let fila = 0; fila < 8; fila++) {
      // Obtenemos el elemento HTML correspondiente a la celda actual.
      const celda = document.getElementById(`${columnas[columna]}${fila + 1}`);
      // Establecemos el color de fondo de la celda según el valor de la posición correspondiente en el tablero.
      celda.style.backgroundColor = colores[tablero[columna][fila]];
      // Quitamos cualquier sombra que pudiera haber sido establecida anteriormente en la celda.
      celda.style.boxShadow = "";
    }
  }
  // Si se especificó que se deben destacar las victorias, las resaltamos en el tablero.
  if (highlightvictorias) {
    for (let ganador of victorias) {
      for (let [col, fila] of ganador) {
        // Obtenemos el elemento HTML correspondiente a la celda que forma parte de la victoria actual.
        const celda = document.getElementById(`${columnas[col]}${fila + 1}`);
        // Establecemos una sombra verde alrededor de la celda para destacarla.
        celda.style.boxShadow = "0px 0px 20px 10px #fff";
      }
      document.getElementById("ganadorletra").innerHTML = `Ganador: ${
        jugador == 1 ? "Amarillo" : "Rojo"
      }`;
      document.getElementById("ganadorletra").style.color = `${
        jugador == 1 ? "#b9b900" : "red"
      }`;
    }
  }
}

// Esta función verifica si hay algún ganador en el tablero actual.
function verificarGanador() {
  // Esta función auxiliar recibe un arreglo de elementos y verifica si todos son iguales (y distintos de -1).
  function todosIguales(arr) {
    let primero = arr[0];
    for (let elt of arr) {
      if (elt === -1 || elt !== primero) return false;
    }
    return true;
  }

  // Verificamos todas las posibles combinaciones de 4 fichas consecutivas en el tablero.
  for (let [posibleganador, posibleganadorCoords] of verificarCuatros(
    tablero
  )) {
    // Si todas las fichas son iguales (y distintas de -1), agregamos las coordenadas del posible ganador a la lista de victorias.
    if (todosIguales(posibleganador)) {
      victorias.push(posibleganadorCoords);
    }
  }

  // Si hay al menos una victoria, el juego ha terminado.
  if (victorias.length > 0) {
    gameOver = true;
  }
}

// Función que verifica si hay 4 fichas del mismo color consecutivas en el tablero
function verificarCuatros(tablero) {
  let resultado = []; // arreglo donde se almacenarán los resultados
  let valores; // arreglo para almacenar los valores de las fichas en una secuencia de 4
  let coords; // arreglo para almacenar las coordenadas (fila, columna) de las fichas
  // Verificar secuencias de 4 fichas en forma vertical en cada columna
  for (let columna = 0; columna < 8; columna++) {
    for (let inicioFila = 0; inicioFila < 3; inicioFila++) {
      // se detiene en la fila 4 para evitar índices fuera de rango
      valores = [];
      coords = [];
      for (let i = 0; i < 4; i++) {
        // se agrega cada ficha en la secuencia de 4
        valores.push(tablero[columna][inicioFila + i]);
        coords.push([columna, inicioFila + i]); // se agrega la coordenada de la ficha en el arreglo de coordenadas
      }
      resultado.push([valores, coords]); // se agrega la secuencia de 4 fichas y sus coordenadas al resultado
    }
  }
  // Verificar secuencias de 4 fichas en forma horizontal en cada fila
  for (let fila = 0; fila < 8; fila++) {
    for (let inicioColumna = 0; inicioColumna < 4; inicioColumna++) {
      // se detiene en la columna 4 para evitar índices fuera de rango
      valores = [];
      coords = [];
      for (i = 0; i < 4; i++) {
        // se agrega cada ficha en la secuencia de 4
        valores.push(tablero[inicioColumna + i][fila]);
        coords.push([inicioColumna + i, fila]); // se agrega la coordenada de la ficha en el arreglo de coordenadas
      }
      resultado.push([valores, coords]); // se agrega la secuencia de 4 fichas y sus coordenadas al resultado
    }
  }
  // Verificar secuencias de 4 fichas en forma diagonal hacia la derecha (desde arriba hacia abajo) en cada fila
  for (let inicioColumna = 0; inicioColumna < 4; inicioColumna++) {
    for (let inicioFila = 0; inicioFila < 3; inicioFila++) {
      // se detiene en la fila 3 para evitar índices fuera de rango
      valores = [];
      coords = [];
      for (let i = 0; i < 4; i++) {
        // se agrega cada ficha en la secuencia de 4
        valores.push(tablero[inicioColumna + i][inicioFila + i]);
        coords.push([inicioColumna + i, inicioFila + i]); // se agrega la coordenada de la ficha en el arreglo de coordenadas
      }
      resultado.push([valores, coords]); // se agrega la secuencia de 4 fichas y sus coordenadas al resultado
    }
  }
  // Verificar secuencias de 4 fichas en forma diagonal hacia la izquierda (desde arriba hacia abajo) en cada fila
  for (let inicioColumna = 0; inicioColumna < 4; inicioColumna++) {
    for (let inicioFila = 5; inicioFila > 2; inicioFila--) {
      valores = [];
      coords = [];
      for (let i = 0; i < 4; i++) {
        valores.push(tablero[inicioColumna + i][inicioFila - i]);
        coords.push([inicioColumna + i, inicioFila - i]);
      }
      resultado.push([valores, coords]);
    }
  }
  return resultado;
}

const botones = {};

//FUNCIONALIDAD DE LOS BOTONES
for (let [index, columna] of columnas.entries()) {
  // Itera sobre las columnas y asigna el índice y la columna actual a las variables "index" y "columna", respectivamente.
  botones[columna] = document.getElementById(columna);
  // Obtiene el botón actual a través de su ID y lo asigna a su correspondiente posición en el array "botones".
  botones[columna].addEventListener("mouseover", (event) => {
    // Asigna un evento "mouseover" al botón actual que cambia su fondo al color del jugador actual.
    botones[columna].style.backgroundColor = "rgba(255, 255, 255, 0.5)";
    // Establece la variable "botonBajoElMouse" como la columna actual.
    botonBajoElMouse = columna;
  });
  botones[columna].addEventListener("mouseout", (event) => {
    // Asigna un evento "mouseout" al botón actual que devuelve su fondo a "transparente".
    botones[columna].style.background = "transparent";
    // Establece la variable "botonBajoElMouse" como "indefinido".
    botonBajoElMouse = undefined;
  });
  botones[columna].addEventListener("click", (event) => {
    // Asigna un evento "click" al botón actual que asigna el índice de la columna clickeada a la variable "ultimoClickeado".
    ultimoClickeado = columna;
    // Verifica si el juego no ha terminado, si todavía hay lugares disponibles en la columna y si el oponente es un humano o el jugador es el jugador 0.
    if (
      !gameOver &&
      tablero[index].indexOf(-1) !== -1 &&
      (oponente === "human" || jugador === 0)
    ) {
      // Si se cumplen las condiciones, llama a la función "hacerMovimiento" para que el jugador realice su jugada.
      hacerMovimiento(index);
      // Si el oponente es una IA, llama a la función "ai" después de un breve retraso.
      if (oponente === "ai") setTimeout(aidos, 5);
      // Si el juego no ha terminado y todavía hay lugares disponibles en la columna y el oponente es un humano, establece el fondo del botón al color del jugador actual.
      if (
        !gameOver &&
        tablero[index].indexOf(-1) !== -1 &&
        oponente === "human"
      ) {
        botones[columna].style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      } else {
        // Si no, devuelve el fondo del botón a "transparente".
        botones[columna].style.background = "transparent";
      }
    }
  });
}

//AQUI VIENE LA IA NO PREGUNTEN COMO FUNCIONA.

// Esta función ejecuta el algoritmo de AI para determinar el mejor movimiento que puede hacer la computadora.
function ai(numerorandom) {
  // Si el juego ha terminado, no hacemos nada.
  if (gameOver) return;

  // Llamamos a la función negamax para obtener el mejor movimiento posible.
  let [movimiento, valor] = negamax(tablero, numerorandom, 1);

  // Hacemos el movimiento obtenido.
  hacerMovimiento(movimiento);

  // Si el botón bajo el mouse está definido, cambiamos su color a blanco.
  if (botonBajoElMouse !== undefined)
    document.getElementById(botonBajoElMouse).style.backgroundColor =
      "rgba(255, 255, 255, 0.5)";
}

function aidos() {
  // Si el juego ha terminado, no hacemos nada.
  if (gameOver) return;

  // Llamamos a la función negamax para obtener el mejor movimiento posible.
  let [movimiento, valor] = negamax(tablero, 5, 1);

  // Hacemos el movimiento obtenido.
  hacerMovimiento(movimiento);

  // Si el botón bajo el mouse está definido, cambiamos su color a blanco.
  if (botonBajoElMouse !== undefined)
    document.getElementById(botonBajoElMouse).style.backgroundColor =
      "rgba(255, 255, 255, 0.5)";
}

// Esta función recibe el estado actual del tablero y devuelve un arreglo con las columnas donde se pueden hacer movimientos.
function getcandidatoMovimientos(tableroState) {
  let candidatoMovimientos = [];
  for (let columna = 0; columna < 8; columna++) {
    if (tableroState[columna].indexOf(-1) !== -1)
      candidatoMovimientos.push(columna);
  }
  return candidatoMovimientos;
}

// Esta función recibe dos arreglos de cuatro elementos y verifica si son iguales.
function verificarIguales(arr1, arr2) {
  for (let i = 0; i < 4; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

// Función que determina si el juego ha llegado a su fin
// Recibe como parámetro el estado actual del tablero
// Devuelve true si hay algún jugador que haya logrado cuatro fichas seguidas en línea, ya sea horizontal, vertical o diagonalmente
function terminal(tableroState) {
  for (let [valores, _] of verificarCuatros(tableroState)) {
    if (
      verificarIguales(valores, [0, 0, 0, 0]) ||
      verificarIguales(valores, [1, 1, 1, 1])
    )
      return true;
  }
  return false;
}

// Función que crea una copia del estado actual del tablero
// Recibe como parámetro el estado actual del tablero
// Devuelve una copia del estado actual del tablero
function copy(tableroState) {
  let nuevoTablero = [[], [], [], [], [], [], [], []];
  for (let c = 0; c < 8; c++) {
    for (let r = 0; r < 8; r++) {
      nuevoTablero[c].push(tableroState[c][r]);
    }
  }
  return nuevoTablero;
}

// Función que actualiza el estado del tablero con el movimiento del jugador actual
// Recibe como parámetros el estado actual del tablero, la columna en la que se colocará la ficha y el jugador actual
// Devuelve una copia del estado actual del tablero con el movimiento del jugador actual realizado
function update(tableroState, columna, jugador) {
  let nuevoTablero = copy(tableroState);
  let siguienteEspacio = nuevoTablero[columna].indexOf(-1);
  nuevoTablero[columna][siguienteEspacio] = jugador;
  return nuevoTablero;
}

// Función que calcula el valor heurístico del estado actual del tablero
// Recibe como parámetro el estado actual del tablero
// Devuelve un valor numérico que representa el valor heurístico del estado actual del tablero
function valorHeuristico(tableroState) {
  let valor = 0;
  for (let [valores, _] of verificarCuatros(tableroState)) {
    valor += valorFour(valores);
  }
  return valor;
}

function valorFour(valores) {
  // Asigna un valor de infinito negativo si el arreglo de valores es [0, 0, 0, 0]
  if (verificarIguales(valores, [0, 0, 0, 0])) return -Infinity;
  // Asigna un valor de infinito positivo si el arreglo de valores es [1, 1, 1, 1]
  if (verificarIguales(valores, [1, 1, 1, 1])) return Infinity;
  // Si no es el caso, asigna un valor de 0 a la variable valor
  let valor = 0;
  // Itera sobre cada valor en el arreglo de valores y le asigna el valor correspondiente usando un objeto literal
  for (let piece of valores) {
    valor += { 0: -1, 1: 1, "-1": 0 }[piece];
  }
  return valor;
}

function negamax(tableroState, profundidad, color) {
  // Si se ha alcanzado la profundidad máxima o el juego ha terminado, retorna un arreglo con "na" y el valor heurístico del estado del tablero multiplicado por el color del jugador actual
  if (profundidad === 0 || terminal(tableroState)) {
    return ["na", color * valorHeuristico(tableroState)];
  }
  // Asigna un valor de infinito negativo a la variable valor
  let valor = -Infinity;
  // Asigna el primer movimiento posible como el mejor movimiento
  let mejorMovimiento = getcandidatoMovimientos(tableroState)[0];
  // Itera sobre cada posible movimiento
  for (let movimiento of getcandidatoMovimientos(tableroState)) {
    // Crea un nuevo estado de tablero actualizado con el movimiento actual y el color del jugador actual
    let nuevoTableroState = update(
      tableroState,
      movimiento,
      { 1: 1, "-1": 0 }[color]
    );
    // Recursivamente llama la función negamax con el nuevo estado de tablero actualizado, la profundidad reducida en 1 y el color del jugador cambiado
    let [_, movimientovalor] = negamax(
      nuevoTableroState,
      profundidad - 1,
      -color
    );
    // Invierte el valor del movimiento
    movimientovalor *= -1;
    // Si el valor del movimiento es infinito positivo, retorna un arreglo con el movimiento y el valor
    if (movimientovalor === Infinity) return [movimiento, movimientovalor];
    // Si el valor del movimiento es mayor que el valor actual, asigna el valor del movimiento como el nuevo valor y el movimiento como el nuevo mejor movimiento
    if (movimientovalor > valor) {
      valor = movimientovalor;
      mejorMovimiento = movimiento;
    }
  }
  // Retorna un arreglo con el mejor movimiento y el valor
  return [mejorMovimiento, valor];
}
