 "use strict";

 const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";

 (function() {

    const quoteDisplayElement = id('quote_display');
    const quoteInputElement = id("quote_input");
    const timerElement = id('timer');
    // MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED HERE

    /**
    * Add a function that will be called when the window is loaded.
    */
    window.addEventListener("load", init);

    /**
    * CHANGE: Describe what your init function does here.
    */
    function init() {
      console.log("hi");
      // THIS IS THE CODE THAT WILL BE EXECUTED ONCE THE WEBPAGE LOADS
      renderNewQuote();

      quoteInputElement.addEventListener('input', () => {
        const arrayQuote = quoteDisplayElement.querySelectorAll('span');
        const arrayValue = quoteInputElement.value.split('');
        let correct = true;

        arrayQuote.forEach((characterSpan, index) => {
          const character = arrayValue[index];
          if(character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
          }
          else if(character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
          } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
          }
        })

        if(correct) renderNewQuote();
      })
    }

    function getRandomQuote() {
      return fetch(RANDOM_QUOTE_API_URL)
        .then(Response => Response.json())
        .then(data => data.content);
    }

    async function renderNewQuote() {
      const quote = await getRandomQuote();
      quoteDisplayElement.innerHTML = '';
      quote.split('').forEach(character => {
        const characterSpan = gen('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
      })

      quoteInputElement.value = null;
      startTimer();
    }

    let startTime;
    function startTimer() {
      timerElement.innerText = 90;
      startTime = new Date();
      let timerId = setInterval(() => {
        timer.innerText = 90 - getTimerTime();
        if(Number(timer.textContent) === 0) {
          clearInterval(timerId);
          renderNewQuote();
        }
      }, 1000);
    }

    function getTimerTime() {
      return Math.floor((new Date() - startTime) / 1000);
    }

    /**
    * Make sure to always add a descriptive comment above
    * every function detailing what it's purpose is
    * @param {variabletype} someVariable This is a description of someVariable, including, perhaps, preconditions.
    * @returns {returntype} A description of what this function is actually returning
    */
    function exampleFunction2(someVariable) {
      /* SOME CODE */
      return something;
    }

    /** ------------------------------ Helper Functions  ------------------------------ */
    /**
    * Note: You may use these in your code, but remember that your code should not have
    * unused functions. Remove this comment in your own code.
    */

    /**
    * Returns the element that has the ID attribute with the specified value.
    * @param {string} idName - element ID
    * @returns {object} DOM object associated with id.
    */
    function id(idName) {
      return document.getElementById(idName);
    }

    /**
    * Returns the first element that matches the given CSS selector.
    * @param {string} selector - CSS query selector.
    * @returns {object} The first DOM object matching the query.
    */
    function qs(selector) {
      return document.querySelector(selector);
    }

    /**
    * Returns the array of elements that match the given CSS selector.
    * @param {string} selector - CSS query selector
    * @returns {object[]} array of DOM objects matching the query.
    */
    function qsa(selector) {
      return document.querySelectorAll(selector);
    }

    /**
    * Returns a new element with the given tag name.
    * @param {string} tagName - HTML tag name for new DOM element.
    * @returns {object} New DOM object for given HTML tag.
    */
    function gen(tagName) {
      return document.createElement(tagName);
    }

 })();