/* eslint-disable */
const Dice = (() => {
    class SingleDice {
        constructor(string = "d20") {
            this.string = string.toLowerCase(); // the string value of the dice roll
            this.list = []; // list of dice rolls
            this.stats = SingleDice.cvt(string.toLowerCase()); // the iterator, face, etc.
            this.roll(); // roll numbers
        }
        static cvt(diceRoll) {
            diceRoll = diceRoll.toLowerCase();
            let diceObj = {};
            if (diceRoll.includes("->")) {
                diceObj.foreach_modifier = parseInt(diceRoll.split("->")[1]);
            }
            diceRoll = diceRoll.split("d");
            diceObj.iterator = diceRoll[0] != "" ? parseInt(diceRoll[0]) : 1;
            diceObj.face = parseInt(diceRoll[1]);
            if (isNaN(diceObj.iterator) || isNaN(diceObj.face)) {
                throw Error("Invalid dice roll!");
            }
            return diceObj;
        }
        serialise() {
            return `${this.stats.iterator}d${this.stats.face}${this.stats.foreach_modifier ? "->" + this.stats.foreach_modifier : ""
                }`;
        }
        roll() {
            let num;
            this.list = [];
            for (let i = 0; i < this.stats.iterator; i++) {
                num = Math.floor(Math.random() * this.stats.face) + 1;
                if (this.stats.foreach_modifier) num += this.stats.foreach_modifier; // add modifier to each roll
                this.list.push(num); // populate list with random numbers
            }
            return this.total; // return result
        }
        addDice(number) {
            this.stats.iterator += number; // add x dice
            this.string = this.serialise(this.stats); // convert and set
            this.roll(); // reset
            return this;
        }
        reRoll(value) {
            const index = this.list.indexOf(value);
            if (index != -1) {
                this.list[index] = Math.floor(Math.random() * this.stats.face) + 1;
                return this.list[index];
            }
            return false;
        }
        get total() {
            if (this.stats.iterator <= 0) return 0;
            else return this.list.reduce((a, b) => a + b);
        }
        get max() {
            return this.stats.face * this.stats.iterator; // 8d6 -> 6 * 8
        }
    }

    class diceRoll {
        constructor(dice = "d20", opts = {}) {
            const { x = document.body.clientWidth / 2 - 225, y = 150 } = opts;
            this.pos = {
                x,
                y,
            };
            this.dice = dice.toLowerCase();
            this.roll();
        }
        generateList() {
            const regexp = /\d*d\d+(?:->-*\d+)*/g; // used to detect dice rolls
            const list = []; // list of dice rolls
            let val;
            do {
                val = regexp.exec(this.dice); // extract all dice
                if (val) list.push(new SingleDice(val[0])); // put them in the list
            } while (val);
            this.list = list; // set
        }
        get verboseList() {
            const newList = [];
            this.list.forEach((x) => {
                x.list.forEach((v) => {
                    newList.push(v);
                });
            });
            return newList; // return an array of every dice roll from every set of dice
        }
        get max() {
            let text = this.dice;
            this.list.forEach((x) => {
                text = text.replace(x.string, x.max); // replace all dice rolls with the rolled equivelent
            });
            return Number(eval(text));
        }
        get compText() {
            let text = this.dice;
            this.list.forEach((x) => {
                text = text.replace(x.string, x.total); // replace all dice rolls with the rolled equivelent
            });
            return text;
        }
        get total() {
            return Number(eval(this.compText));
        }
        roll() {
            try {
                // roll each set of dice
                this.generateList();
                return this.total; // return total
            } catch (err) {
                return console.error(
                    `Something went wrong while rolling the dice! (${err})`
                );
            }
        }
        show() {
            this.list.forEach((x) => {
                console.log(`Dice Roll (${x.string})`);
                if (x.stats.foreach_modifier) {
                    console.log("Modifier (+" + x.stats.foreach_modifier + ")");
                }
                x.list.forEach((x, i) => {
                    console.log(`Roll ${i + 1}: ${x}`);
                });
            });
            console.log(`Total = ${this.compText}`);
            console.log("Total roll: " + this.total);
        }
        render() {
            console.log("render");
        }
        static r(arg, mute = false) {
            return diceRoll.x(arg, mute).total; // return total of the dice roll only
        }
        static x(arg, mute = false) {
            try {
                const dice = new diceRoll(arg);
                if (!mute) dice.show();
                return dice;
            } catch (err) {
                console.error(err);
            }
        }
        static cvt(roll) {
            return SingleDice.cvt(roll);
        }
        static diceObj(string) {
            return new SingleDice(string);
        }
        static gfx_dice(arg, x, y) {
            try {
                const magicRoll = new diceRoll(arg, {
                    x: x,
                    y: y,
                }); // the dice roll
                return magicRoll.render();
            } catch (err) {
                return console.error(
                    `Something went wrong while rolling the dice! (${err})`
                );
            }
        }
    }
    return diceRoll;
})();

const die = {
    r: Dice.r,
    cvt: Dice.cvt,
    x: Dice.x,
    gfx_dice: Dice.gfx_dice,
}; // alternate name for static functions

// Player character handler to make things easier, rather than forcing the user to assign their characters to variables.
const magicHandler = (() => {
    class magicHandler {
        constructor() {
            this.managed_players = [];
        }
        get last() {
            if (this.managed_players.length > 0) {
                return this.managed_players[this.managed_players.length - 1];
            }
        }
        get ply() {
            if (this.managed_players.length == 0) {
                return console.log(
                    "Currently no characters are loaded! You can load from a save file using the command 'Load.restoreFromFile()'"
                );
            } else if (this.managed_players.length == 1) {
                return this.managed_players[0];
            } else {
                return this.managed_players;
            }
        }
        randomPlayer(name = `NPC ${this.managed_players.length}`, lvl = 3) {
            let ran_class = Array.from(Library.player_classes);
            ran_class = ran_class[Math.floor(Math.random() * ran_class.length)][1]; // get a random class
            this.managed_players.push(
                new Player({
                    name: name,
                    lvl: lvl,
                    classData: ran_class,
                })
            );
        }
        loadPlayer(player) {
            try {
                this.managed_players = []; // clear players
                this.managed_players.push(player);

                // emit event for other parts of Magic Dice to use.
                const loaded = new CustomEvent("char-loaded", {
                    detail: magicHandler.last
                });
                document.getElementById("out-wrap").dispatchEvent(loaded);
            } catch (err) {

            }
        }
    }
    return new magicHandler();
})();
Object.defineProperty(self, "ply", {
    get: function () {
        return magicHandler.ply;
    },
});

const Spell = (() => {
    function getGetOrdinal(n) {
        var s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n != 0 ? n + (s[(v - 20) % 10] || s[v] || s[0]) : "Cantrip";
    }
    class Spell {
        constructor(props = {}) {
            const {
                name = "Unkown Spell",
                level = "1st",
                school = "Spell",
                components = "V S",
                ctime = "1 Action",
                ritual = "no",
                concentration = "no",
                description = "No description exists for this spell.",
                duration = "Instantaneous",
                range = "10 feet",
                roll = "0d4",
                url = "https://dnd5e.fandom.com/wiki/" + name.replace(/ /g, "_"),
            } = props;
            this.name = name;
            if (!isNaN(level)) {
                this.level = getGetOrdinal(level);
            } else {
                this.level = level;
            }
            this.ctime = ctime;
            this.ritual = ritual;
            this.concentration = concentration;
            this.school = school;
            this.description = description;
            this.components =
                typeof components != "string" ? components.join(" ") : components;
            if (!isNaN(duration)) {
                this.duration =
                    duration !== 0 ? duration + " minutes" : "Instantaneous";
            } else {
                this.duration = duration;
            }
            if (!isNaN(range)) {
                this.range = range + " feet";
            } else {
                this.range = range;
            }
            this.roll = roll;
            this.url = url;
        }
        get intLvl() {
            return isNaN(Number(this.level[0])) ? 0 : Number(this.level[0]);
        }
        cast(lvl) {
            let attck = this.roll;
            const roll = new Dice(attck);
            if (lvl > this.intLvl) {
                roll.addDice(lvl - this.intLvl); // add x dice per level
            }
            return roll.show();
        }
        get wiki() {
            window.open(this.url);
        }
        get x() {
            console.log("\n" + this.name.toUpperCase());
            console.log(this.level + "-level " + this.school);
            console.log("Casting Time: " + this.ctime);
            console.log("Range: " + this.range);
            console.log("Components: " + this.components);
            console.log("Duration: " + this.duration);
            console.log(`Roll: ${this.roll}`);
            console.log(`${this.description}`);
        }
    }
    return Spell;
})();

class Item {
    constructor(props = {}) {
        const {
            name = "Unkown Item",
            cost = 0,
            dmg = "",
            dmgType = "",
            range = 10,
            desc = "No description exists for this item",
            weight = 1,
            qnty = 1,
            properties = [],
            singleUse = false,
        } = props;
        this.name = name;
        this.cost = cost;
        this.dmgType = dmgType;
        this.desc = desc;
        this.range = range;
        this.dmg = dmg;
        this.weight = weight;
        this.properties = properties;
        this.singleUse = singleUse;
        this.qnty = qnty;
    }
    get tWeight() {
        return this.weight * this.qnty;
    }
}

// start up banner
console.log(
    "%cMagic Dice",
    "font-size: 30px; color: #c51b1b; text-shadow: 1px 1px black; font-family: Georgia, serif;"
);
console.log(
    "%cA character manager built for Dungeons & Dragons 5e",
    "font-size: 14px; font-style: italic; font-weight: bold; font-family: 'Trebuchet MS', Helvetica, sans-serif;padding: 5px;"
);