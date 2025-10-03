let canvas = document.getElementById('canvas');

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');

canvas.style.background = 'yellow';

class Circle{
    constructor(x_pos, y_pos, radius, color){
        this.x = x_pos;
        this.y = y_pos;
        this.r = radius;
        this.c = color;
    }
    draw(){
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    isInside(mx, my) {
        let dx = mx - this.x;
        let dy = my - this.y;
        return dx * dx + dy * dy <= this.r * this.r;
    }
}

// Todo os circulos criados
let circulos = [];


// Criar 30 circulos de posições e raios aleatórios
for (let i = 0; i <= 30; i++) {
    rand_x = Math.floor(Math.random() * width);
    rand_y = Math.floor(Math.random() * height);
    rand_r = Math.floor(Math.random() * 100) + 10;
    
    let newcircle = new Circle(rand_x, rand_y, rand_r, 'red');
    circulos.push(newcircle);
    newcircle.draw();
}

// Verificar colisões e ajustar posições
function colisao() {
    for (let i = 0; i < circulos.length; i++) {
        for (let j = i + 1; j < circulos.length; j++) {
            let c1 = circulos[i];
            let c2 = circulos[j];

            let dx = c2.x - c1.x;
            let dy = c2.y - c1.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            let minDist = c1.r + c2.r;

            if (dist < minDist && dist > 0) {
                // quanto eles estão se sobrepondo
                let overlap = (minDist - dist) / 2;

                // normalizar vetor direção
                let nx = dx / dist;
                let ny = dy / dist;

                // Se um deles está sendo arrastado, só mover o outro
                if (c1 === draggingCircle) {
                    c2.x += nx * (overlap * 2);
                    c2.y += ny * (overlap * 2);
                } else if (c2 === draggingCircle) {
                    c1.x -= nx * (overlap * 2);
                    c1.y -= ny * (overlap * 2);
                } else {
                    // Empurrar os dois igualmente
                    c1.x -= nx * overlap * 0.1;
                    c1.y -= ny * overlap * 0.1;
                    c2.x += nx * overlap * 0.1;
                    c2.y += ny * overlap * 0.1;
                }
            }
        }
    }
}

// --- Drag & Drop ---
let draggingCircle = null;
let offsetX = 0;
let offsetY = 0;

canvas.addEventListener('mousedown', (e) => {
    let rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;

    for (let c of circulos) {
        if (c.isInside(mx, my)) {
            draggingCircle = c;
            offsetX = mx - c.x;
            offsetY = my - c.y;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (draggingCircle) {
        let rect = canvas.getBoundingClientRect();
        let mx = e.clientX - rect.left;
        let my = e.clientY - rect.top;

        draggingCircle.x = mx - offsetX;
        draggingCircle.y = my - offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    draggingCircle = null;
});

// Loop de animação
function animate() {
    ctx.clearRect(0, 0, width, height);
    
    colisao(); // ajusta posições
    
    for (let c of circulos) {
        c.draw();
    }
    
    requestAnimationFrame(animate);
}
console.log(circulos);
animate();