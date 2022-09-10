//DOM ELEMENTS & VARIABLES
const questionContainer = document.getElementById('question-container');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const answerButtonsContainer = document.getElementById('answer-buttons');
const questionText = document.getElementById('question-text');
const score = document.getElementById('score');

var shuffledQuestions, currentIndex, tempScore;

if (startBtn) {
    startBtn.addEventListener('click', startGame);
}

if (nextBtn) {
    nextBtn.addEventListener('click', () =>{
        currentIndex++;
        nextQuestion();
    })
}


//LOADS NECESSARY DATA AND STARTS THE GAME
async function startGame(){
    
    console.log("Game Started");
    
    //REMOVE CONTROLS
    startBtn.classList.add('hide');
    answerButtonsContainer.classList.remove('hide');
    var question_list;
    currentIndex = 0;
    tempScore = 0;
    
    //START COUNTING TIME WITH A WEBWORKER
    startWorker();
    
    //LOAD QUESTIONS FILE
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var data = JSON.parse(xhttp.responseText);
            
            console.log("Received (" + (typeof data) + ")" + data);
            question_list = Object.values(data.questions);
            shuffledQuestions = question_list.sort((a, b) => 0.5 - Math.random());
            console.log(question_list);
            nextQuestion();
        }
    };

    xhttp.open("GET", "questions.json", true);
    xhttp.send();

}


//SET GAME WINDOW LAYOUT AND NEXT QUESTION
function nextQuestion(){
    resetButtons();
    showQuestion(shuffledQuestions[currentIndex]);
}


//CLEARS BUTTON STATUS OF THE PREVIOUS QUESTION
function resetButtons(){
    clearStatusClass(questionContainer);
    nextBtn.classList.add('hide');
    while (answerButtonsContainer.firstChild) {
        answerButtonsContainer.removeChild(answerButtonsContainer.firstChild);
    }
}

//CHANGE GAME LAYOUT TO DISPLAY A QUESTION AND HER ANSWER OPTIONS
function showQuestion(question){
    questionText.innerText = question.question_text;
    question.options.forEach(answer => {

        console.log("Button Text = " + answer.text);
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.classList.add('btn-primary');
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }

        button.addEventListener('click', selectAnswer);
        answerButtonsContainer.appendChild(button);

    });
}


//HANDLE THE ANSWER CHOSEN BY THE PLAYER AND SHOW RESULTS GRAPHICALLY.
//PREPARES FOR THE NEXT QUESTION OR ENDS THE GAME
function selectAnswer(e){
    const selected = e.target;
    const correct = selected.dataset.correct;


    setStatusClass(questionContainer, correct);
    Array.from(answerButtonsContainer.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });

    

    if (shuffledQuestions.length > currentIndex + 1) {
        nextBtn.classList.remove('hide');

    }else{

        //Stop counting time and store its last value
        
        stopWorker();
        const finalTime = document.getElementById('time').innerHTML;
        console.log("Final Time: " + finalTime);
        questionText.innerText = "The Quiz is over! Press Restart to try Again!";

        startBtn.innerText = 'Restart';
        startBtn.classList.remove('hide');
        //nextBtn.classList.add('hide');
        startBtn.addEventListener('click', backToStart);

        nextBtn.innerText = 'Back to Home';
        nextBtn.addEventListener('click', backToHome);
        
    }

}


function setStatusClass(elem, correct){
    clearStatusClass(elem);

    if(correct){
        elem.classList.add('correct');
    } else {
        elem.classList.add('wrong');
    }

    nextBtn.classList.remove('hide');
}


function clearStatusClass(elem){
    elem.classList.remove('correct');
    elem.classList.remove('wrong');
}


//RESTART
function backToStart(){
    
    //RESET BUTTON STATUS
    nextBtn.innerText = 'Next';
    nextBtn.removeEventListener('click', backToHome);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = xhttp.response;
        }
    };
    xhttp.open("GET", "/", true);
    xhttp.send();
    

}


function backToHome() {
    window.location.reload();
}

