let rows = 12;
let cols = 18;

let grid = [];
let mode = "wall";

let start = [0, 0];
let goal = [11, 7];

function makeGrid() {
    let container = document.getElementById("grid");
    container.innerHTML = "";
    container.style.gridTemplateColumns = "repeat(" + cols + ", 25px)";

    grid = [];

    for (let r = 0; r < rows; r++) {
        let row = [];

        for (let c = 0; c < cols; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");

            cell.onclick = function () {
                clickCell(r, c);
            };

            container.appendChild(cell);

            row.push({
                r: r,
                c: c,
                wall: false,
                visited: false,
                prev: null,
                el: cell
            });
        }

        grid.push(row); // ✅ missing push
    }

    draw(); // ✅ was inside loop incorrectly
}

function setMode(m) {
    mode = m;
}

function clickCell(r, c) {
    if (mode === "wall") {
        if (
            (r === start[0] && c === start[1]) ||
            (r === goal[0] && c === goal[1])
        ) return;

        grid[r][c].wall = !grid[r][c].wall;
    }

    if (mode === "start") {
        start = [r, c];
    }

    if (mode === "goal") {
        goal = [r, c];
    }

    draw();
}

function draw() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = grid[r][c].el;

            cell.className = "cell"; // ✅ classname → className

            if (r === start[0] && c === start[1]) { // ✅ removed quotes
                cell.classList.add("start");
            } else if (r === goal[0] && c === goal[1]) {
                cell.classList.add("goal");
            } else if (grid[r][c].wall) {
                cell.classList.add("wall");
            } else if (grid[r][c].visited) {
                cell.classList.add("visited");
            }
        }
    }
}

function runBFS() {
    // reset
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[r][c].visited = false;
            grid[r][c].prev = null;
        }
    }

    let queue = []; // ✅ moved inside function
    queue.push(start);

    grid[start[0]][start[1]].visited = true;

    while (queue.length > 0) {
        let current = queue.shift();
        let r = current[0];
        let c = current[1];

        if (r === goal[0] && c === goal[1]) {
            break;
        }

        let neighbors = [
            [r - 1, c],
            [r + 1, c],
            [r, c - 1],
            [r, c + 1]
        ];

        for (let i = 0; i < neighbors.length; i++) {
            let nr = neighbors[i][0];
            let nc = neighbors[i][1];

            if (
                nr >= 0 && nr < rows &&
                nc >= 0 && nc < cols &&
                !grid[nr][nc].visited &&
                !grid[nr][nc].wall
            ) {
                grid[nr][nc].visited = true;
                grid[nr][nc].prev = current;

                queue.push([nr, nc]); // ✅ missing bracket fixed
            }
        }
    }

    drawPath();
    draw();
}

function drawPath() {
    let path = [];
    let current = goal;

    while (current) {
        let r = current[0];
        let c = current[1];

        path.push([r, c]);
        current = grid[r][c].prev;
    }

    for (let i = 0; i < path.length; i++) {
        let r = path[i][0];
        let c = path[i][1];

        if (
            (r === start[0] && c === start[1]) ||
            (r === goal[0] && c === goal[1])
        ) continue;

        grid[r][c].el.classList.add("path");
    }
}

function resetGrid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[r][c].wall = false;
            grid[r][c].visited = false;
            grid[r][c].prev = null;
        }
    }

    start = [0, 0];
    goal = [rows - 1, cols - 1];

    draw();
}

makeGrid();