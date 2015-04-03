if ( !window.SnakeGame ) {
    window.SnakeGame = {};
}


/*
*  Snake class
*/

window.SnakeGame.Snake = (function() {

    function Snake(game) {
        this.game      = game;
        this.direction = 'right';
        this.step      = 10;
        this.particles = NodeList;
    }


    Snake.prototype.update = function(direction) {
        if (direction === this.direction) return;

        this.particles  = document.getElementsByClassName('snake-particle');

        var coordinates = [],
            cpc         = [],
            _len        = this.particles.length,
            _i          = _len - 1;

        coordinates[0] = this.particles[0].offsetLeft;
        coordinates[1] = this.particles[0].offsetTop;


        switch(direction || this.direction) {
            case 'left':
                if (this.direction === 'right') return;

                if (coordinates[0] === 0) return this.game.restart();

                coordinates[0] -= this.step;
                this.direction = 'left';
            break;

            case 'right':
                if (this.direction === 'left') return;

                if (coordinates[0] === this.game.options.size[0] - 10) return this.game.restart();

                coordinates[0] += this.step;
                this.direction = 'right';
            break;

            case 'up':
                if (this.direction === 'down') return;

                if (coordinates[1] === 0) return this.game.restart();

                coordinates[1] -= this.step;
                this.direction = 'up';
            break;

            case 'down':
                if (this.direction === 'up') return;

                if (coordinates[1] === this.game.options.size[1] - 10) return this.game.restart();

                coordinates[1] += this.step;
                this.direction = 'down';
            break;
        }

        for(; _i >= 1; _i--) {
            cpc[0] = this.particles[_i - 1].offsetLeft;
            cpc[1] = this.particles[_i - 1].offsetTop;

            this.particles[_i].style.left = cpc[0];
            this.particles[_i].style.top  = cpc[1];

            if (coordinates[0] === cpc[0] && coordinates[1] === cpc[1]) {
                return this.game.restart();
            }
        }

        this.particles[0].style.left = this.game.sp[0] = coordinates[0];
        this.particles[0].style.top  = this.game.sp[1] = coordinates[1];

        if (this.game.ac[0] === coordinates[0] && this.game.ac[1] === coordinates[1]) {
            this.upgrade();
            this.game.apple.reset();
        }
    };


    Snake.prototype.upgrade = function() {
        var element = document.createElement('div');
        element.className = 'snake-particle';

        this.game.playground.appendChild(element);
        this.update();
    };


    Snake.prototype.reset = function() {
        while(this.particles[0]) {
            this.particles[0].parentNode.removeChild(this.particles[0]);
        }

        this.direction = 'right';
        this.upgrade();
    };


    return Snake;
})();


/*
*  Apple class
*/

window.SnakeGame.Apple = (function() {

    function Apple(game) {
        this.game        = game;
        this.appended    = false;
    }


    Apple.prototype.get = function() {
        var apple = document.createElement('div'),
            coordinates = [];

        function position(max) {
            return Math.round(Math.random() * (max / 10)) * 10;
        }

        coordinates[0] = position(this.game.options.size[0] - 10);
        coordinates[1] = position(this.game.options.size[1] - 10);

        apple.className  = 'apple';
        apple.style.left = coordinates[0];
        apple.style.top  = coordinates[1];

        return {
            element: apple,
            coordinates: coordinates
        };
    };


    Apple.prototype.reset = function() {
        var apple;

        if (this.appended) {
            this.appended = false;

            this.game.playground
                .removeChild(
                    document.getElementsByClassName('apple')[0]
                );
        }

        apple = this.get();

        this.appended = true;
        this.game.ac  = apple.coordinates;

        this.game.playground.appendChild(apple.element);
        this.game.setColorScheme();

        return apple;
    };


    return Apple;
})();


/*
*  Game class
*/

window.SnakeGame.Game = (function() {

    function Game(options) {
        var game           = this;

        this.playground = document.getElementsByClassName('playground')[0];
        this.body       = document.getElementsByTagName('body')[0];

        this.options        = options || {};
        this.options.size   = options && options.size || [300, 300];
        this.options.speed  = options && options.speed || 200;
        this.options.colors = [
            'gumba',
            'scooter',
            'cool',
            'dude',
            'jock',
            'liger',
            'tiger',
            'hawk',
            'ruby'
        ];

        this.playground.style.width  = this.options.size[0];
        this.playground.style.height = this.options.size[1];

        this.snake = new SnakeGame.Snake(game);
        this.apple = new SnakeGame.Apple(game);

        this.playground.style.width  = this.options.size[0];
        this.playground.style.height = this.options.size[1];

        this.ac = [];
        this.sp = [];

        this.listener = function(event) {
            game.controller(event, game);
        };

        this.run = function() {
            game.update();
        };
    }


    Game.prototype.update = function() {
        this.snake.update();
    };


    Game.prototype.stop = function() {
        clearInterval(this._intervalId);
        window.removeEventListener('keydown', this.listener);
    };


    Game.prototype.restart = function() {
        this.stop();
        this._intervalId = setInterval(this.run, this.options.speed);

        this.snake.reset();
        this.apple.reset();

        window.addEventListener('keydown', this.listener, false);

        return this;
    };


    Game.prototype.controller = function(event, game) {
        switch(event.keyCode) {
            case 37:
                game.snake.update('left');
            break;

            case 39:
                game.snake.update('right');
            break;

            case 38:
                game.snake.update('up');
            break;

            case 40:
                game.snake.update('down');
            break;
        }
    };


    Game.prototype.setColorScheme = function() {
        var colors = this.options.colors;

        function getScheme() {
            return Math.round(Math.random() * (colors.length - 1));
        }

        this.body.className = colors[getScheme()];
    };

    return Game;
})();


/*
*  Create Game instance
*/

var game = new SnakeGame.Game({
    size: [500, 500],
    speed: 70
});

game.restart();
