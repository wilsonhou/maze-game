// destructure the MatterJS global object!
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 16;
const cellsVertical = 10;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

// create an engine
const engine = Engine.create();
// disable gravity
engine.world.gravity.y = 0;
// destructure the world object included in engine object upon creation
const { world } = engine;
// will show content on screen, pass in options object
const render = Render.create({
    // this is where everything will be rendered, appended!
    element: document.body,
    // which engine to use
    engine: engine,
    options: {
        // pixel values of the canvas object
        width,
        height,
        wireframes: false
    }
});

// run the render object with Render static method 'run'
Render.run(render);
// run the Runner object and link to our engine object
Runner.run(Runner.create(), engine);

// Walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true })
];

// add the walls to the world
World.add(world, walls);

const shuffle = (arr) => {
    // shuffle the array by iterating backwards
    let counter = arr.length;

    // swap with previous!
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        // swap the element!
        [
            arr[counter],
            arr[index]
        ] = [
            arr[index],
            arr[counter]
        ];
    }
    return arr;
};

// refactored to CH/CV
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));
// cells * cells - 1
const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));
// cells - 1 * cells
const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

// console.log(grid);
// console.log(verticals);
// console.log(horizontals);

// create vars pointing towards parts of the grid
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const recurseThroughCell = (row, column) => {
    // if cell at [row, column], RETURN
    if (grid[row][column]) {
        return;
    }

    // Mark this cell as being visited
    grid[row][column] = true;

    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
        [
            row - 1,
            column,
            'up'
        ],
        [
            row,
            column + 1,
            'right'
        ],
        [
            row + 1,
            column,
            'down'
        ],
        [
            row,
            column - 1,
            'left'
        ]
    ]);

    // For each neightbor...
    for (let neighbor of neighbors) {
        const [
            nextRow,
            nextColumn,
            direction
        ] = neighbor;

        // check if neighbor is out of bounds
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue;
        }

        // check if we have visited that neighbor, continue to next neighbor
        if (grid[nextRow][nextColumn]) {
            continue;
        }

        // remove a wall from either horizontals or verticals
        switch (direction) {
            case 'left':
                verticals[row][column - 1] = true;
                break;
            case 'right':
                verticals[row][column] = true;
                break;
            case 'up':
                horizontals[row - 1][column] = true;
                break;
            case 'down':
                horizontals[row][nextColumn] = true;
                break;
        }

        // visit that next cell (recursive call with new row/column)
        recurseThroughCell(nextRow, nextColumn);
    }
};

recurseThroughCell(startRow, startColumn);

// draw walls by iterating through horizontals!
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }

        // each cell is width/cells wide! 200px wide
        // calculate columnIndex and rowIndex here!!!
        const wall = Bodies.rectangle((columnIndex + 0.5) * unitLengthX, (rowIndex + 1) * unitLengthY, unitLengthX, 5, {
            label: 'wall',
            isStatic: true,
            render: {
                fillStyle: '#f32260'
            }
        });

        World.add(world, wall);
    });
});

// draw walls by iterating through horizontals!
verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }

        // each cell is width/cells wide! 200px wide
        // calculate columnIndex and rowIndex here!!!
        const wall = Bodies.rectangle((columnIndex + 1) * unitLengthX, (rowIndex + 0.5) * unitLengthY, 5, unitLengthY, {
            isStatic: true,
            // add labels for easy representations!
            label: 'wall',
            render: {
                fillStyle: '#f32260'
            }
        });

        World.add(world, wall);
    });
});

// Create Goal Rectangle
const goalLength = Math.min(unitLengthX, unitLengthY) / 2;
const goal = Bodies.rectangle(width - unitLengthX / 2, height - unitLengthY / 2, goalLength, goalLength, {
    isStatic: true,
    // add a label for easy identification!
    label: 'goal',
    render: {
        fillStyle: '#45f4e2'
    }
});

World.add(world, goal);

// Create Ball Circle
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
    // add a label for easy identification!
    label: 'ball',
    render: {
        fillStyle: '#f29867'
    }
});

World.add(world, ball);

// use Body object to change properties of a shape! (velocity)
document.addEventListener('keydown', (event) => {
    const { x, y } = ball.velocity;
    if (event.keyCode === 87 || event.keyCode === 38) {
        // MOVE UP
        // update velocity!!!
        Body.setVelocity(ball, { x, y: y - 5 });
    }
    if (event.keyCode === 68 || event.keyCode === 39) {
        // MOVE RIGHT
        // update velocity!!!
        Body.setVelocity(ball, { x: x + 5, y });
    }
    if (event.keyCode === 83 || event.keyCode === 40) {
        // MOVE DOWN
        // update velocity!!!
        Body.setVelocity(ball, { x, y: y + 5 });
    }
    if (event.keyCode === 65 || event.keyCode === 37) {
        // MOVE LEFT
        // update velocity!!!
        Body.setVelocity(ball, { x: x - 5, y });
    }
});

// Win Condition

// event object may get wiped!!!
Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((collision) => {
        const labels = [
            'ball',
            'goal'
        ];

        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            world.gravity.y = 1;

            world.bodies.forEach((body) => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            });

            document.querySelector('.winner').classList.remove('hidden');
        }
    });
});
