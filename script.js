// Grab the main parts of the page we need to work with
var testWrapper = document.querySelector(".test-wrapper");
var testArea = document.querySelector("#test-area");
var originTextElement = document.querySelector("#origin-text p");
var originText = originTextElement.innerHTML;
var resetButton = document.querySelector("#reset");
var theTimer = document.querySelector(".timer");
var wpmSpan = document.querySelector("#wpm");
var errorsSpan = document.querySelector("#errors");
var bestList = document.querySelector("#best-times");

// This will hold all our random paragraphs
// 2.7  - **Content Randomization:** Create an array of at least 5 different text paragraphs in your JavaScript file.
var paragraphs = [
  "This is a typing test. Your goal is to duplicate the provided text, EXACTLY, in the field below. The timer starts when you start typing, and only stops when you match this text exactly. Good Luck!",
  "Typing is a useful skill that gets better with practice. When you time yourself, you can see real progress over many days of work.",
  "JavaScript lets us make web pages feel alive. We can check what you type, measure time, and change colors when you make a mistake.",
  "When you learn to code, it is normal to make many mistakes. The important part is that you keep trying and fix each problem slowly.",
  "This project uses a simple timer and some basic rules. Your job is to type each letter the right way and try to beat your best time."
];

// Timer values and control
var timerHundredths = 0;     // how many hundredths of a second have passed
var timerRunning = false;    // true when the timer is moving
var timerInterval = null;    // will store the setInterval id

// Extra counters for stats
var errorCount = 0;          // how many times we go into a wrong state
var lastState = "correct";   // can be "correct" or "wrong"

// This will hold our best times in hundredths
var bestTimes = [];

/*
  1.1 - **Standard Timer:** Implement a minute/second/hundredths timer (00:00:00).
*/
// Make a number always show two digits (for example 5 becomes "05")
function leadingZero(number) {
  if (number < 10) {
    return "0" + number;
  } else {
    return "" + number;
  }
}

/*
  1.1 - **Standard Timer:** Implement a minute/second/hundredths timer (00:00:00).
*/
// This function runs every 1/100 of a second and updates the timer text
function runTimer() {
  // Add one hundredth of a second
  timerHundredths = timerHundredths + 1;

  // Work out minutes, seconds, and hundredths from the total
  var minutes = Math.floor(timerHundredths / 6000);             // 100 * 60
  var seconds = Math.floor((timerHundredths / 100) % 60);
  var hundredths = timerHundredths % 100;

  // Build a string like "00:00:00"
  var timerString =
    leadingZero(minutes) + ":" +
    leadingZero(seconds) + ":" +
    leadingZero(hundredths);

  // Show that string on the page
  theTimer.innerHTML = timerString;
}

/*
  1.4 - **Reset Logic:** The "Start Over" button must clear the text area, reset the timer to zero, and revert any visual state changes.
  2.7  - **Content Randomization:** Create an array of at least 5 different text paragraphs in your JavaScript file.
  2.8  - **Content Randomization:** Each time the "Start Over" button is clicked, a random paragraph from the array should be injected into the #origin-text p element.
*/
// Pick a random paragraph and reset the test to a clean start
function resetTest() {
  // Stop the timer if it is running
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }
  timerInterval = null;
  timerRunning = false;
  timerHundredths = 0;

  // Reset timer display back to zero
  theTimer.innerHTML = "00:00:00";

  // Clear the text area
  testArea.value = "";

  // Put the border back to grey (normal state)
  testWrapper.style.borderColor = "grey";

  // Reset error counter and state
  errorCount = 0;
  lastState = "correct";
  errorsSpan.innerHTML = "0";

  // Reset WPM display
  wpmSpan.innerHTML = "0";

  // Pick a random paragraph from the array
  var randomIndex = Math.floor(Math.random() * paragraphs.length);
  originText = paragraphs[randomIndex];
  originTextElement.innerHTML = originText;

  // Put the cursor in the text area so student can start typing
  testArea.focus();
}

/*
  1.2 - **Input Validation:** Compare the user's input in the textarea with the provided origin text.
  2.1  - **Dynamic Visual Feedback:** The border color of the `.test-wrapper` must change in real-time.
  2.2  - **Blue:** While typing and matching the text correctly.
  2.3  - **Orange/Red:** If a typo is detected (input doesn't match the substring of the origin).
  2.4  - **Green:** When the test is successfully completed.
  2.10 - **Error Counter:** Keep track of how many times the user makes a mistake (mismatching characters) during a single session.
  2.9  - **WPM (Words Per Minute):** Calculate and display the WPM using the standard formula: `(Total Characters / 5) / (Total Seconds / 60)`.
  2.5  - **Top Three Fastest Scores:** Display the Top Three Fastest Scores on the page.
*/
// Check what the user typed and update colors and stats
function spellCheck() {
  // Get the text the user has typed so far
  var textEntered = testArea.value;

  // Get the part of the original text that matches the length of the typed text
  var originMatch = originText.substring(0, textEntered.length);

  // If the whole text matches exactly, the test is done
  if (textEntered === originText && textEntered.length > 0) {
    // Set border to green for success
    testWrapper.style.borderColor = "green";

    // Stop the timer
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
    timerRunning = false;
    timerInterval = null;

    // Work out WPM
    // Total characters in the full text
    var totalChars = originText.length;
    // Total seconds from hundredths
    var totalSeconds = timerHundredths / 100;
    // Avoid divide by zero
    if (totalSeconds > 0) {
      var wpm = (totalChars / 5) / (totalSeconds / 60);
      // Round to nearest whole number
      wpm = Math.round(wpm);
      wpmSpan.innerHTML = "" + wpm;
    }

    // Update and show best times list
    saveBestTime(timerHundredths);
    showBestTimes();
  }
  // If the text is still matching so far (correct so far)
  else if (textEntered === originMatch) {
    // Set border to blue for correct typing so far
    testWrapper.style.borderColor = "blue";

    // We are now in a correct state
    lastState = "correct";
  }
  // If there is a typo (does not match the start of originText)
  else {
    // Set border to red/orange for error
    testWrapper.style.borderColor = "orange";

    // Only count a new error when we move from correct to wrong
    if (lastState === "correct") {
      errorCount = errorCount + 1;
      errorsSpan.innerHTML = "" + errorCount;
    }

    // We are now in a wrong state
    lastState = "wrong";
  }
}

/*
  1.3 - **Event Handling:** Use appropriate event listeners for keyboard input (to start/check the test) and button clicks (to reset).
*/
// Start the timer when the user types the first character
function startTimer() {
  // Only start if text area is not empty and timer is not running yet
  if (!timerRunning && testArea.value.length === 0) {
    timerRunning = true;

    // Start running runTimer every 10 milliseconds (1/100 second)
    timerInterval = setInterval(runTimer, 10);
  }
}

/*
  2.5  - **Top Three Fastest Scores:** Display the Top Three Fastest Scores on the page.
  2.6  - **These scores must persist across browser refreshes using the `localStorage` API.**
*/
// Load best times from localStorage when the page starts
function loadBestTimes() {
  // localStorage is new. It lets the browser remember data even after refresh.
  var stored = localStorage.getItem("bestTimes");

  if (stored) {
    // We store times as a simple comma list like "200,350,400"
    var parts = stored.split(",");
    bestTimes = [];

    var i;
    for (i = 0; i < parts.length; i++) {
      var value = Number(parts[i]);
      if (!isNaN(value) && value > 0) {
        bestTimes.push(value);
      }
    }

    // Sort best times from fastest (smallest) to slowest (largest)
    bestTimes.sort(function (a, b) {
      return a - b;
    });

    // Keep only top three
    if (bestTimes.length > 3) {
      bestTimes = bestTimes.slice(0, 3);
    }
  } else {
    bestTimes = [];
  }

  showBestTimes();
}

/*
  2.5  - **Top Three Fastest Scores:** Display the Top Three Fastest Scores on the page.
*/
// Save a new time into the bestTimes list and localStorage
function saveBestTime(newTime) {
  // Add the new time to the list
  bestTimes.push(newTime);

  // Sort from fastest to slowest
  bestTimes.sort(function (a, b) {
    return a - b;
  });

  // Keep only top three best times
  if (bestTimes.length > 3) {
    bestTimes = bestTimes.slice(0, 3);
  }

  // Turn list into simple string like "200,350,400"
  var parts = [];
  var i;
  for (i = 0; i < bestTimes.length; i++) {
    parts.push("" + bestTimes[i]);
  }
  var saveString = parts.join(",");

  // Save to localStorage so it stays after refresh
  localStorage.setItem("bestTimes", saveString);
}

/*
  2.5  - **Top Three Fastest Scores:** Display the Top Three Fastest Scores on the page.
*/
// Show best times list in the <ol> element
function showBestTimes() {
  // Clear what is there now
  bestList.innerHTML = "";

  var i;
  for (i = 0; i < bestTimes.length; i++) {
    // Convert stored hundredths into mm:ss:hh string
    var total = bestTimes[i];
    var minutes = Math.floor(total / 6000);
    var seconds = Math.floor((total / 100) % 60);
    var hundredths = total % 100;

    var line =
      leadingZero(minutes) + ":" +
      leadingZero(seconds) + ":" +
      leadingZero(hundredths);

    var li = document.createElement("li");
    li.innerHTML = line;
    bestList.appendChild(li);
  }
}

/*
  1.3 - **Event Handling:** Use appropriate event listeners for keyboard input (to start/check the test) and button clicks (to reset).
*/
// When user presses a key down in the text area, try to start the timer
testArea.addEventListener("keydown", startTimer);

// When user lets go of a key, check the text
testArea.addEventListener("keyup", spellCheck);

// When user clicks the reset button, reset everything
resetButton.addEventListener("click", resetTest);

/*
  1.4 - **Reset Logic:** The "Start Over" button must clear the text area, reset the timer to zero, and revert any visual state changes.
*/
// Also run resetTest once when the page first loads
resetTest();

// Load best times from localStorage right away when the page loads
loadBestTimes();