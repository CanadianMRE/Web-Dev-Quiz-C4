let startScreen = document.getElementById("start-screen");
let quizScreen = document.getElementById("quizbin");
let enterNameScreen = document.getElementById("enter-score");
let highscoreScreen = document.getElementById("highscore");
let answerNotifier = document.getElementById("answer-notifier");
let timeDisplay = document.getElementById("timer-display");
let scoreDisplay = document.getElementById("final-score");
let questionList = document.getElementById("question-list")
let questionMessage = document.getElementById("question");
let scoreboardList = document.getElementById("score-list");
let nameInput = document.getElementById("name-field");

let clearScoreboardButton = document.getElementById("clear-scoreboard-button");
let startButton = document.getElementById("start-button");
let submitScoreButton = document.getElementById("name-submit-button");
let highscoreButton = document.getElementById("highscore-button");

quizScreen.hidden = true;
enterNameScreen.hidden = true;
highscoreScreen.hidden = true;
answerNotifier.hidden = true;
timeDisplay.hidden = true;

// For defining all possible questions in the test
let possibleQuestions = [
    {
        Question: "Arrays in JavaScript can be used to store _____",
        Answer: 3,
        Options: [
            "numbers and strings",
            "other arrays",
            "booleans",
            "all of the above"
        ]
    },
    {
        Question: "Commonly used data types DO NOT include",
        Answer: 2,
        Options: [
            "strings",
            "booleans",
            "alerts",
            "numbers"
        ]
    },
    {
        Question: "The condition in an if / else statement is enclosed within _____",
        Answer: 2,
        Options: [
            "quotes",
            "curly brackets",
            "parenthesis",
            "square brackets"
        ]
    },
    {
        Question: "A very useful tool used during development and debugging for printing contents to the debugger is:",
        Answer: 3,
        Options: [
            "JavaScript",
            "terminal / bash",
            "for loops",
            "console.log"
        ]
    },
    {
        Question: "String values must be enclosed withing _____ when being assigned to variables",
        Answer: 2,
        Options: [
            "commas",
            "curly brackets",
            "quotes",
            "parenthesis"
        ]
    },
];

let usedQuestions = [];

// TODO: Make it so you cannot get the same question twice in a quiz
let questionsPerQuiz = 2;
let timer = 0;
let pauseTimer = false;
let quizInProgress = false;
let currentQuestion;
let score;

// returns true if theres more then one question left
function checkIfQuestionsLeft() {
    console.log("startcheck")
    let count = 0;

    usedQuestions.forEach(element => {
        count ++;
    })

    if (count === possibleQuestions.length) {
        return false;
    } else {
        return true;
    }
}

// Find a question which we haven't displayed yet.
function getNewQuestion() {
    // If we run out of questions, end quiz
    console.log(usedQuestions);
    console.log(possibleQuestions);
    if (!checkIfQuestionsLeft()) {
        displayAnswerNotif("Completed all questions");
        endQuiz();
        return;
    }

    // find an unused question
    currentQuestion = null;
    while (true) {
        let chosenQuestionIndex = Math.floor(Math.random() * possibleQuestions.length)
       
        if (usedQuestions[chosenQuestionIndex] === undefined) {
            usedQuestions[chosenQuestionIndex] = true;
            currentQuestion = possibleQuestions[chosenQuestionIndex];
            break;
        }
    }

    displayQuestion();
}

// Display the question on the webpage
function displayQuestion() {
    questionMessage.textContent = currentQuestion.Question;

    for (const index in currentQuestion.Options) {
        let num = Number(index) + 1;
        questionList.children[index].children[0].textContent = num+") "+currentQuestion.Options[index];
    }
}

// Decriment the timer and end the quiz if it will be equal to or less then 0
function decrimentTimer(number) {
    if (quizInProgress) {
        if (timer - number <= 0) {
            timer = 0;
            endQuiz();
        } else {
            timer -= number;
        }
        timeDisplay.textContent = "Time: "+timer;
    }
}

// Display the scoreboard and pause the quiz if ongoing
function displayScoreboard() {
    if (quizInProgress) {
        pauseTimer = true;
    }

    quizScreen.hidden = true;
    enterNameScreen.hidden = true;
    answerNotifier.hidden = true;
    startScreen.hidden = true;
    timeDisplay.hidden = true;

    highscoreScreen.hidden = false;
    highscoreButton.textContent = "Hide Highscores";
}

// Hide the scoreboard and resume the quiz if it was ongoing
function hideScoreboard() {
    if (quizInProgress) {
        pauseTimer = false;
        highscoreScreen.hidden = true;
        quizScreen.hidden = false;
        timeDisplay.hidden = false;
    } else {
        highscoreScreen.hidden = true;
        startScreen.hidden = false;
    }

    highscoreButton.textContent = "View Highscores";
}

// Notify if the answer was right or not
function displayAnswerNotif(message) {
    answerNotifier.hidden = false;
    answerNotifier.textContent = message;

    // Close notif after 2 seconds
    setTimeout(() => {
        answerNotifier.hidden = true;
        answerNotifier.textContent = "";
    }, 2000);
}

// Clear the scoreboard and re-render it
function clearScoreboard() {
    localStorage.removeItem("scoreboard-data");

    renderScoreboard();
}

// Render the scoreboard from localStorage
function renderScoreboard() {
    scoreboardList.innerHTML = "";

    let boarddata = JSON.parse(localStorage.getItem("scoreboard-data"));
    if (boarddata === null) {
        return;
    }

    boarddata.sort(function(a, b) {
        return b.score - a.score;
    });

    console.log(boarddata)

    boarddata.forEach(element => {
        scoreboardList.innerHTML += "<li>"+element.name+" - "+element.score+"</li>";
    });
}
renderScoreboard();

// this is fired when the user hits the initial submit button after a quiz
// Here we check if our scoreboard data exists then we append the data to it then resave and re-render it
function submitInitials() {
    let name = nameInput.value;

    if (name === "") {
        return;
    }

    let boarddata = JSON.parse(localStorage.getItem("scoreboard-data"));

    if (boarddata === null) {
        boarddata = [
            {
                name: name,
                score: score
            }
        ]
    } else {
        boarddata.push({
            name: name,
            score: score
        });
    }

    localStorage.setItem("scoreboard-data", JSON.stringify(boarddata));

    renderScoreboard();

    startScreen.hidden = false;
    enterNameScreen.hidden = true;
}

// End the quiz by changing needed values and displaying the score
function endQuiz() {
    quizScreen.hidden = true;
    enterNameScreen.hidden = false;
    quizInProgress = false;
    pauseTimer = true;
    timeDisplay.hidden = true;
    scoreDisplay.textContent = "Your final score is "+score;
    
}

// Here we do everything thats needed to begin the quiz
function startQuiz() {
    startScreen.hidden = true;
    quizScreen.hidden = false;
    quizInProgress = true;
    pauseTimer = false;
    timeDisplay.hidden = false;
    score = 0;

    // reset our used questions array
    usedQuestions = [];

    timer = 60;
    decrimentTimer(0);

    // Get our first question
    getNewQuestion();
    
}

// User chose a answer
function recievedAnswer(event) {
    let button = event.target;
    let answerIndex = button.getAttribute("data-index");


    if (answerIndex !== null) {
        console.log(answerIndex)
        if (currentQuestion && Number(currentQuestion.Answer) === Number(answerIndex)) {
            // You got the question right
            score += 1;
            displayAnswerNotif("Correct!");
        } else {
            // You got the question wrong
            score -= 10;
            decrimentTimer(10);
            displayAnswerNotif("Wrong!");
        }

        getNewQuestion();
    }
}

// Our timer for counting down
setInterval(() => {
    if (!pauseTimer) {
        decrimentTimer(1);
    }
}, 1000);

// Button listeners
submitScoreButton.addEventListener("click", submitInitials);
startButton.addEventListener("click", startQuiz);
highscoreButton.addEventListener("click", function(event) {
    // If highscore screen is hidden, show it, otherwise hide it
    if (highscoreScreen.hidden) {
        displayScoreboard();
    } else {
        hideScoreboard();
    }
})
questionList.addEventListener("click", recievedAnswer);
clearScoreboardButton.addEventListener("click", clearScoreboard);