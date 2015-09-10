$(document).ready(function () {
    var canvas = $('#main-canvas')[0];
    var context = canvas.getContext('2d');
    var audio = new Audio('Apple_Bite.mp3');
    
    var gridWidth = 70;
    var gridHeight = 70;
    var gameSpeed = 50;
    
    var snake = new Snake();
    var apples = [];
    
    var opposites = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
    };
    
    canvas.width = 500;
    canvas.height = 500;
    
    function playSound() {
        audio.pause();
        audio.currentTime = 30;
        audio.play();
    }
    
    function Cell(x, y) {
        this.x = Math.round(x);
        this.y = Math.round(y);
        
        Object.freeze(this);
    }
    
    Cell.prototype.on = function (cell) {
        return this.x == cell.x && this.y == cell.y;
    }
    
    function Snake() {
        this.direction = 'up';
        
        var cell = new Cell(Math.round(gridWidth/2), Math.round(gridHeight/2));
        this.cells = [cell, cell, cell];
    }
    
    Snake.prototype.move = function (xspeed, yspeed) {
        var head = this.head();
        
        var newX = (head.x + xspeed + gridWidth) % gridWidth;
        var newY = (head.y + yspeed + gridHeight) % gridHeight;
        
        this.cells.unshift(new Cell(newX, newY));
        this.cells.pop();
    };
    
    Snake.prototype.head = function () {
        return this.cells[0];
    };
    
    Snake.prototype.grow = function () {
        var lastCell = this.cells.pop();
        this.cells.push(lastCell, lastCell);
    };
    
    Snake.prototype.changeDirection = function (direction) {
        if (opposites[direction] !== this.direction) {
            this.direction = direction;
        }
    };
    
    Snake.prototype.didEatItself = function () {
        var head = this.head();
        for (var i = 1; i < this.cells.length; i++) {
            var cell = this.cells[i];
            if (head.on(cell)) return true;
        }
        
        return false;
    };

    Snake.prototype.update = function () {
        switch (this.direction) {
            case 'up':
                this.move(0, -1);
                break;
                
            case 'down':
                this.move(0, 1);
                break;
                
            case 'left':
                this.move(-1, 0);
                break;
                
            case 'right':
                this.move(1, 0);
                break;
        }
    };
    
    Snake.prototype.render = function () {
        this.cells.forEach(function (cell) {
            square('#fff', cell.x, cell.y);
        });
    };
    
    var applesToRemove = [];
    
    function loop() {
        clearBackground();
        
        context.font = '24px serif';
        context.fillStyle = '#fff';
        context.fillText('Score: ' + (snake.cells.length - 3), canvas.width - 120, 20);
        
        apples.forEach(function (apple, index) {
            if (snake.head().on(apple)) {
                gameSpeed -= 1;
                snake.grow();
                applesToRemove.push(index);
                playSound();
            }
        });
        
        while (applesToRemove.length) {
            var i = applesToRemove.pop();
            apples.splice(i, 1);
            createApples();
        }
        
        snake.update();
        
        if (snake.didEatItself()) {
            alert("YOU LOST THE GAME, your score was " + (snake.cells.length - 3));
            newGame();
        }
        
        // RENDER
        context.save();
        context.scale(canvas.width / gridWidth, canvas.height / gridHeight);
        
        snake.render();
        apples.forEach(function (apple) {
            apple.render();
        });
        context.restore();
        
        setTimeout(loop, gameSpeed);
    }
    
    loop();
    
    function clearBackground() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'grey';
        context.fill();
    }
    
    
    function square(colour, x, y){
        context.fillStyle = colour;
        context.fillRect(x,y,1,1);
        
    }
    
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    // APPLES
    function Apple(x,y) {
        this.x = x;
        this.y = y;
        //this.colour = '#f00';
        this.colour = getRandomColor(); //getRandomNumber(255).toString(16);
    }
    
    Apple.prototype.render = function () {
        square(this.colour, this.x, this.y);
    };
    
    function getRandomNumber(num){
        return Math.floor(Math.random() * num) + 1;
    }
    
    function createApples(times) {
        times = times || 1;
        for(var i = 0; i < times;  i++) {
            var apple = new Apple( getRandomNumber(gridWidth), getRandomNumber(gridHeight) );
            apples.push(apple);
        }
        console.log(apples);
    }
    
    
    function newGame() {
        snake = new Snake();
        apples = [];
        createApples(10);
    }
    
    newGame();

    
    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
                snake.changeDirection('left');
            break;
    
            case 38: // up
                snake.changeDirection('up');
            break;
    
            case 39: // right
                snake.changeDirection('right');
            break;
    
            case 40: // down
                snake.changeDirection('down');
            break;
    
            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

});
