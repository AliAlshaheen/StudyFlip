let decks = JSON.parse(localStorage.getItem("decks") || "[]");
const deckNameInput = document.getElementById("deckName");
const deckSelect = document.getElementById("deckSelect");
const cardTerm = document.getElementById("cardTerm");
const cardDef = document.getElementById("cardDef");
const createDeckForm = document.querySelector(".create-deck-form");
const createCardForm = document.querySelector(".create-card-form");
const decksContainer = document.querySelector(".decks");
const studyContainer = document.querySelector(".study-container");
const testContainer = document.querySelector(".test-container");
const studyFront = document.querySelector(".study-card-front");
const studyBack = document.querySelector(".study-card-back");
const studyCard = document.querySelector(".study-card");
const studyCardInner = document.querySelector(".study-card-inner");
const showCreate = document.getElementById("showCreate");
const showDecks = document.getElementById("showDecks");
const createContainer = document.querySelector(".create-container");
const nextCardBtn = document.getElementById("nextCard");
const prevCardBtn = document.getElementById("prevCard");
const endStudyBtn = document.getElementById("endStudy");
const nextQuestionBtn = document.getElementById("nextQuestion");
const endTestBtn = document.getElementById("endTest");
const testQuestionEl = document.querySelector(".test-question");
const testChoicesEl = document.querySelector(".test-choices");
const testResultEl = document.querySelector(".test-result");
let currentDeckIndex = null;
let currentCardIndex = 0;
let testQuestions = [];
let currentQuestionIndex = 0;
function saveDecks() {
  localStorage.setItem("decks", JSON.stringify(decks));
}
function renderDecks() {
  decksContainer.innerHTML = "";
  decks.forEach((d, i) => {
    const el = document.createElement("div");
    el.className = "deck";
    el.innerHTML =
      "<h3>" +
      d.name +
      "</h3><p>" +
      d.cards.length +
      ' card(s)</p><div class="deck-actions"><button onclick="startStudy(' +
      i +
      ')">Study</button><button onclick="startTest(' +
      i +
      ')">Test</button></div>';
    decksContainer.appendChild(el);
  });
  updateDeckSelect();
}
function updateDeckSelect() {
  deckSelect.innerHTML = "";
  decks.forEach((d, i) => {
    const op = document.createElement("option");
    op.value = i;
    op.textContent = d.name;
    deckSelect.appendChild(op);
  });
}
function startStudy(i) {
  currentDeckIndex = i;
  currentCardIndex = 0;
  renderStudyCard();
  createContainer.style.display = "none";
  testContainer.style.display = "none";
  studyContainer.style.display = "flex";
  document.querySelector(".deck-list").style.display = "none";
}
function renderStudyCard() {
  const deck = decks[currentDeckIndex];
  if (!deck || deck.cards.length === 0) return;
  const card = deck.cards[currentCardIndex];
  studyFront.textContent = card.term;
  studyBack.textContent = card.def;
  studyCard.classList.remove("flipped");
}
function nextCardFn() {
  const deck = decks[currentDeckIndex];
  if (currentCardIndex < deck.cards.length - 1) {
    currentCardIndex++;
    renderStudyCard();
  }
}
function prevCardFn() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    renderStudyCard();
  }
}
function endStudyFn() {
  studyContainer.style.display = "none";
  createContainer.style.display = "none";
  testContainer.style.display = "none";
  document.querySelector(".deck-list").style.display = "block";
}
studyCard.addEventListener("click", () => {
  studyCard.classList.toggle("flipped");
});
nextCardBtn.addEventListener("click", nextCardFn);
prevCardBtn.addEventListener("click", prevCardFn);
endStudyBtn.addEventListener("click", endStudyFn);
createDeckForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = deckNameInput.value.trim();
  if (name !== "") {
    decks.push({ name, cards: [] });
    saveDecks();
    deckNameInput.value = "";
    renderDecks();
  }
});
createCardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const term = cardTerm.value.trim();
  const defn = cardDef.value.trim();
  const idx = parseInt(deckSelect.value);
  if (term !== "" && defn !== "" && !isNaN(idx)) {
    decks[idx].cards.push({ term, def: defn });
    saveDecks();
    cardTerm.value = "";
    cardDef.value = "";
    renderDecks();
  }
});
function startTest(i) {
  currentDeckIndex = i;
  testQuestions = generateTestQuestions(decks[i]);
  currentQuestionIndex = 0;
  showQuestion();
  createContainer.style.display = "none";
  studyContainer.style.display = "none";
  testContainer.style.display = "flex";
  document.querySelector(".deck-list").style.display = "none";
}
function generateTestQuestions(deck) {
  let arr = [...deck.cards];
  let qs = [];
  arr.forEach((c) => {
    let incorrectChoices = arr.filter((x) => x !== c);
    incorrectChoices = shuffle(incorrectChoices).slice(0, 3);
    let choices = [c.def, ...incorrectChoices.map((x) => x.def)];
    choices = shuffle(choices);
    qs.push({ question: c.term, answer: c.def, choices });
  });
  return qs;
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}
function showQuestion() {
  const q = testQuestions[currentQuestionIndex];
  if (!q) return;
  testQuestionEl.textContent = q.question;
  testChoicesEl.innerHTML = "";
  testResultEl.textContent = "";
  q.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    testChoicesEl.appendChild(btn);
  });
}
function checkAnswer(choice) {
  const q = testQuestions[currentQuestionIndex];
  if (choice === q.answer) {
    testResultEl.textContent = "Correct!";
  } else {
    testResultEl.textContent = "Incorrect. Correct answer: " + q.answer;
  }
}
function nextQuestionFn() {
  if (currentQuestionIndex < testQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    testResultEl.textContent = "No more questions.";
  }
}
function endTestFn() {
  testContainer.style.display = "none";
  document.querySelector(".deck-list").style.display = "block";
}
nextQuestionBtn.addEventListener("click", nextQuestionFn);
endTestBtn.addEventListener("click", endTestFn);
showCreate.addEventListener("click", () => {
  createContainer.style.display = "flex";
  studyContainer.style.display = "none";
  testContainer.style.display = "none";
  document.querySelector(".deck-list").style.display = "none";
});
showDecks.addEventListener("click", () => {
  createContainer.style.display = "none";
  studyContainer.style.display = "none";
  testContainer.style.display = "none";
  document.querySelector(".deck-list").style.display = "block";
});
renderDecks();
