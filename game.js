// En este repo, te ayudaremos a generar el tablero. Tendrás el código inicial para comenzar a trabajar en el proyecto.
// No te distraigas con los detalles; enfocate en la lógica

// Primero, veamos las dimensiones del tablero (alto y ancho)

const gameOfLife = {
  width: 12,
  height: 12,
  stepInterval: null, // Guarda el ID del intervalo de tiempo con el que se actualiza el tablero
  getCoordsOfCell: function (cell) {
    const cellId = cell.id; // '0-0'
    const idSplit = cellId.split("-"); // ['0', '0']
    return idSplit.map(function (str) {
      return parseInt(str, 10);
    });
  },
  selectCellWithCoords: function (x, y) {
    return document.getElementById(x + "-" + y);
  },
  getCellStatus: function (cell) {
    return cell.getAttribute("data-status");
  },
  setCellStatus: function (cell, status) {
    cell.className = status;
    cell.setAttribute("data-status", status);
  },
  toggleCellStatus: function (cell) {
    if (this.getCellStatus(cell) === "dead") {
      this.setCellStatus(cell, "alive");
    } else {
      this.setCellStatus(cell, "dead");
    }
  },
  createAndShowBoard: function () {
    // Crea el elemento <table>
    const goltable = document.createElement("tbody");

    // Ahora, este bloque construirá la tabla HTML
    let tablehtml = "";
    for (let h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (let w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // El siguiente bloque de código agregará la tabla a #board
    const board = document.getElementById("board");
    board.appendChild(goltable);
    // Una vez que añade los elementos HTML a la página, agregale los eventos
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    /*
      Escribí forEachCell acá. Debe visitar
      cada celda en el tablero. Para eso, llamá a la "iteratorFunc",
      y pasale a la Función la celda y sus coordenadas (x, y).
      Por ejemplo: iteratorFunc(cell, x, y)
    */
    const cells = document.querySelectorAll("td"); // NodeList
    cells.forEach((cell) => {
      const coords = this.getCoordsOfCell(cell);
      iteratorFunc(cell, coords[0], coords[1]);
    });
  },

  setupBoardEvents: function () {
    // Cada celda del tablero tiene un ID CSS con el formato "x-y"
    // en la cual "x" es el eje horizontal e "y" es el vertical.
    // Tené en cuenta esto para loopear a través de todos los IDs.
    // Asignales eventos que permitan al usuario clickear en las
    // celdas para configurar el estado inicial del juego
    // (antes de clickear "Step" o "Auto-Play").

    // 🛎 Recordá: Clickear en una celda debería cambiar su estado (entre "alive" y "dead").
    // Una celda "alive" estará pintada de rojo y una celda "dead" de gris.

    // Tené en cuenta el siguiente modelo para un click event en una sola celda (0-0).
    // 📛 Luego, discutí con tu pareja de pair-programming: ¿Cómo harías para aplicarlo a todo el tablero?

    const onCellClick = (e) => {
      this.toggleCellStatus(e.target);
    };

    this.forEachCell(function (cell, coordX, coordY) {
      cell.addEventListener("click", onCellClick);
    });
    document
      .getElementById("step_btn")
      .addEventListener("click", () => this.step());
    document
      .getElementById("auto_btn")
      .addEventListener("click", () => this.enableAutoPlay());
    document
      .getElementById("clear_btn")
      .addEventListener("click", () => this.clear());
    document
      .getElementById("random_btn")
      .addEventListener("click", () => this.resetRandom());
  },

  getNeighbors: function (cell) {
    const neighbors = [];
    const [coordX, coordY] = this.getCoordsOfCell(cell); // Ex: [2,5]
    // A los lados
    neighbors.push(this.selectCellWithCoords(coordX - 1, coordY)); // left
    neighbors.push(this.selectCellWithCoords(coordX + 1, coordY)); // right
    // Arriba
    neighbors.push(this.selectCellWithCoords(coordX - 1, coordY - 1)); // left
    neighbors.push(this.selectCellWithCoords(coordX, coordY - 1)); // middle
    neighbors.push(this.selectCellWithCoords(coordX + 1, coordY - 1)); // right
    // Abajo
    neighbors.push(this.selectCellWithCoords(coordX - 1, coordY + 1)); // left
    neighbors.push(this.selectCellWithCoords(coordX, coordY + 1)); // middle
    neighbors.push(this.selectCellWithCoords(coordX + 1, coordY + 1)); // right

    return neighbors.filter(
      (neighborCell) =>
        neighborCell !== null && this.getCellStatus(neighborCell) === "alive"
    );
  },

  step: function () {
    // La Función step() revisará la situación actual del tablero y lo actualizará, de acuerdo a las reglas del juego.
    // Hacé un bucle que determine si la celda debe estar viva o no, según el estado de sus vecinos.
    // Dentro de esta Función, deberás:
    // 1. Crear un contador para saber cuántos vecinos vivos tiene una celda.
    // 2. Configurar el siguiente estado de todas las celdas (según la cantidad de vecinos vivos).
    const cellsToToggle = [];
    this.forEachCell((cell, coordX, coordY) => {
      const neighborsCount = this.getNeighbors(cell).length;
      if (this.getCellStatus(cell) === "alive") {
        if (neighborsCount !== 2 && neighborsCount !== 3) {
          cellsToToggle.push(cell);
        }
      } else {
        if (neighborsCount === 3) {
          cellsToToggle.push(cell);
        }
      }
    });
    cellsToToggle.forEach((cell) => this.toggleCellStatus(cell));
  },
  enableAutoPlay: function () {
    // Auto-Play comienza corriendo la Función step() automáticamente.
    // Lo hace de forma repetida durante el intervalo de tiempo configurado previamente.
    const btn = document.getElementById("auto_btn");
    if (this.stepInterval) {
      this.stopAutoPlay();
      btn.innerText = "AUTO";
    } else {
      this.stepInterval = setInterval(() => this.step(), 200);
      btn.innerText = "PAUSE";
    }
  },
  stopAutoPlay: function () {
    clearInterval(this.stepInterval);
    this.stepInterval = null;
  },
  clear: function () {
    this.forEachCell((cell, coordX, coordY) =>
      this.setCellStatus(cell, "dead")
    );
  },
  resetRandom: function () {
    this.forEachCell((cell, coordX, coordY) => {
      if (Math.random() > 0.5) {
        this.setCellStatus(cell, "dead");
      } else {
        this.setCellStatus(cell, "alive");
      }
    });
  },
};

gameOfLife.createAndShowBoard();