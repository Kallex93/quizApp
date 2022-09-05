const startBtn = document.getElementById('start-btn');
const answerButtonsContainer = document.getElementById('answer-buttons');
const questionText = document.getElementById('question-text');


var shuffledQuestions, currentIndex;

if (startBtn) {
    startBtn.addEventListener('click', startGame);
}

async function startGame(){
    console.log("Game Started");

    startBtn.classList.add('hide');
    answerButtonsContainer.classList.remove('hide');

    var question_list;
    currentIndex = 0;
    
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

function nextQuestion(){
    showNextQuestion(shuffledQuestions[currentIndex]);
}

function showNextQuestion(question){
    questionText.innerText = question.question_text;
}

function selectAnswer(){

}


function loadQuestions(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var data = xhttp.response;
            
            console.log("Received: " + data);
            /*
            console.log(data);
            var questions = data.questions;
            document.getElementById('question-text').innerHTML = questions[0].question_text;
            */

            return data;
        
        }
    };
    xhttp.open("GET", "questions.json", true);
    xhttp.send();
}




