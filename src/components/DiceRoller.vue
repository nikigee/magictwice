<template>
    <div>
        <label for="md-diceroller" class="text-body-secondary">Dice Tray</label>
        <Card id="md-diceroller" bgImage="cards/doragi-2.jpg">
            <ul class="list-group list-group-flush mb-1">
                <li v-for="(d, index) in $md.diceHistory"
                    v-show="index >= ($md.diceHistory.length - 1)"
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
                            <button @click="$md.diceHistory.splice(index, 1)" class="btn text-muted p-0"><i
                                    class="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="input-group">
                <input @keyup.enter="roll" type="text" class="form-control" v-model="diceInput"
                    placeholder="Enter dice roll here (example: d20+4)"
                    aria-label="Enter dice roll here (example: d20+4)" aria-describedby="button-addon2">
                <button @click="roll" class="btn btn-outline-primary" type="button" id="button-addon2">Roll</button>
            </div>
        </Card>
    </div>
</template>

<script>
import Card from '@/components/ui/Card.vue';

export default {
    name: "DiceRoller",
    data() {
        return {
            diceInput: ''
        };
    },
    components: {
        Card: Card
    },
    methods: {
        roll() {
            const command = this.diceInput.split(" ")[0]; // simple command parsing
            let args = this.diceInput.substring(this.diceInput.indexOf(" ") + 1);
            if (this.diceInput == "clear") {
                this.$md.diceHistory.splice(0, this.$md.diceHistory.length);
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
            }
            else {
                this.$md.diceHistory.push(this.$md.Dice.x(this.diceInput));
                this.diceInput = "";
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
</style>./ui/Card.vue