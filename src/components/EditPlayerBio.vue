<template>
    <div>
        <form>
            <div class="my-2">
                <label class="text-body-secondary">Name</label>
                <input type="text" class="form-control" v-model="name" />
            </div>
            <div class="mb-2 mt-2 row">
                <div class="col-lg-8">
                    <label for="mdClass" class="form-label mb-1 text-body-secondary">Class</label>
                    <input type="text" placeholder="Class" class="form-control form-control-sm" id="mdClass"
                        list="mdClasses" aria-describedby="mdClassHelp" v-model="className" />
                    <datalist id="mdClasses">
                        <option>Fighter</option>
                        <option>Rogue</option>
                        <option>Wizard</option>
                        <option>Sorcerer</option>
                        <option>Cleric</option>
                        <option>Warlock</option>
                        <option>Paladin</option>
                        <option>Barbarian</option>
                        <option>Bard</option>
                    </datalist>
                    <div id="mdClassHelp" class="form-text">
                        This is just a label, changing this wont affect your character (todo: add multi-class support).
                    </div>
                </div>
                <div class="col-lg-4">
                    <label for="mdLevel" class="form-label mb-1 text-body-secondary">Level</label>
                    <input type="number" placeholder="1" class="form-control form-control-sm" id="mdLevel"
                        v-model="lvl" />
                </div>
            </div>
            <div class="mb-2">
                <label for="mdExp" class="form-label mb-1 text-body-secondary">Experience Points</label>
                <input placeholder="0" type="number" class="form-control" id="mdExp" v-model="xp" />
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col">
                    <label class="text-body-secondary">AC</label>
                    <input type="number" placeholder="10" class="form-control fs-4" v-model="ac" />
                </div>
                <div class="col">
                    <label class="text-body-secondary">Initiative</label>
                    <p class="fw-bold fs-3 m-0">{{ $md.ply.stats.initiative }}</p>
                </div>
                <div class="col">
                    <label class="text-body-secondary">Speed</label>
                    <input type="number" placeholder="30" class="form-control fs-4" v-model="speed" />
                </div>
            </div>
            <div class="mb-2">
                <label class="text-body-secondary">Gold</label>
                <input type="number" class="form-control form-control-sm" v-model="gold" />
            </div>
            <div class="mb-2">
                <label class="text-body-secondary">Hit Dice</label>
                <input type="text" class="form-control form-control-sm" v-model="hitdie" />
            </div>
        </form>
        <div class="mt-3">
            <mdButton @click="saveChanges()">Save</mdButton>
            <mdButton class="btn-outline-secondary" @click="$parent.editMode = false">Cancel</mdButton>
        </div>
    </div>
</template>

<script>
import mdButton from './ui/mdButton.vue';

export default {
    name: "EditPlayerBio",
    components: {
        mdButton: mdButton
    },
    data() {
        return {
            name: this.$md.ply.name,
            className: this.$md.ply.player_class.name,
            lvl: this.$md.ply.lvl,
            xp: this.$md.ply.exp,
            ac: this.$md.ply.health.defaultAC,
            speed: this.$md.ply.stats.speed,
            gold: this.$md.ply.inv.gold,
            hitdie: this.$md.ply.health.hitdie
        };
    },
    methods: {
        changeName() {
            // delete info at $md.ply.name

            // set new name

            // change ID

            // save at new location

            // navigate router to new player location

            
        },
        saveChanges() {
            // make changes
            this.$md.ply.lvl = this.lvl;
            this.$md.ply.exp = this.xp;
            this.$md.ply.player_class.name = this.className;
            this.$md.ply.health.defaultAC = this.ac;
            this.$md.ply.stats.speed = this.speed;
            this.$md.ply.inv.gold = this.gold;
            console.log(this.$md.ply.inv.gold, this.gold);
            this.$md.ply.health.hitdie = this.hitdie;

            this.$md.savePlayer(); // save

            // if the user changes name
            if (this.name != this.$md.ply.name) {
                // we put this in a separate method so we can update the ID, page url and save location accordingly.
                // its important we save *before* calling this block
                this.changeName();
            }

            this.$parent.editMode = false; // exit edit menu
        }
    }
}
</script>

<style lang="scss" scoped></style>