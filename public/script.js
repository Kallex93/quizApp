
function show(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var data = JSON.parse(xhttp.response);
            console.log(data);

            var questions = data.questions;
            
            document.getElementById('question-text').innerHTML = questions[0].question_text;
            
        
        }
    };
    xhttp.open("GET", "questions.json", true);
    xhttp.send();
}

window.addEventListener('load', show);


