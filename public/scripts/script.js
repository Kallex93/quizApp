//DOM ELEMENTS & VARIABLES
const questionContainer = document.getElementById('question-container');
const startBtn = document.getElementById('start-btn');
const rankBtn = document.getElementById('ranking-btn');
const nextBtn = document.getElementById('next-btn');
const answerButtonsContainer = document.getElementById('answer-buttons');
const questionText = document.getElementById('question-text');
const score = document.getElementById('score');

var shuffledQuestions, currentIndex, tempScore, playerName, firstAnswer, uploadCheck;

if (startBtn) {
    startBtn.addEventListener('click', startGame);
}

if (nextBtn) {
    nextBtn.addEventListener('click', () =>{
        currentIndex++;
        nextQuestion();
    })
}

if (rankBtn) {
    rankBtn.addEventListener('click', showRanking)
}


//LOADS NECESSARY DATA AND STARTS THE GAME
async function startGame(){
    
    console.log("Game Started");
    playerName = window.prompt("Insert your nickname to save your score: ");

    //REMOVE CONTROLS
    startBtn.classList.add('hide');
    rankBtn.classList.add('hide');
    answerButtonsContainer.classList.remove('hide');
    var question_list;
    currentIndex = 0;
    tempScore = 0;
    uploadCheck = true;

    //START COUNTING TIME WITH A WEBWORKER
    startWorker();
    
    //LOAD QUESTIONS FILE
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            console.log("Received from: " + xhttp.responseURL);

            var data = JSON.parse(xhttp.responseText);
            
            //console.log("Received (" + (typeof data) + ")" + data);
            question_list = Object.values(data.questions);
            shuffledQuestions = question_list.sort((a, b) => 0.5 - Math.random());
            //console.log(question_list);
            nextQuestion();
        }
    };

    xhttp.open("GET", "src/sample_questions.json", true);
    xhttp.send();

}


//SET GAME WINDOW LAYOUT AND NEXT QUESTION
function nextQuestion(){
    firstAnswer = true;
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

        //console.log("Button Text = " + answer.text);
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
    

    //CHECK CORRECT ANSWER, ADDS POINTS ONLY ON THE FIRST CLICK EVENT FIRED FOR THE CURRENT QUESTION
    if (correct && firstAnswer) {
        tempScore = tempScore + 10;
        score.innerHTML = tempScore;
        
    }

    firstAnswer = false;
    setStatusClass(questionContainer, correct);
    Array.from(answerButtonsContainer.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });

    

    if (shuffledQuestions.length > currentIndex + 1) {
        nextBtn.classList.remove('hide');

    }else{

        //Stop counting time and store its last value
        
        stopWorker();
        const finalTime = parseInt(document.getElementById('time').innerHTML);
        const finalScore = parseInt(document.getElementById('score').innerHTML);
        const date = new Date().toLocaleDateString();

        questionText.innerText = "The Quiz is over! Press Restart to try Again";

        if (uploadCheck) {
            updateDB(playerName,finalScore,finalTime,date);            
        }

        uploadCheck = false;
        startBtn.innerText = 'Restart';
        startBtn.classList.remove('hide');
        //nextBtn.classList.add('hide');
        startBtn.addEventListener('click', backToStart);

        nextBtn.innerText = 'Back to Home';
        nextBtn.addEventListener('click', backToHome);

    }
}


function updateDB(n, s, t, d){

    var xhttp = new XMLHttpRequest();


    let data = {
        name : n,
        score : s,
        time : t,
        date : d
    }

    console.log("New Player Data: " + data);

    xhttp.open('POST', '/', true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            alert(xhttp.responseText);
        }
    }
    xhttp.send(JSON.stringify(data));
    
}


//ADD CORRECT/WRONG FLAGS FROM ANSWERS
function setStatusClass(elem, correct){
    clearStatusClass(elem);

    if(correct){
        elem.classList.add('correct');
    } else {
        elem.classList.add('wrong');
    }
    nextBtn.classList.remove('hide');
}

//REMOVE CORRECT/WRONG FLAGS FROM ANSWERS
function clearStatusClass(elem){
    elem.classList.remove('correct');
    elem.classList.remove('wrong');
}


//RESTART THE QUIZ
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

//GO BACK TO HOME
function backToHome() {
    window.location.reload();
}


function showRanking() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("Redirected to Ranking page...");
            console.log(xhttp.responseURL)
            window.location.href = xhttp.responseURL;
        }
    };

    xhttp.open("GET", "/ranking", true);
    xhttp.send();
}

