var click = 0;
function game(p1, p2, points) {

    click++;
    var t = 3, _KEYS = [], _SPIN = 0, tm, grd, maxPoints = points, _P = true, _W = null, 
    DisplayWinner = false, alpha = 0.0, tgame = null, s = 0, m = 0, h = 0, i = 0;
    const canvas = document.querySelector('#screen');
    const ctx = canvas.getContext("2d");
    const backg = document.querySelector('div#backg');

    if(click === 1) tm = setInterval(time, 1000);

    function time() {
        document.querySelector('#time').innerHTML = t;
        if(t <= 0) {
            clearInterval(tm);
            document.body.removeChild(backg);
            canvas.className = "screen";
            start();
        }
        t--;
    }

    function start() {
        canvas.width = resizeScreen().w;
        canvas.height = resizeScreen().h;

        render();

        window.requestAnimationFrame(start);
    }

    const player1 = {
        name: p1,
        x: 5,
        y: resizeScreen().h/2-35,
        w: 15,
        h: 80,
        speed: 6,
        color: "#fff",
        points: 0,
        tcolor: "#000",
        drawPlayer: function() {
            ctx.fillStyle = this.color;
            ctx.fillRect(player1.x, player1.y, player1.w, player1.h);
            ctx.fill();
        },
        drawPoints: function() {
            ctx.fillStyle = this.tcolor;
            ctx.font = "bold 30px Arial";
            ctx.fillText(`${this.name}: ${this.points}`, resizeScreen().w/3-100, resizeScreen().h/2);
            ctx.fill(); 
        }
    };

    const player2 = {
        name: p2,
        y: resizeScreen().h/2-35,
        x: resizeScreen().w-20,
        w: 15,
        h: 80,
        speed: 6,
        color: "#fff",
        points: 0,
        tcolor: "#000",
        drawPlayer: function() {
            ctx.fillStyle = this.color;
            ctx.fillRect(resizeScreen().w-20, player2.y, player2.w, player2.h);
            ctx.fill();
            this.x = resizeScreen().w-20;
        },
        drawPoints: function() {
            ctx.fillStyle = this.tcolor;
            ctx.fillText(`${this.name}: ${this.points}`, resizeScreen().w-(resizeScreen().w/3)-100, resizeScreen().h/2);
            ctx.fillStyle = "#000";
            ctx.fill(); 
        }
    };

    function sortDirection() {
        return (Math.floor(Math.random() * 2) === 1)?1:-1;
    }

    const ball = {
        x: resizeScreen().w/2,
        y: resizeScreen().h/2,
        r: 10,
        dx: sortDirection(),
        dy: sortDirection(),
        speed: 1.5,
        reset: function() {
            this.x = resizeScreen().w/2;
            this.y = resizeScreen().h/2;
            this.dx = sortDirection();
            this.dy = sortDirection();
            this.speed = 1;
        },
        drawBall: function(offs) {
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.setLineDash([3,3]);
            ctx.lineWidth = 4;
            ctx.lineDashOffset = offs;
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
            ctx.stroke();
            ctx.closePath();
        }
    };

    //move
    document.addEventListener('keydown', (e) => {
        let key = e.keyCode;
        _KEYS[key] = true;
    })
    document.addEventListener('keyup', (e) => {
        let key = e.keyCode;
        delete _KEYS[key];
    })

    function movePlayers() {
        if(87 in _KEYS) {
            if(player1.y > 0) player1.y -= player1.speed;
        }
        if(83 in _KEYS) {
            if(player1.y + player1.h <= resizeScreen().h) player1.y += player1.speed;
        }
        if(38 in _KEYS) {
            if(player2.y > 0) player2.y -= player2.speed;
        }
        if(40 in _KEYS) {
            if(player2.y + player2.h <= resizeScreen().h) player2.y += player2.speed;
        }
    }
    function moveBall() {
        if(ball.y - ball.r <= 0) {
            ball.dy = 1;
        }
        if(ball.y + ball.r > resizeScreen().h) {
            ball.dy = -1;
            ball.speed += 0.15;
        }

        //player1 => ball 
        if(ball.y + ball.r >= player1.y && ball.y - ball.r <= player1.y + player1.h && 
            ball.x - ball.r <= player1.x + player1.w-5) {
                ball.dx = 1;
                ball.speed += 0.5;
                player1.color = "#000";
        } else {
            player1.color = "#fff";
        }

        if(ball.x - ball.r <= 0) {
            updatePoints('player2');
            ball.reset();
        }

        //player2 => ball
        if(ball.y + ball.r >= player2.y && ball.y - ball.r <= player2.y + player2.h &&
            ball.x + ball.r >= player2.x + 5) {
                ball.dx = -1;
                ball.speed += 0.5;
                player2.color = "#000";
        } else {
            player2.color = "#fff";
        }

        if(ball.x + ball.r > resizeScreen().w) {
            updatePoints('player1');
            ball.reset();
        }
        ball.x += ball.speed * ball.dx;
        ball.y += ball.speed * ball.dy;
    }

    function updatePoints(player) {
        if(player === "player1") {
            player1.points++;
            player1.tcolor = "green";
            player2.tcolor = "red";
        }
        else if(player === "player2") {
            player2.points++;
            player2.tcolor = "green";
            player1.tcolor = "red";
        }
        let {_PLAYING, winner} = checkPoints(maxPoints);
        _P = _PLAYING;
        _W = winner;
        if(_PLAYING) {
            setTimeout(() => {
                player1.tcolor =  player2.tcolor = "#000";
            }, 100);
        }
    }

    function checkPoints(mpoints) {
        let winner = null;
        let _PLAYING = true;
        if(player1.points == mpoints) {
            _PLAYING = false;
            winner = player1.name;
        }
        if(player2.points == mpoints) {
            _PLAYING = false;
            winner = player2.name
        }
        return {
            _PLAYING: _PLAYING,
            winner: winner
        }
    }

    function resizeScreen() {
        let width = window.innerWidth;
        let height = window.innerHeight;

        return {
            w: width,
            h: height
        }
    }

    function timeGame() {
        if(_P) i++;
        s = Math.floor(i/80);
        if(s === 60) {
            i = 0;
            m++;
        }
        if(m === 60) {
            m = 0;
            h++;
        }
        return `${(h>=10)?h:'0'+h}:${(m>=10?m:'0'+m)}:${(s>=10?s:'0'+s)}`;
    }

    //draw winner if playing=false
    function drawWinner(alpha, winner) {

        let widthText = getWidth(`'${winner}' venceu!`);
        let widthTime = getWidth(`Tempo: ${timeGame()}`);

        ctx.shadowColor = '#000';
        ctx.shadowBlur = 45;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#000";
        ctx.fillRect(resizeScreen().w/4-50, resizeScreen().h/4-50, resizeScreen().w/2+100, resizeScreen().h/2+100);
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText(`'${winner}' venceu!`, resizeScreen().w/2-widthText, resizeScreen().h/2-50);
        ctx.fillText(`Tempo: ${timeGame()}`, resizeScreen().w/2-widthTime, resizeScreen().h/2+50);
    }

    //get width from text
    function getWidth(text) {
        let el = document.createElement('span');
        el.innerText = text;
        document.body.appendChild(el);

        let width = el.offsetWidth;
        document.body.removeChild(el);

        return width
    }

    function render() {
        ctx.clearRect(0, 0, resizeScreen().w, resizeScreen().h);

        //background
        grd = ctx.createRadialGradient(resizeScreen().w/2, resizeScreen().h/2, resizeScreen().w, resizeScreen().w/2, resizeScreen().h/2, Math.PI*2);
        grd.addColorStop(0, "#777");
        grd.addColorStop(1, "#111");

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, resizeScreen().w, resizeScreen().h);
        ctx.fill();

        if(_P) {
            s++;
            //move
            movePlayers();
            moveBall();

            //time game
            ctx.fillStyle = "#fff";
            ctx.fillText(timeGame(), 30, 15);
        }

        //draw objects
        player1.drawPlayer();
        player2.drawPlayer();
        ball.drawBall(_SPIN);

        //draw points
        player1.drawPoints();
        player2.drawPoints();

        if(!_P) {
            if(!DisplayWinner) {
                setTimeout(() => {DisplayWinner = true}, 1000);
            }
        }

        //line center
        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        ctx.lineDashOffset = 1
        ctx.setLineDash([10, 10]);
        ctx.lineWidth = 3;
        ctx.moveTo(resizeScreen().w/2, 0);
        ctx.lineTo(resizeScreen().w/2, resizeScreen().h);

        ctx.stroke();
        ctx.closePath();

        if(DisplayWinner) {
            if(alpha <= 0.9) alpha+=0.01;
            drawWinner(alpha, _W);
        }

        if(_SPIN > 20) _SPIN = 0;

        _SPIN++;

    }
}