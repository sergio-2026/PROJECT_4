# Project: Timed Typing Test App

## Purpose

The purpose of this project is to demonstrate an understanding of JavaScript objects, functions, event handling, DOM manipulation, and data persistence. You will expand upon the provided starter code to create a professional-grade typing utility.

## Requirements Overview

You are provided with a basic HTML structure, a CSS stylesheet, and a skeleton JavaScript file. You must implement the logic to make the app functional and interactive.

### 1. Core Functionality

1.1 - **Standard Timer:** Implement a minute/second/hundredths timer (00:00:00).
1.2 - **Input Validation:** Compare the user's input in the textarea with the provided origin text.
1.3 - **Event Handling:** Use appropriate event listeners for keyboard input (to start/check the test) and button clicks (to reset).
1.4 - **Reset Logic:** The "Start Over" button must clear the text area, reset the timer to zero, and revert any visual state changes.

### 2. Advanced Requirements

To receive full credit and satisfy the "Creativity" component of the rubric, you must implement the following:

- **Dynamic Visual Feedback:**
2.1  - The border color of the `.test-wrapper` must change in real-time.
2.2  - **Blue:** While typing and matching the text correctly.
2.3  - **Orange/Red:** If a typo is detected (input doesn't match the substring of the origin).
2.4   - **Green:** When the test is successfully completed.
- **Data Persistence (Local Storage):**
2.5  - Display the **Top Three Fastest Scores** on the page.
2.6  - These scores must persist across browser refreshes using the `localStorage` API.

- **Content Randomization:**
2.7  - Create an array of at least 5 different text paragraphs in your JavaScript file.
2.8  - Each time the "Start Over" button is clicked, a random paragraph from the array should be injected into the `#origin-text p` element.
- **Live Performance Metrics:**
2.9  - **WPM (Words Per Minute):** Calculate and display the WPM using the standard formula: `(Total Characters / 5) / (Total Seconds / 60)`.
2.10  - **Error Counter:** Keep track of how many times the user makes a mistake (mismatching characters) during a single session.

## Grading Rubric

| Category            | Criteria                                                          | Weight |
| :------------------ | :---------------------------------------------------------------- | :----- |
| **Basic Logic**     | Timer functions correctly; input matches origin text exactly.     | 40%    |
| **Visual Feedback** | Border color states (Grey/Blue/Red/Green) are accurately handled. | 20%    |
| **Persistence**     | Top 3 scores are saved and retrieved via LocalStorage.            | 15%    |
| **Code Quality**    | Proper formatting, descriptive variable names, and comments.      | 15%    |
| **UX & Creativity** | Random text selection, WPM/Error tracking, and overall polish.    | 10%    |

## Submission Instructions

Submit your github repo link in canvas. Make sure you add your github pages link in your README.md file.
