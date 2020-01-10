// destructure the MatterJS global object!
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

const width = 800;
const height = 600;

// create an engine
const engine = Engine.create();
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

// add in MouseConstraint for clicking and dragging!
World.add(
    // choose which world to add it into
    world,
    // create a MouseConstraint object that is linked to the engine, and linked to a mouse object on the canvas
    MouseConstraint.create(engine, {
        // render a mouse on the canvas
        mouse: Mouse.create(render.canvas)
    })
);

// Walls
const walls = [
    Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
    Bodies.rectangle(800, 300, 40, 600, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
    Bodies.rectangle(0, 300, 40, 600, { isStatic: true })
];

// add the walls to the world
World.add(world, walls);

// Random Shapes
for (let i = 0; i < 20; i++) {
    if (Math.random() > 0.5) {
        World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50));
    } else {
        // create a circle (radius)
        // pass in an options object!
        World.add(
            world,
            Bodies.circle(Math.random() * width, Math.random() * height, 35, {
                // pass in a render object to render
                render: {
                    fillStyle: '#54efaa'
                }
            })
        );
    }
}
