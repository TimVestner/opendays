function clickedConcept(name) {
    if (document.getElementById(name).classList.contains("clickableConcept") && activeConcept != name) {
        activeConcept = name;
    } else {
        activeConcept = "";
    }
    updateElements();
}

function clickedExample(name) {
    if (document.getElementById(name).classList.contains("clickableExample") && activeExample != name) {
        activeExample = name;
    } else {
        activeExample = "";
    }
    updateElements();
}
function reset() {
    const allElements = document.querySelectorAll('*')
    allElements.forEach(el => el.classList.remove('incorrectConcept'))
    allElements.forEach(el => el.classList.remove('incorrectExample'))

}
function updateElements() {

    if (activeConcept == activeExample + "_concept") {
        correctGuesses++;
        solvedItems.push(activeConcept);
        solvedItems.push(activeExample);
        activeConcept = "";
        activeExample = "";
    } else if (activeConcept != "" && activeExample != "") {
        incorrectGuesses++;
        document.getElementById(activeConcept).classList.remove("activeConcept");
        document.getElementById(activeExample).classList.remove("activeExample");
        document.getElementById(activeConcept).classList.add("incorrectConcept");
        document.getElementById(activeExample).classList.add("incorrectExample");
        activeConcept = "";
        activeExample = "";
        setTimeout(reset, 1000);
    }

    var clickableConcepts = document.getElementsByClassName('clickableConcept');
    for (var i = 0, j = clickableConcepts.length; i < j; i++) {
        if (solvedItems.includes(clickableConcepts[i].id)) {
            clickableConcepts[i].classList.add("solvedConcept");
            clickableConcepts[i].nextElementSibling.style.display = "none";
        } else if (activeConcept == clickableConcepts[i].id) {
            clickableConcepts[i].classList.add("activeConcept");
            clickableConcepts[i].nextElementSibling.style.display = "block";
        } else {
            clickableConcepts[i].classList.remove("activeConcept");
            clickableConcepts[i].nextElementSibling.style.display = "none";
        }
    }

    var clickableExamples = document.getElementsByClassName('clickableExample');
    for (var i = 0, j = clickableExamples.length; i < j; i++) {
        if (solvedItems.includes(clickableExamples[i].id)) {
            clickableExamples[i].classList.add("solvedExample");
        } else if (activeExample == clickableExamples[i].id) {
            clickableExamples[i].classList.add("activeExample");
        } else {
            clickableExamples[i].classList.remove("activeExample");
        }
    }

    var solvedStuff = document.querySelectorAll(".solvedConcept, .solvedExample");
    for (var i = 0, j = solvedStuff.length; i < j; i++) {
        solvedStuff[i].classList.remove("activeConcept");
        solvedStuff[i].classList.remove("clickableConcept");
        solvedStuff[i].classList.remove("activeExample");
        solvedStuff[i].classList.remove("clickableExample");
    }

    updateScore();
    checkIfComplete();
}
function wrongClick(e) {
    incorrectGuesses++;
    updateScore();
    var d = document.createElement("div");
    d.className = "wrongClickEffect";
    d.style.top = e.clientY + "px"; d.style.left = e.clientX + "px";
    document.body.appendChild(d);
    d.addEventListener('animationend', function () { d.parentElement.removeChild(d); }.bind(this));
}
function correctClick(e) {
    var d = document.createElement("div");
    d.className = "correctClickEffect";
    d.style.top = e.clientY + "px"; d.style.left = e.clientX + "px";
    document.body.appendChild(d);
    d.addEventListener('animationend', function () { d.parentElement.removeChild(d); }.bind(this));
}
function updateScore() {
    // var startingScore = parseInt(localStorage.teamList.filter({ teamName: currentTeam }).map('Score').value()[0]);
    var teamArray = JSON.parse(localStorage.teamList);
    var startingScore = parseInt(teamArray[teamArray.findIndex(obj => obj.Teamname == localStorage.currentTeam)].Score);
    var score = startingScore + correctGuesses*5 - incorrectGuesses;
    document.getElementById("correctGuesses").innerHTML = correctGuesses;
    document.getElementById("incorrectGuesses").innerHTML = incorrectGuesses;
    document.getElementById("score").innerHTML = score;
}
function checkIfComplete() {
    if (solvedItems.length == toSolve*2) {
        document.getElementById("continue").innerHTML = "Continue to next area &gt;";
        document.getElementById("continue").classList.remove("skip");
        document.getElementById("continue").classList.add("continue");
    }
}
function nextTask(whatsNext) {
    var teamArray = JSON.parse(localStorage.teamList);
    var startingScore = parseInt(teamArray[teamArray.findIndex(obj => obj.Teamname == localStorage.currentTeam)].Score);
    var score = startingScore + correctGuesses * 5 - incorrectGuesses;
    teamArray[teamArray.findIndex(obj => obj.Teamname == localStorage.currentTeam)].Score = score;
    localStorage.teamList = JSON.stringify(teamArray);
    window.location.href = whatsNext;
}

function populateHighScores() {
    let teamList = JSON.parse(localStorage.getItem('teamList'));
    let listplace = 0;
    let displayplace = 0;
    let previousScore = 999;
    if (teamList == null) {
        return;
    }
    teamList.sort(function (a, b) { return a.Score - b.Score });
    teamList.reverse();
    for (let i = 0; i < 10; i++) {
        listplace++;
        if (teamList[i] == null) { return; }
        const name = teamList[i].Teamname;
        const score = teamList[i].Score;
        if (score != previousScore) { displayplace = listplace; }
        previousScore = score;
        let parentList = document.getElementById("scorelist");
        var entry = document.createElement('li');
        // entry.appendChild(document.createTextNode("<span>" + displayplace + ". " + name + ": </span><span>" + score + "</span>"));
        entry.innerHTML = displayplace + ". " + score + " points <span class='namelisting'>" + name + "</span>";
        parentList.appendChild(entry);
    }
}