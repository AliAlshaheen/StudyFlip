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
const editDeckContainer = document.querySelector(".edit-deck-container");
const editDeckCardsContainer = document.querySelector(".edit-deck-cards");
const deleteDeckBtn = document.getElementById("deleteDeckBtn");
const closeEditDeck = document.getElementById("closeEditDeck");
const editCardContainer = document.querySelector(".edit-card-container");
const editCardForm = document.querySelector(".edit-card-form");
const editCardTerm = document.getElementById("editCardTerm");
const editCardDef = document.getElementById("editCardDef");
const cancelEditCard = document.getElementById("cancelEditCard");
const editDeckAddCardForm = document.querySelector(".edit-deck-add-card-form");
const editDeckNewTerm = document.getElementById("editDeckNewTerm");
const editDeckNewDef = document.getElementById("editDeckNewDef");
let currentDeckIndex = null;
let currentCardIndex = 0;
let testQuestions = [];
let currentQuestionIndex = 0;
let editingDeckIndex = null;
let editingCardIndex = null;

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
      ')">Test</button><button onclick="editDeck(' +
      i +
      ')">Edit</button></div>';
    decksContainer.appendChild(el);
  });
  updateDeckSelect();
}
function updateDeckSelect() {
  deckSelect.innerHTML = "";
  if (decks.length === 0) {
    const placeholder = document.createElement("option");
    placeholder.textContent = "Choose Deck";
    placeholder.disabled = true;
    placeholder.selected = true;
    deckSelect.appendChild(placeholder);
  } else {
    decks.forEach((d, i) => {
      const op = document.createElement("option");
      op.value = i;
      op.textContent = d.name;
      deckSelect.appendChild(op);
    });
  }
}
function startStudy(i) {
  currentDeckIndex = i;
  currentCardIndex = 0;
  renderStudyCard();
  createContainer.style.display = "none";
  testContainer.style.display = "none";
  studyContainer.style.display = "flex";
  document.querySelector(".deck-list").style.display = "none";
  editDeckContainer.style.display = "none";
  editCardContainer.style.display = "none";
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
  editDeckContainer.style.display = "none";
  editCardContainer.style.display = "none";
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
  editDeckContainer.style.display = "none";
  editCardContainer.style.display = "none";
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
  const buttons = document.querySelectorAll(".test-choices button");
  buttons.forEach((b) => {
    b.classList.remove("correct-choice", "incorrect-choice");
    b.disabled = true;
    if (b.textContent === q.answer) {
      b.classList.add("correct-choice");
    } else if (b.textContent === choice && choice !== q.answer) {
      b.classList.add("incorrect-choice");
    }
  });
  if (choice !== q.answer) {
    testResultEl.textContent = "Incorrect. Correct answer: " + q.answer;
  } else {
    testResultEl.textContent = "Correct!";
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
  editDeckContainer.style.display = "none";
  editCardContainer.style.display = "none";
});
showDecks.addEventListener("click", () => {
  createContainer.style.display = "none";
  studyContainer.style.display = "none";
  testContainer.style.display = "none";
  document.querySelector(".deck-list").style.display = "block";
  editDeckContainer.style.display = "none";
  editCardContainer.style.display = "none";
});
function editDeck(i) {
  editingDeckIndex = i;
  renderEditDeck();
  createContainer.style.display = "none";
  studyContainer.style.display = "none";
  testContainer.style.display = "none";
  document.querySelector(".deck-list").style.display = "none";
  editDeckContainer.style.display = "flex";
  editCardContainer.style.display = "none";
}
function renderEditDeck() {
  editDeckCardsContainer.innerHTML = "";
  if (editingDeckIndex === null) return;
  const d = decks[editingDeckIndex];
  d.cards.forEach((c, i) => {
    const cardEl = document.createElement("div");
    cardEl.className = "edit-deck-card";
    cardEl.innerHTML =
      '<div class="edit-deck-card-content"><span>Term: ' +
      c.term +
      "</span><span>Definition: " +
      c.def +
      '</span></div><div class="edit-deck-card-actions"><button onclick="editCard(' +
      i +
      ')">Edit</button><button onclick="deleteCard(' +
      i +
      ')">Delete</button></div>';
    editDeckCardsContainer.appendChild(cardEl);
  });
}
deleteDeckBtn.addEventListener("click", () => {
  if (editingDeckIndex === null) return;
  decks.splice(editingDeckIndex, 1);
  saveDecks();
  editingDeckIndex = null;
  editDeckContainer.style.display = "none";
  document.querySelector(".deck-list").style.display = "block";
  renderDecks();
});
closeEditDeck.addEventListener("click", () => {
  editDeckContainer.style.display = "none";
  document.querySelector(".deck-list").style.display = "block";
});
function deleteCard(i) {
  if (editingDeckIndex === null) return;
  decks[editingDeckIndex].cards.splice(i, 1);
  saveDecks();
  renderEditDeck();
}
function editCard(i) {
  editingCardIndex = i;
  const c = decks[editingDeckIndex].cards[i];
  editCardTerm.value = c.term;
  editCardDef.value = c.def;
  editCardContainer.style.display = "flex";
  editDeckContainer.style.display = "none";
}
editCardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (editingDeckIndex === null || editingCardIndex === null) return;
  const term = editCardTerm.value.trim();
  const def = editCardDef.value.trim();
  if (term !== "" && def !== "") {
    decks[editingDeckIndex].cards[editingCardIndex] = { term, def };
    saveDecks();
    editCardContainer.style.display = "none";
    editDeckContainer.style.display = "flex";
    renderEditDeck();
  }
});
cancelEditCard.addEventListener("click", () => {
  editCardContainer.style.display = "none";
  editDeckContainer.style.display = "flex";
});
editDeckAddCardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (editingDeckIndex === null) return;
  const term = editDeckNewTerm.value.trim();
  const def = editDeckNewDef.value.trim();
  if (term !== "" && def !== "") {
    decks[editingDeckIndex].cards.push({ term, def });
    saveDecks();
    editDeckNewTerm.value = "";
    editDeckNewDef.value = "";
    renderEditDeck();
  }
});
renderDecks();
