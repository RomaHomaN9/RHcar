const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const CW = (canvas.width = 300);
const CH = (canvas.height = 500);
const block = 1;

let isGameOver = false;

const gameOver = () => {
    isGameOver = true;
    document.querySelector("#game-over-window").style.display = "flex";
    document.querySelector("#game-over-score").textContent = Math.floor(score.current * 10) / 10;
};

const score = {
    current: 0,

    update(dt) {
        this.current += (dt * car.speedY) / 400;
        car.speedY += dt * 0.00001;
    },
    render() {
        console.log(this.current);
    },
};

const road = {
    array: [],
    block: {
        x: 140,
        width: 20,
        height: 50,
    },

    newBlockTime: 100,
    currentBlockTime: 0,

    update(dt) {
        this.currentBlockTime += dt;

        if (this.currentBlockTime >= this.newBlockTime / car.speedY) {
            this.currentBlockTime = 0;
            this.array.push(-this.block.height);
        }

        for (let i = 0; i < this.array.length; i++) {
            this.array[i] += dt * car.speedY;

            if (this.array[i] >= CH) this.array.shift();
        }
    },
    render() {
        ctx.fillStyle = "#fff";
        for (let i = 0; i < this.array.length; i++) {
            ctx.fillRect(
                this.block.x * block,
                this.array[i] * block,
                this.block.width * block,
                this.block.height * block,
            );
        }
    },
};

const box = {
    array: [],
    blockWidth: 70,

    newBlockTime: 300,
    currentBlockTime: 0,

    update(dt) {
        this.currentBlockTime += dt;

        if (this.currentBlockTime >= this.newBlockTime / car.speedY) {
            this.currentBlockTime = 0;
            this.array.push([
                (CW - this.blockWidth - car.speedX) / 2 + (Math.random() > 0.5 ? car.speedX : 0),
                -this.blockWidth,
            ]);
        }

        for (let i = 0; i < this.array.length; i++) {
            this.array[i][1] += dt * car.speedY;

            if (this.array[i][1] >= CH) {
                this.array.shift();
                continue;
            }

            if (
                car.y < this.array[i][1] + this.blockWidth &&
                car.y + car.height > this.array[i][0] &&
                this.array[i][0] >= CW / 2 == car.posRight
            ) {
                gameOver();
            }
        }
    },
    render() {
        ctx.fillStyle = "#8a6b05";
        for (let i = 0; i < this.array.length; i++) {
            ctx.fillRect(
                this.array[i][0] * block,
                this.array[i][1] * block,
                this.blockWidth * block,
                this.blockWidth * block,
            );
        }
    },
};

const car = {
    x: 60,
    y: CH - 120,
    width: 50,
    height: 100,

    speedY: 0.2,
    speedX: 130,
    posRight: false,

    color: "#00f",

    update(dt) {},

    render() {
        ctx.fillStyle = this.color;

        ctx.fillRect(
            (this.x + this.speedX * this.posRight) * block,
            this.y * block,
            this.width * block,
            this.height * block,
        );
    },
};

const game = {
    oldTime: new Date().getMilliseconds(),

    update() {
        const time = new Date().getMilliseconds();
        let dt = time - this.oldTime;
        this.oldTime = time;

        if (dt < 0) dt += 1000;

        road.update(dt);
        box.update(dt);
        score.update(dt);
    },
    render() {
        ctx.clearRect(0, 0, CW, CH);

        road.render();
        car.render();
        box.render();
        score.render();
    },
    loop() {
        if (isGameOver) return;
        game.render();
        game.update();
        requestAnimationFrame(game.loop);
    },
};

requestAnimationFrame(game.loop);

document.addEventListener("touchstart", () => {
    car.posRight = !car.posRight;
});

document.querySelector("#restart-game").addEventListener("click", () => {
    window.location.reload();
});
