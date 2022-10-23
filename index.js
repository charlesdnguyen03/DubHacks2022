"use strict";

const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";

(function() {

   const quoteDisplayElement = id('quote_display');
   const timerElement = id('timer');

   let arrayQuote = [];
   let curIndex = 0;
   let valueWord = "";

   let can;
   // MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED HERE


   let playerId;
   let playerRef;

   firebase.auth().signInAnonymously().catch((error)=> {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorCode, errorMessage);
   });

   firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
      console.log("you're logged in");
      playerId = user.uid;


      // let gameRef = firebase.database().ref(`Games/1`);
      // gameRef.set({
      //   game: "no"
      // })

    } else {
      console.log("you're NOT logged in");
    }
  });

   /**
   * Add a function that will be called when the window is loaded.
   */
   window.addEventListener("load", init);

   /**
   * CHANGE: Describe what your init function does here.
   */
   function init() {


    // menu

    qs("#menu-buttons button").addEventListener("click", startQueue);

    // queuing screen


    // game

    // result

     // THIS IS THE CODE THAT WILL BE EXECUTED ONCE THE WEBPAGE LOADS


   }

   function startQueue() {
      menuToQueue();
      searchForGame();
   }

   function searchForGame() {
    playerRef = firebase.database().ref(`Users/${playerId}`);


    playerRef.set({
      uid: playerId
    });

    playerRef.onDisconnect().remove();

    let ref = firebase.database().ref("Users");

    let users;
    ref.on("value", (snap) => {
      console.log(snap.val());
      users = snap.val();
      let userAmount = Object.keys(users).length;
      console.log(userAmount);
      if (userAmount === 3) {
        startGame(Object.keys(users));
      }
    })
   }


   function startGame(usersKeyArray) {
    // setTimeout(function() {
    //   firebase.database().ref("Users").remove().catch(function(error){
    //     console.log("Remove failed: " + error.message)
    //   });
    // },1000);


    usersKeyArray.sort();

    let quote = getRandomQuote();

    gameJSON = {
      "players": usersKeyArray,
      "p1-progress": 0,
      "p2-progress": 0,
      "p3-progress": 0,
      "p4-progress": 0,
      "p1-wpm": 0,
      "p2-wpm": 0,
      "p3-wpm": 0,
      "p4-wpm": 0,
      "words": quote,
    };

    gameRef = firebase.database().ref(`Game/1`);
    gameRef.set(JSON.stringify(gameJSON));

    gameRef.on("value", (snap) => {
      gameJSON = snap.val();
      console.log(gameJSON);
    });

    setTimeout(function() {
      startMatch(JSON.parse(gameJSON));
    },1500);
   }

   function startMatch(gameJSON) {
    switchToGame();
    renderNewQuote(gameJSON.words);
    generateCanvas();
    startTimer();
    console.log(gameJSON);
   }

   function switchToGame() {
    id("queue").classList.add("hidden");
    id("game").classList.remove("hidden");
   }

   function menuToQueue() {
    id("menu").classList.add("hidden");
    id("queue").classList.remove("hidden");

   }


   function checkInput() {
     console.log("changed");
     let correct = true;
     const arrayQuoteSpan = quoteDisplayElement.querySelectorAll('span');

     if(valueWord == null) {
       arrayQuoteSpan[curIndex].classList.remove('correct');
       arrayQuoteSpan[curIndex].classList.remove('incorrect');
       correct = false;
     }
     else if(arrayQuote[curIndex] === valueWord) {
       arrayQuoteSpan[curIndex].classList.add('correct');
       arrayQuoteSpan[curIndex].classList.remove('incorrect');
       // correct word, moving onto next
       can.erase();
       curIndex++;
     } else {
       arrayQuoteSpan[curIndex].classList.remove('correct');
       arrayQuoteSpan[curIndex].classList.add('incorrect');
       correct = false;
     }

    //  if(curIndex === arrayQuote.length && correct) renderNewQuote();
   }

   function renderNewQuote(string) {
     curIndex = 0;
     arrayQuote = [];
     const quote = string;
     quoteDisplayElement.innerHTML = '';
     quote.split(" ").forEach(word => {
       const wordSpan = gen('span');
       wordSpan.innerText = word + " ";
       quoteDisplayElement.appendChild(wordSpan);
       arrayQuote.push(word);
     })

   }

   let startTime;
   function startTimer() {
     timerElement.innerText = 92;
     startTime = new Date();
     let timerId = setInterval(() => {
       timer.innerText = 90 - getTimerTime();
       if(Number(timer.textContent) === 0) {
         clearInterval(timerId);
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


   function generateCanvas() {
     let canvasElement = gen("canvas");
     canvasElement.id = "can";
     canvasElement.width = "900";
     canvasElement.height = "300";
     id("canvas-section").append(canvasElement);
     can = new handwriting.Canvas(id("can"));

     can.setCallBack(function(data) {
       updateUserInput(data, can);
     });

     can.setOptions(
       {
         language: "en",
         numOfReturn: 5
       }
     );

     ["click", "touchend"].forEach(function(e) {
       id("can").addEventListener(e,() => {
         can.recognize();
       });
     });

     let clear = gen("button");
     clear.id = "clear-button";
     clear.textContent = "clear";
     id("user-button").append(clear);

     id("clear-button").addEventListener("click", () => {
       can.erase();
       clearDisplayText()
     });

   }

   function clearDisplayText() {
     let element = qs("#input-result p");
     element.textContent = "";
   }

   function updateUserInput(data, can) {
     updateTextBox(data);
     //check answer
     console.log(data);
   }

   function updateTextBox(data) {
     let element = qs("#input-result p");
     let result = data[0].toLowerCase();
     element.textContent = result;
     valueWord = data[0].toLowerCase();
     checkInput();
   }

   function getRandomQuote() {
     let quote = "";

     let wordAmount = getRandomIntBetween(10, 15);

     for (let i = 0; i < wordAmount; i++) {
       let currentWord = words[getRandomIndex(words)].toLowerCase();

       quote += currentWord;
       if (i + 1 != wordAmount) {
         quote += " ";
       }
     }

     return quote;
   }

   function getRandomIntBetween(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min) + min);
   }

   function getRandomIndex(array) {
     return Math.floor(Math.random()*array.length);
   }

})();