// =========================
// Timed Typing Test Script
// =========================

// 1.1 Standard Timer: numbers for minutes, seconds, and hundredths of a second
let timerNumbers = [0, 0, 0]; // [minutes, seconds, hundredths]

// 1.1 Standard Timer: this holds the id from setInterval so we can stop it later
let timerIntervalId = null;

// 1.1 Standard Timer: this flag tells us if the timer is already running
let timerIsRunning = false;

// 2.10 Error Counter: how many times the user makes a mistake in this run
let errorCount = 0;

// 2.9 WPM: we keep the last WPM value here for display
let currentWpm = 0;

// 2.7 Random Paragraphs: at least 5 pieces of text for the user to type
const paragraphList = [
  "Here, then, is the problem which we present to you, stark and dreadful and inescapable:",
  "Shall we put an end to the human race; or shall mankind renounce war?",
  "The darkest places in hell are reserved for those who maintain their neutrality in times of moral crisis.",
  "If we choose, we can live in a world of comforting illusion.",
  "Human language appears to be a unique phenomenon, without significant analogue in the animal world.",
  "Education has a value in itself, regardless of the economic impact it produces on society."
];

// 2.5 and 2.6 Top Scores: this array holds the fastest results
let topScores = [];

// Grab elements from the page so we can change them with JavaScript
// 1.2 Input Validation: we read the original text from this element
const originTextElement = document.querySelector("#origin-text p");

// 1.2 Input Validation: we compare the user's typing in this textarea
const testArea = document.getElementById("test-area");

// 1.1 Standard Timer: we show the time in this span
const timerDisplay = document.getElementById("timer");

// 1.4 Reset Logic: this button lets the user start over
const resetButton = document.getElementById("reset-button");

// 2.1-2.4 Dynamic Visual Feedback: this wrapper border changes color
const testWrapper = document.getElementById("test-wrapper");

// 2.9 WPM: we write the words per minute here
const wpmDisplay = document.getElementById("wpm-display");

// 2.10 Error Counter: we write the error count here
const errorDisplay = document.getElementById("error-display");

// 2.5 and 2.6 Top Scores: we draw the top three scores into this list
const scoresList = document.getElementById("scores-list");

// 2.10 Error Counter: keep track of the last typing state so we do not
// add error points over and over for the same wrong stretch
let lastTypingState = "neutral"; // can be "neutral", "correct", "error", "complete"

// 1.1 Standard Timer: format a number so it always has two digits like 04 or 12
function formatTwoDigits(number) {
  // If the number is smaller than 10, add a zero at the front
  return number < 10 ? "0" + number : number.toString();
}






//*********************************************************************************/
// Item 12: The Visual State Machine: Explain how you manipulated testWrapper.style.borderColor for Blue, Red, and Green states.

// 2.1-2.4 Dynamic Visual Feedback: set the wrapper border color class
function setBorderState(stateName) {
  // First remove all border classes so we do not mix styles
  testWrapper.classList.remove(
    "border-neutral",
    "border-correct",
    "border-error",
    "border-complete"
  );

  // Then add the class that matches the new state
  if (stateName === "neutral") {
    testWrapper.classList.add("border-neutral"); // gray border for starting state
  } else if (stateName === "correct") {
    testWrapper.classList.add("border-correct"); // blue border for correct typing so far
  } else if (stateName === "error") {
    testWrapper.classList.add("border-error"); // red border for a typo in the current text
  } else if (stateName === "complete") {
    testWrapper.classList.add("border-complete"); // green border for successfully finishing the test
  }
  //*********************************************************************************/

  // 2.10 Error Counter: remember this state so we can see when we enter an error
  lastTypingState = stateName;
}

// 1.1 Standard Timer: update the timer numbers every 10 milliseconds
function runTimerTick() {
  // Add one hundredth of a second
  timerNumbers[2]++;

  // If hundredths reach 100, turn them into 1 second
  if (timerNumbers[2] >= 100) {
    timerNumbers[2] = 0;
    timerNumbers[1]++;
  }

  // If seconds reach 60, turn them into 1 minute
  if (timerNumbers[1] >= 60) {
    timerNumbers[1] = 0;
    timerNumbers[0]++;
  }

  // Build the display string in the form MM:SS:HH
  const displayText =
    formatTwoDigits(timerNumbers[0]) +
    ":" +
    formatTwoDigits(timerNumbers[1]) +
    ":" +
    formatTwoDigits(timerNumbers[2]);

  // 1.1 Standard Timer: show the new time on the page
  timerDisplay.textContent = displayText;
}

// 1.1 Standard Timer: start the timer if it is not running yet
function startTimerIfNeeded() {
  // Only start the timer once, on the first input
  if (!timerIsRunning) {
    // Start calling runTimerTick every 10 milliseconds
    timerIntervalId = setInterval(runTimerTick, 10);
    timerIsRunning = true;
  }
}

// 1.1 and 1.4: stop the timer when test is done or user resets
function stopTimer() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
  timerIsRunning = false;
}

// 2.9 WPM: calculate words per minute using the given formula
function calculateWpm(totalCharactersTyped) {
  // Count how many full "words" this text has if we say 5 characters per word
  const wordsTyped = totalCharactersTyped / 5;

  // Turn timerNumbers into the total number of seconds
  const totalSeconds =
    timerNumbers[0] * 60 + timerNumbers[1] + timerNumbers[2] / 100;

  // Protect against divide by zero if something goes wrong
  if (totalSeconds === 0) {
    return 0;
  }

  // Formula from the instructions: (Total Characters / 5) / (Total Seconds / 60)
  const wpm = (wordsTyped * 60) / totalSeconds;

  // 2.9 WPM: we round to the nearest whole number to keep it easy to read
  return Math.round(wpm);
}

// 2.5 and 2.6 Top Scores: save the topScores array in localStorage
function saveScoresToStorage() {
  // Turn our scores array into a JSON string for localStorage
  const scoresJson = JSON.stringify(topScores);
  localStorage.setItem("typingTestTopScores", scoresJson);
}

// 2.5 and 2.6 Top Scores: read scores from localStorage when the page loads
function loadScoresFromStorage() {
  const stored = localStorage.getItem("typingTestTopScores");

  if (stored) {
    // Turn the JSON string back into a normal array
    topScores = JSON.parse(stored);
  } else {
    topScores = [];
  }
}

// 2.5 and 2.6 Top Scores: show the scores list on the page
function renderScoresList() {
  // First clear any old list items
  scoresList.innerHTML = "";

  // If there are no scores yet, show a simple message
  if (topScores.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No scores yet. Finish a test to add one.";
    scoresList.appendChild(li);
    return;
  }


  // *********************************************************************************/
  // 17. Dynamic Element Creation: Show how your JavaScript creates new <li> tags to display the high score list.

  // For each score, make a list item that shows time, WPM, and errors
  for (let i = 0; i < topScores.length; i++) {  
    const score = topScores[i];                 //Get the current score

    // Create a brand new <li> tag in memory
    const li = document.createElement("li");

    // Show time first, then WPM and errors
    li.textContent =
      score.timeText +
      " - " +
      score.wpm +
      " WPM, " +
      score.errors +
      " error(s)";
    
    // Attach it to the list on the page
    scoresList.appendChild(li);
  }
}
  //*********************************************************************************/

// 2.7 and 2.8 Random Paragraphs: choose one paragraph and place it on the page
function setRandomParagraph() {
  // Pick a random index between 0 and paragraphList.length - 1
  const randomIndex = Math.floor(Math.random() * paragraphList.length);

  // Get the text at that index
  const newText = paragraphList[randomIndex];

  // 2.7 and 2.8: put the random text into the originTextElement
  originTextElement.textContent = newText;
}

// 1.4 Reset Logic and 2.7-2.8 Random Paragraphs: reset the whole typing test
function resetTest() {
  // Stop any running timer
  stopTimer();

  // 1.4 Reset Logic: set timer numbers back to zero
  timerNumbers = [0, 0, 0];
  timerDisplay.textContent = "00:00:00";

  // 1.4 Reset Logic: clear the text area and make it editable again
  testArea.value = "";
  testArea.disabled = false;

  // 2.10 Error Counter: reset error count and show zero
  errorCount = 0;
  errorDisplay.textContent = "0";

  // 2.9 WPM: reset WPM display
  currentWpm = 0;
  wpmDisplay.textContent = "0";

  // 2.1-2.4 Dynamic Visual Feedback: go back to neutral gray border
  setBorderState("neutral");

  // 2.7 and 2.8: load a fresh random paragraph for the new run
  setRandomParagraph();
}

// 1.2 Input Validation and 2.1-2.4 + 2.9 + 2.10: check text while user types
function handleTypingInput() {
  // 1.3 Event Handling: start the timer on the very first input
  startTimerIfNeeded();

  // 1.2 Input Validation: get the original full text and the user's text
  const originText = originTextElement.textContent;
  const userText = testArea.value;

  // Make a slice of the origin that is the same length as what the user typed
  const sliceToCompare = originText.substring(0, userText.length);

  // First check if the full text matches and lengths are the same
  if (userText === originText && userText.length > 0) {
    // 1.2 Input Validation: user finished the test exactly
    // 2.4 Dynamic Visual Feedback: border turns green for success
    setBorderState("complete");

    // 1.1 Standard Timer: stop the timer when done
    stopTimer();

    // 2.9 WPM: calculate words per minute based on total characters
    currentWpm = calculateWpm(userText.length);
    wpmDisplay.textContent = currentWpm.toString();

    // 2.5 and 2.6 Top Scores: add this result to our scores list
    addScoreAndUpdateBoard();

    // After finishing, lock the textarea so user knows test is over
    testArea.disabled = true;

    return; // no more checks needed
  }

  // If not finished, now check if the text typed so far still matches the slice
  if (userText === sliceToCompare) {
    // 2.2 Blue: user is typing correctly so far
    setBorderState("correct");
  } else {
    // We only count a new error when we move from "correct" or "neutral" into "error"
    if (lastTypingState !== "error" && userText.length > 0) {
      // 2.10 Error Counter: this is one new mistake event
      errorCount++;
      errorDisplay.textContent = errorCount.toString();
    }

    // 2.3 Orange/Red: there is a typo right now
    setBorderState("error");
  }
}

// 2.5 and 2.6 Top Scores: add new score, keep only top 3, save, and redraw list
function addScoreAndUpdateBoard() {
  // Build a string for the time, for example "00:32:45"
  const timeText =
    formatTwoDigits(timerNumbers[0]) +
    ":" +
    formatTwoDigits(timerNumbers[1]) +
    ":" +
    formatTwoDigits(timerNumbers[2]);

  // Turn the current timer numbers into a total number of seconds
  const totalSeconds =
    timerNumbers[0] * 60 + timerNumbers[1] + timerNumbers[2] / 100;

  // Make a score object so we can sort and display nicely
  const newScore = {
    timeText: timeText,
    totalSeconds: totalSeconds,
    wpm: currentWpm,
    errors: errorCount
  };

  // Put the new score into the array
  topScores.push(newScore);

  // Sort scores by time from fastest (smallest totalSeconds) to slowest
  topScores.sort(function (a, b) {
    return a.totalSeconds - b.totalSeconds;
  });

  // Keep only the top three fastest scores
  if (topScores.length > 3) {
    topScores = topScores.slice(0, 3);
  }

  // Save the scores to localStorage and redraw the list
  saveScoresToStorage();
  renderScoresList();
}

// -----------------------------
// Event Listeners
// -----------------------------

// 1.3 Event Handling: listen for keyboard input in the textarea
testArea.addEventListener("input", handleTypingInput);

// 1.3 and 1.4 Event Handling + Reset Logic: reset everything when button is clicked
resetButton.addEventListener("click", resetTest);

// -----------------------------
// Initial Page Setup
// -----------------------------

// 2.5 and 2.6 Top Scores: load any old scores from localStorage on page load
loadScoresFromStorage();

// 2.5 and 2.6 Top Scores: draw the loaded scores to the page
renderScoresList();

// 2.7 and 2.8 Random Paragraphs: choose the first random text and set starting state
resetTest();