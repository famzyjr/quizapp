let category = document.getElementById('Category');
let Question = document.getElementById('question');
let Options = document.getElementById('options');
let button = document.querySelectorAll('.option');
let nextBtn = document.querySelector('.next-btn');
let ScoreDiv = document.getElementById('scoreContainer');
let TotalQuestions = document.getElementById('totalQuestions');
let Progressbar = document.getElementById('progressBar');

let rightAnswer = '';
let currentIndex = 0;
let questions = [];
let score = 0;

let api = 'https://opentdb.com/api.php?amount=49&category=31&type=multiple';

async function Quiz() {
  try {
    const response = await fetch(api);
    const data = await response.json();
    questions = data.results;
    TotalQuestions.innerText = `Total Questions: ${questions.length}`;
    showQuestion();
  } catch (error) {
    console.log(error);
  }
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    ScoreRender();
    return;
  }

  const question = questions[currentIndex];
  rightAnswer = question.correct_answer;
  let possibleAnswers = [...question.incorrect_answers];
  possibleAnswers.splice(Math.floor(Math.random() * 4), 0, rightAnswer);

  category.innerText = decodeHTML(question.category);
  Question.innerText = decodeHTML(question.question);

  button.forEach((btn, index) => {
    btn.innerText = decodeHTML(possibleAnswers[index]);
    btn.setAttribute('data-answer', decodeHTML(possibleAnswers[index]));
    btn.disabled = false;
  });

  // Update progress and total
  TotalQuestions.innerText = `Question ${currentIndex + 1} / ${questions.length}`;
  let progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  Progressbar.style.width = `${progress}%`;

  // Hide next button initially
  nextBtn.style.display = 'none';
}

function ScoreRender() {
  ScoreDiv.style.display = 'block';
  const scorePercentage = Math.round((100 * score) / questions.length);

  let imgSrc =
    scorePercentage >= 90 ? "img/5.png" :
      scorePercentage >= 80 ? "img/4.png" :
        scorePercentage >= 60 ? "img/3.png" :
          scorePercentage >= 40 ? "img/2.png" :
            "img/1.png";

  ScoreDiv.innerHTML = `
    <img src="${imgSrc}" alt="result">
    <p>${scorePercentage}% (${score}/${questions.length})</p>
  `;
}

// Handle answer clicks
button.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const selected = e.target.getAttribute('data-answer');
    if (selected === rightAnswer) {

      score++;
    } else {
    }

    // Disable all buttons
    button.forEach(b => b.disabled = true);

    // Show next button
    nextBtn.style.display = 'block';
  });
});

// Handle next question button
nextBtn.addEventListener('click', () => {
  currentIndex++;
  showQuestion();
});

// Optional: keyboard support (e.g., right arrow to move)
document.addEventListener('keydown', (e) => {
  if (e.keyCode === 39 && nextBtn.style.display === 'block') {
    currentIndex++;
    showQuestion();
  }
});

// Helper function to decode HTML entities
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Start the quiz
Quiz();
