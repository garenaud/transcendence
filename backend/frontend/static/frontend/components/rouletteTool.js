let nums = ["00", 27,10,25,29,12,8,19,31,18,6,21,33,16,4,23,35,14,2,0,28,9,26,30,11,7,20,32,17,5,22,34,15,3,24,36,13,1];
      let two2oneNums = [
        [3,6,9,12,15,18,21,24,27,30,33,36],
        [2,5,8,11,14,17,20,23,26,29,32,35],
        [1,4,7,10,13,16,19,22,25,28,31,34]
      ];
      let thirdsNums = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
      ];
      let redNums = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
      let blackNums = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
      let oddNums = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
      let evenNums = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
      let firstHalfNums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
      let secondHalfNums = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
      let moneyWon = 0;
      const roll = document.querySelector(".roll");
      const wheel = document.querySelector("#rouletteWheel");
      const evenBtn = document.querySelector(".even");
      const oddBtn = document.querySelector(".odd");
      const blackBtn = document.querySelector(".black");
      const redBtn = document.querySelector(".red");
      const firstHalf = document.querySelector(".firstHalf");
      const secondHalf = document.querySelector(".secondHalf");
      const firstThird = document.querySelector(".firstThird");
      const secondThird = document.querySelector(".secondThird");
      const lastThird = document.querySelector(".lastThird");
      const ballAnim = document.querySelector(".ballAnim");
      const balls = document.querySelectorAll(".ball");
      const betBtnsSVG = document.querySelectorAll(".placeBet");
      const two2one = document.querySelectorAll(".two2one");
      
      let totalMoney = 100;
      let oldMoney = 0;
      let lostWon = 0;
      
      
      const randInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      
      betBtnsSVG.forEach((btn) => {
        btn.addEventListener("click", (evt) => {
          btn.classList.toggle("active");
        });
      });
      
      
      function spinWheel() {
        document.querySelector(".winner").textContent = "";
        document.querySelector("#winnerMsg").textContent = ``;
      
        const winAngle = randInt(1800, 3600);
        ballAnim.setAttribute("values", `0 50 50; ${winAngle} 50 50`);
      
        const index = Math.round(winAngle / (360 / 38)) % 38;
        const winNumber = nums[index];
      
        balls.forEach((ball) => {
          ball.beginElement();
        }, false);
      
        // individual active classes on the number bets
        const bets = document.querySelectorAll(".active");
        console.log(bets);
        let betsMade = [];
      
        bets.forEach((bet) => {
          // pay the man
          oldMoney = totalMoney;
          totalMoney--;
          updateMoney();
      
          // store the text content for each of the active bets
          betsMade.push(bet.querySelector("text").textContent);
        }); 
        
        // how we check our non-individual number winners
        const checkWinner = (elt, arr, winnings = 1) => {
          if (elt.classList.contains("active")) {
            if (arr.includes(winNumber)) {
              console.log("total money = " + totalMoney);
              moneyWon === winnings;
              totalMoney += winnings;
              lostWon = totalMoney - oldMoney;
              updateMoney();
              win();
            }
          }
        }
        
        // run this after a roll delay
        balls[0].addEventListener('endEvent', (event) => {
          // console.log('spin over!');
          // if our individual winners include the winning number, tell us we won
          if (betsMade.includes(winNumber.toString())) {
            totalMoney = totalMoney + 38;
            moneyWon = totalMoney - oldMoney;
            updateMoney();
            win();
          } else {
            lose();
          }
      
          checkWinner(redBtn, redNums, 2);
          checkWinner(blackBtn, blackNums, 2);
          checkWinner(evenBtn, evenNums, 2);
          checkWinner(oddBtn, oddNums, 2);
          checkWinner(firstHalf, firstHalfNums, 2);
          checkWinner(secondHalf, secondHalfNums, 2);
          checkWinner(firstThird, thirdsNums[0], 3);
          checkWinner(secondThird, thirdsNums[1], 3);
          checkWinner(lastThird, thirdsNums[2], 3);
          checkWinner(two2one[0], two2oneNums[0], 3);
          checkWinner(two2one[1], two2oneNums[1], 3);
          checkWinner(two2one[2], two2oneNums[2], 3);
          
          document.querySelector(".winner").textContent = winNumber;
        });
      }
      
      function updateMoney() {
        document.querySelector(".money").innerHTML = totalMoney;
      }
      
      function win() {
        document.querySelector("#winnerMsg").textContent = `Winner!: +${moneyWon}!`;
        // confetti!
        confetti(document.querySelector(".confetti"), { spread: window.innerWidth });
      }
      
      function lose() {
          lostWon = oldMoney - totalMoney;
        document.querySelector("#winnerMsg").textContent = `House wins, you lost ${lostWon}!`;
      }
      
      roll.addEventListener("click", spinWheel);
      
      wheel.addEventListener("click", spinWheel);