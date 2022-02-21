const answer = document.querySelector('.answer');
const inp = document.getElementById('inp');
const btn = document.getElementById('btn');

const info = document.getElementById('info');
const error = document.getElementById('error');
const winner = document.querySelector('.winner');

const test = document.getElementById('test');
const save = document.getElementById('save');
const show = document.getElementById('show');
const score = document.getElementById('score');
const list = document.querySelector('.list');
const exit = document.querySelector('.exit');

//Generation random value.
let randomValue;

function getRandomValue(min, max) {
    const numbers = [];

    for (let i = 0; i < 10; i++) {
		numbers.push(Math.floor(Math.random() * (max - min)) + min);
	}
	return numbers;
}

randomValue = getRandomValue(0, 9);

//Getting unique digits.
function getCorrectValue(arr) {
    (randomValue[0] === 0) ? (randomValue[0] = randomValue[0] + 1) : 1;

    for (let i = 0; i < randomValue.length; i++) {
        let result = [];

        for (let item of arr) {
            if (!result.includes(item)) {
                result.push(item);
            }
        }
        return result;
    }
}

let message = getCorrectValue(randomValue);

let correctArray = message.slice(0,4);
answer.innerHTML = correctArray.join('');

//Using a hint.
const secret = document.querySelector('.secret');
secret.addEventListener('click', changeColor);

function changeColor() {
    answer.style.color = 'orangered';
    setTimeout(() => answer.style.color = 'blue', 1000);
}

//Searching for matches.
let counter = 0;

function checkInputValue(ev) {
    ev.preventDefault();

    const input = inp.value.split('').map(item => +item);
	let isFlag = false;
    let sheep = 0;
    let ram = 0;

	for (let i = 0; i < input.length; i++) {
		for (let j = i + 1; j < input.length; j++) {
			if (input[i] === input[j]) {
				isFlag = true;
			}
		}
	}

    counter++; //The number of attempts.

    if (input.length < 4 || input[0] === 0 || isFlag) {
        error.classList.add('visible');
    } else {
        error.classList.remove('visible');
        
        for (let i = 0; i < 4; i++) {
			correctArray.forEach((item, index) => {
				if (item === input[i] && index === i) {
					ram = ram + 1;
				} else if (item === input[i]) {
					sheep = sheep + 1;
				}
			});
		}

		info.innerHTML = `You have: ${ram} ram(s) and ${sheep} sheep(s).`;
    }

    (ram === 4) ? document.body.classList.add('gameover-active') : 1;
}

btn.addEventListener('click', checkInputValue);

//Saving data to local storage.
let winners = [];
if (localStorage.getItem('winners')) {
    winners = JSON.parse(localStorage.getItem('winners'));
}

function saveGameScore(ev) {
    ev.preventDefault();

    if (test.value !== '') {
        const nick = test.value;
        score.innerHTML = `${nick}, you won in ${counter} step(s).`
        
        winners.push({
            'winner': nick,
            'steps': counter
        });

        localStorage.setItem('winners', JSON.stringify(winners));
        test.value = '';
    } else {
        score.innerHTML = 'Fill out the form above.';
        score.style.color = 'orangered';
    }
}

save.addEventListener('click', saveGameScore);

//Getting data from local storage.
function checkWinnerList(ev) {
    ev.preventDefault();

    winners = JSON.parse(localStorage.getItem('winners'));
    winners.sort((a, b) => a.move - b.move);

    list.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        list.innerHTML += `<li>${winners[i].winner}: ${winners[i].steps} step(s).</li>`
    }
}

show.addEventListener('click', checkWinnerList);

//Restarting game.
function restartGame() {
    document.body.classList.remove('gameover-active');
    inp.value = '';
}
  
exit.addEventListener('click', restartGame);
