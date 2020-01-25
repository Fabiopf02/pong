function validate() {
    let player1 = document.querySelector('input#p1');
    let player2 = document.querySelector('input#p2');
    let points = document.querySelector('input#maxPoints');
    var mpoints, p1, p2;
    if(player1.value && player2.value && points.value && points.value > 0) {
        p1 = player1.value;
        p2 = player2.value;
        if(p1 === p2) {
            p1 += '1'; 
            p2 += '2';
            player1.value = p1;
            player2.value = p2;
        }
        mpoints = points.value;
    } else {
        if(!player1.value) {
            player1.value = p1 = "Player1";
        } 
        else {
            p1 = player1.value;
        } 
        if(!player2.value) {
            player2.value = p2 = "Player2";
        }
        else {
            p2 = player2.value;
        }
        if(!points.value || points.value <= 0) {
            points.value = mpoints = 8;
        }
        else {
            if(!Number.isInteger(points.value))
                mpoints = points.value = Math.round(points.value);
        }
    }
    game(p1, p2, mpoints);
}