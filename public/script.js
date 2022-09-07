const questionContainer = document.getElementById('question-container');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const answerButtonsContainer = document.getElementById('answer-buttons');
const questionText = document.getElementById('question-text');


var shuffledQuestions, currentIndex;

if (startBtn) {
    startBtn.addEventListener('click', startGame);
}

if (nextBtn) {
    nextBtn.addEventListener('click', () =>{
        currentIndex++;
        nextQuestion();
    })
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
    resetButtons();
    showQuestion(shuffledQuestions[currentIndex]);
}


//Removes buttons from previous question
function resetButtons(){
    clearStatusClass(questionContainer);
    nextBtn.classList.add('hide');
    while (answerButtonsContainer.firstChild) {
        answerButtonsContainer.removeChild(answerButtonsContainer.firstChild);
    }
}

//Display new question in the box, creates answer buttons
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
        startBtn.innerText = 'Restart';
        startBtn.classList.remove('hide');
        nextBtn.classList.add('hide');
        startBtn.addEventListener('click', backToStart);
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


function backToStart(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = xhttp.response;
        }
    };
    xhttp.open("GET", "/", true);
    xhttp.send();
}




