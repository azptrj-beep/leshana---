const letters = [
"ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
"ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
"ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

let current = 0;

const guideLetter =
document.getElementById("guideLetter");

const canvas =
document.getElementById("writingCanvas");

const ctx =
canvas.getContext("2d");

function updateLetter(){

    guideLetter.textContent =
    letters[current];
}

document
.getElementById("nextLetter")
.addEventListener("click",()=>{

    current++;

    if(current >= letters.length){
        current = 0;
    }

    updateLetter();
});

document
.getElementById("prevLetter")
.addEventListener("click",()=>{

    current--;

    if(current < 0){
        current = letters.length - 1;
    }

    updateLetter();
});

document
.getElementById("clearCanvas")
.addEventListener("click",()=>{

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
});

let drawing = false;

function getPos(e){

    const rect =
    canvas.getBoundingClientRect();

    const touch =
    e.touches
    ? e.touches[0]
    : e;

    return {

        x:
        touch.clientX
        - rect.left,

        y:
        touch.clientY
        - rect.top
    };
}

function startDraw(e){

    drawing = true;

    const pos =
    getPos(e);

    ctx.beginPath();

    ctx.moveTo(
        pos.x,
        pos.y
    );
}

function draw(e){

    if(!drawing) return;

    e.preventDefault();

    const pos =
    getPos(e);

    ctx.lineWidth = 8;

    ctx.lineCap = "round";

    ctx.strokeStyle =
    "#0033a0";

    ctx.lineTo(
        pos.x,
        pos.y
    );

    ctx.stroke();
}

function stopDraw(){

    drawing = false;
}

canvas.addEventListener(
"mousedown",
startDraw
);

canvas.addEventListener(
"mousemove",
draw
);

canvas.addEventListener(
"mouseup",
stopDraw
);

canvas.addEventListener(
"touchstart",
startDraw
);

canvas.addEventListener(
"touchmove",
draw
);

canvas.addEventListener(
"touchend",
stopDraw
);

updateLetter();