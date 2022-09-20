const theTimer = document.querySelector('.timer');
const testArea = document.querySelector('#test-area');
const wrapper = document.querySelector('#test-wrapper');
const originText = document.querySelector('#origin-text p').innerHTML;
const resetBtn = document.querySelector('#reset');

var timer = [0, 0, 0, 0];
var timerRunnig = true;
var interval;

function leadingZero(time) {

    if (time <= 9) {
        time = "0" + time;
    }

    return time;
}


function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);

    theTimer.innerHTML = currentTime;

    timer[3]++;

    timer[0] = Math.floor((timer[3] / 100) / 60);
    timer[1] = Math.floor(timer[3] / 100) - (timer[0] * 60);
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));



}



function start() {

    let userTypeLenght = testArea.value.length;

    if (userTypeLenght == 0 && timerRunnig) {

        timerRunnig = false;
        interval = setInterval(runTimer, 10);

    }

}

function check() {

    let userType = testArea.value;
    let originTextMatch = originText.substring(0, userType.length);

    if (userType == originText) {

        wrapper.style.borderColor = 'green';
        clearInterval(interval);

    } else {
        if (userType == originTextMatch) {

            wrapper.style.borderColor = 'yellow';

        } else {

            wrapper.style.borderColor = 'red';
        }
    }

   

}

function reset () {
    clearInterval(interval); 
    testArea.value = "";
    timer = [0,0,0,0];
    wrapper.style.borderColor = 'gray';
    timerRunnig = true;
    theTimer.innerHTML = '00.00.00'
  }

testArea.addEventListener('keypress', start);
testArea.addEventListener('keyup', check);
resetBtn.addEventListener('click' , reset)