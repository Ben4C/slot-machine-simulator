const prompt = require("prompt-sync")();
const copy = require("copy-paste");

const ROWS = 3;
const COLS = 3;

/*
("   █████   █████   ")("       █████       ")("        ███        ")("        ███        ")
("  ███████ ███████  ")("      ███████      ")("       █████       ")("       █████       ")
("  ███████████████  ")("       █████       ")("     █████████     ")("      ███████      ")
("   █████████████   ")("   █████████████   ")("    ███████████    ")("     █████████     ")
("     █████████     ")("  ███████─███████  ")("   ██████─██████   ")("      ███████      ")
("       █████       ")("   █████─█─█████   ")("    ████─█─████    ")("       █████       ")
("        ███        ")("       █████       ")("       █████       ")("        ███        ") */

const heart = ["   █████   █████   ", "  ███████ ███████  ", "  ███████████████  ", "   █████████████   ", "     █████████     ", "       █████       ", "        ███        "];
const club = ["       █████       ", "      ███████      ", "       █████       ", "   █████████████   ", "  ███████ ███████  ", "   █████ █ █████   ", "       █████       "];
const spade = ["        ███        ", "       █████       ", "     █████████     ", "    ███████████    ", "   ██████ ██████   ", "    ████ █ ████    ", "       █████       "];
const diamond = ["        ███        ", "       █████       ", "      ███████      ", "     █████████     ", "      ███████      ", "       █████       ", "        ███        "];

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}

const SYMBOLS_VALUES = {
    "A": 15,
    "B": 10,
    "C": 8,
    "D": 4
}

const getDeposit = () => {
    while (true) {
        const moneyDeposited = prompt("How much money would you like to deposit: ");
        const floatMoneyDeposited = parseFloat(moneyDeposited);

        if (isNaN(floatMoneyDeposited) || floatMoneyDeposited <= 0) {
            console.log("Please deposit a valid amount of money")
        } else {
            return floatMoneyDeposited;
        }
    }
}

const getNumOfLines = () => {
    while (true) {
        const lines = prompt("How many lines would you like to bet on? (1 - 3): ");
        const floatLines = parseFloat(lines);

        if (isNaN(floatLines) || floatLines < 1 || floatLines > 3 || floatLines % 1 != 0) {
            console.log("Please enter a valid number of lines")
        } else {
            return floatLines;
        }
    }
}

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("How much money would you like to bet per row: ");
        const floatBet = parseFloat(bet);

        if (isNaN(floatBet) || floatBet <= 0 || lines * floatBet > balance) {
            console.log("Please bet a valid amount of money (You can't bet more than your deposit!) ")
        } else {
            return floatBet;
        }
    }
}

const spin = () => {
    const symbolArray = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbolArray.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const tempSymbols = [...symbolArray];
        for (let j = 0; j < ROWS; j++) {
            let randomMult = Math.random();
            while (randomMult == 1) {
                randomMult = Math.random();
            }
            const randomIndex = Math.floor(randomMult * tempSymbols.length);
            reels[i].push(tempSymbols[randomIndex]);
            tempSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

// Practicing matrix transposition

const transpose = (reels) => {
    const out = [];
    for (let i = 0; i < ROWS; i++) {
        out.push([]);
        for (let j = 0; j < COLS; j++) {
            out[i].push(reels[j][i]);
        }
    }
    return out;
}

const printRows = (rows) => {
    console.log("─────────────────────────────────────────────────────────────");
    for (const row of rows) {
        for (let j = 0; j < 7; j++) {
            let rowOut = "|";
            for (const [i, symbol] of row.entries()) {
                switch (symbol) {
                    case "A":
                        rowOut += heart[j];
                        rowOut += "|"
                        break;
                    case "B":
                        rowOut += club[j];
                        rowOut += "|"
                        break;
                    case "C":
                        rowOut += spade[j];
                        rowOut += "|"
                        break;
                    case "D":
                        rowOut += diamond[j];
                        rowOut += "|"
                        break;
                }
            }
            console.log(rowOut);
        }
        console.log("─────────────────────────────────────────────────────────────");
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbols[0] != symbol) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}

const game = () => {
    let balance = getDeposit();
    const originalBalance = balance;
    while (true) {
        console.log("Your balance is " + balance);
        const LINES = getNumOfLines();
        let bet = getBet(balance, LINES);
        balance -= bet * LINES;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, LINES);
        balance += winnings;
        console.log("You won $" + winnings.toString() + "!");
        share = prompt("Would you like to share your results with friends? (y/n): ");
        while (share != "y" && share != "n") {
            share = prompt("Invalid Response. Please type y or n: ")
        } 
        if (share == "y") {
            copy.copy("I won $" + winnings + " in slot machine simulator!");
            console.log("Copied to clipboard.");
        }

        if (balance == 0) {
            console.log("You ran out of money");
            break;
        }

        let repeat = prompt("Would you like to continue? (y/n): ")
        while (repeat != "y" && repeat != "n") {
            repeat = prompt("Invalid Response. Please type y or n: ")
        } 
        if (repeat == "n") {
            if (balance - originalBalance < 0) {
                console.log("You lost $" + -(balance - originalBalance));
            }
            else {
                console.log("You made $" + (balance - originalBalance) + "!");
            }
            break;
        }
        else {
            continue;
        }
    }
}

console.log("Welcome to Slot Machine Simulator!");
console.log("──────────────────────────────────");
console.log("Get three in a row to win!");
console.log("Hearts = x15");
console.log("Clubs = x10");
console.log("Spades = x8");
console.log("Diamonds = x4");
console.log("──────────────────────────────────");

game();