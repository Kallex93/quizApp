const rankBody = document.getElementById('ranking-body');
const backBtn = document.getElementById('back-btn');



function getRanking(callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            console.log(typeof xhttp.response);
            var data = JSON.parse(xhttp.response);
            console.log(data);
            callback(data);
                        
        }
    };

    xhttp.open("GET", "/rankingData", true);
    xhttp.send();
}

function showRankTable(data) {
    
    if(backBtn){
        backBtn.addEventListener('click', backToHome);
    }

    data.forEach(player => {
        
        var newRow = document.createElement('tr');
        var params = [player.name, player.score, player.time, player.date];

        params.forEach(elem => {
            var newTD = document.createElement('td');
            newTD.innerText = elem;
            newRow.appendChild(newTD);
        })

        rankBody.appendChild(newRow);
    });
}

function backToHome() {
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = xhttp.responseURL;
        }
    };
    xhttp.open("GET", "/", true);
    xhttp.send();
}

window.onload = getRanking(showRankTable);