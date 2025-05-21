<template>
    <div>
        <label for="md-diceroller" class="text-body-secondary">Dice Tray</label>
        <Card id="md-diceroller" bgImage="cards/doragi-2.jpg">
            <!-- <ThreeD /> -->
            <ul class="list-group list-group-flush mb-1">
                <li v-for="(d, index) in $md.diceHistory" v-show="index >= ($md.diceHistory.length - 1)"
                    class="list-group-item list-group-item-action list-group-item-secondary text-white dicerow">
                    <div class="d-flex justify-content-between align-items-center">
                        <div @click="$md.diceHistory.push($md.Dice.x(d.dice))">
                            <p class="mb-0 text-muted">{{ d.dice }}</p>
                            <div class="d-flex align-items-center">
                                <div class="pe-3 text-center">
                                    <p class="fs-3 m-0 fw-bold" :class="d.total == d.max && 'text-success'">{{
                                        d.total }}</p>
                                    <p class="m-0 text-muted">total</p>
                                </div>
                                <div class="ps-3 border-start">
                                    <div class="d-flex">
                                        <p v-for="(single, i) in d.list" class="m-0 text-center px-1 ">
                                            <span v-if="i != 0">{{ i }}. </span><span v-for="v in single.list"
                                                class="dice m-1 border rounded border-primary text-primary">{{ v
                                                }}</span>
                                        </p>
                                    </div>
                                    <p class="m-0 text-muted text-center">({{ d.compText }})</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button @click="deleteRoll(index)" class="btn text-muted p-0"><i
                                    class="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="input-group mt-2">
                <input @keyup.enter="roll" type="text" class="form-control" v-model="diceInput"
                    placeholder="Enter dice roll here (example: d20+4)"
                    aria-label="Enter dice roll here (example: d20+4)" aria-describedby="button-addon2">
                <button @click="roll" class="btn btn-outline-primary" type="button" id="button-addon2">Roll</button>
            </div>
            <div class="mt-1 d-flex flex-wrap justify-content-center justify-content-sm-start mb-1"
                v-if="$md.ply.quick_rolls">
                <span v-for="(roll) in $md.ply.quick_rolls"
                    class="border border-primary text-primary rounded p-1 px-2 quickroll shadow m-1 mb-0"
                    @click="$md.diceHistory.push($md.Dice.x(roll))">{{ roll }}</span>
            </div>
        </Card>
    </div>
</template>

<script>
import Card from '@/components/ui/Card.vue';
import ThreeD from './ThreeD.vue';
import { useAlertStore } from '@/stores/alertStore';
import { e } from 'mathjs';

export default {
    name: "DiceRoller",
    data() {
        return {
            diceInput: ''
        };
    },
    components: {
        Card: Card,
        ThreeD
    },
    computed: {
        dice() {
            if (this.$md.diceHistory.length > 0) {
                return this.$md.diceHistory[this.$md.diceHistory.length - 1];
            } else {
                return null;
            }
        }
    },
    mounted() {
        if (localStorage) {

            if (localStorage.getItem("last_roll")) {
                try {
                    if (this.$md.diceHistory.length == 0) {
                        // only restore the old dice roll if they're continuing the same character from a previous session.
                        // no point to restore an old irelevant dice roll when they're playing as a character different from last session.
                        if (localStorage.getItem("last_played") == this.$md.ply.id) {
                            const last_roll = JSON.parse(localStorage.getItem("last_roll"));
                            const dice_roll = new this.$md.Dice(last_roll.dice, last_roll);

                            console.log(`Restored old dice roll: ${dice_roll.dice}`);
                            this.$md.diceHistory.push(dice_roll);
                        } else {
                            localStorage.removeItem("last_roll");
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }
    },
    methods: {
        deleteRoll(index) {
            this.$md.diceHistory.splice(index, 1);
            if (this.$md.diceHistory.length !== 0) {
                // set last roll to whatever the last roll is
                localStorage.setItem("last_roll", JSON.stringify(this.$md.diceHistory[this.$md.diceHistory.length - 1]));
            } else {
                localStorage.removeItem("last_roll");
            }
        },
        roll() {
            const alert = useAlertStore();

            this.diceInput = this.diceInput.trim();
            const command = this.diceInput.split(" ")[0].toLowerCase(); // simple command parsing
            let args = this.diceInput.substring(this.diceInput.indexOf(" ") + 1);
            const props = args.split(" ");
            if (this.diceInput == "clear") {
                this.$md.diceHistory.splice(0, this.$md.diceHistory.length);
                localStorage.removeItem("last_roll");
                this.diceInput = "";
                return false;
            } else if (command == "health") {
                const diceRoll = this.$md.Dice.x(args);
                this.$md.ply.health.add(diceRoll.total);

                if (diceRoll.list.length > 0)
                    this.$md.diceHistory.push(diceRoll);
                this.diceInput = "";

                this.$md.savePlayer(); // save changes
                return false;
            } else if (command == "xp") {
                args = args.replace("+ ", "+");
                args = args.replace("- ", "-");
                if (!isNaN(Number(args))) {
                    this.$md.ply.exp += Number(args); // add xp
                }
                this.diceInput = "";

                this.$md.savePlayer();
            } else if (command == "gold") {
                args = args.replace("+ ", "+");
                args = args.replace("- ", "-");
                if (!isNaN(Number(args))) {
                    this.$md.ply.inv.gold += Number(args); // add xp
                }
                this.diceInput = "";

                this.$md.savePlayer();
            } else if (command == "quickroll") {
                if (Array.isArray(this.$md.ply.quick_rolls)) {
                    if (props[0] == "remove") {
                        if (props[1] == "all") {
                            this.$md.ply.quick_rolls = [];

                            this.$md.savePlayer();
                        } else if (!isNaN(props[1])) {
                            if (props[1] > 0 && props[1] <= this.$md.ply.quick_rolls.length) {
                                this.$md.ply.quick_rolls.splice(props[1] - 1, 1); // delete at specific index

                                this.$md.savePlayer();
                            }
                        }
                    } else {
                        this.$md.ply.quick_rolls.push(args);

                        this.$md.savePlayer();
                    }
                }
                this.diceInput = "";
            } else if (command == "test") {
                console.log("hi :)");

                alert.create("You successfully did a thing.");

                this.diceInput = "";
            }
            else {
                try {
                    const diceRegex = /\b(\d*)d(\d+)\b/g;
                    if (diceRegex.test(this.diceInput.toLowerCase())) {
                        if (command == "roll") {
                            this.$md.diceHistory.push(this.$md.Dice.x(args));
                        } else {
                            this.$md.diceHistory.push(this.$md.Dice.x(this.diceInput));
                        }
                    }
                    this.diceInput = "";
                } catch (err) {
                    this.$md.diceHistory = [];
                    localStorage.removeItem("last_roll");
                    console.error(err);
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.dice {
    display: inline-block;
    text-align: center;
    min-width: 30px;
    font-size: large;
}

.dicerow {
    background: none;
}

.quickroll {
    font-size: 12px;
    transition: 0.1s;
    cursor: pointer;
    user-select: none;
}

.quickroll:hover {
    border-color: white !important;
    color: white !important;
}
</style>./ui/Card.vue