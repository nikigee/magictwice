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
                        This is just a label, changing this wont affect your character.
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
                <input placeholder="0" type="number" class="form-control form-control-sm" id="mdExp" v-model="xp" />
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col">
                    <label class="text-body-secondary">AC</label>
                    <input type="text" placeholder="10" class="form-control fs-4" v-model="ac" />
                </div>
                <div class="col">
                    <label class="text-body-secondary">Initiative</label>
                    <input type="text" :placeholder="$md.ply.stats.ability_mod.dex" class="form-control fs-4"
                        v-model="initiative" />
                </div>
                <div class="col">
                    <label class="text-body-secondary">Speed</label>
                    <input type="number" placeholder="30" class="form-control fs-4" v-model="speed" />
                </div>
            </div>
            <div class="mb-2">
                <label class="text-body-secondary mb-1">Passive Perception</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text" id="pp">14 +</span>
                    <input type="text" class="form-control form-control-sm" v-model="passive_perception_mod"
                        placeholder="0" aria-describedby="pp" />
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
            <hr class="mb-2" />
            <div class="mb-2">
                <label class="text-body-secondary mb-1">Theme</label>
                <select name="Themes" class="form-select form-select-sm" v-model="theme" @change="changeTheme"
                    aria-describedby="mdThemeDesc">
                    <option v-for="theme, v in theme_descs" :value="v">
                        {{ theme.title }}
                    </option>
                </select>
                <div id="mdThemeDesc" class="form-text ms-1">
                    {{ this.theme_descs[this.theme].desc }}
                </div>
            </div>
        </form>
        <div class="mt-3">
            <mdButton @click="saveChanges()">Save</mdButton>
            <mdButton class="btn-outline-secondary" @click="cancel">Cancel</mdButton>
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
            hitdie: this.$md.ply.health.hitdie,
            initiative: this.$md.ply.stats.initiative,
            passive_perception_mod: this.$md.ply.stats.passive_perception_mod,
            theme: this.$md.ply.theme,
            theme_descs: {
                "default": { desc: "A modern serif-style theme with a hint of fantasy.", title: "Magic Dice" },
                "cyberpunk": { desc: "What are you willing to do, renegade?", title: "CYBERPUNK: Stagnation" },
                "underdark": { desc: "The purple bioluminescence of the Underdark.", title: "Underdark Flower" }
            }
        };
    },
    methods: {
        changeName() {
            const old_id = this.$md.ply.id;
            if (this.name.trim() == this.$md.ply.name.trim()) {
                return;
            }

            // set new name
            this.$md.ply.name = this.name.trim();

            // save at new location
            this.$md.savePlayer();

            // delete old player location
            this.$md.Load.deleteCharacter(old_id);

            // navigate router to new player location
            document.title = this.name.trim();
            this.$router.push({ path: `/player/${this.$md.ply.id}` });

        },
        changeTheme() {
            if (this.theme == "default") {
                document.documentElement.removeAttribute("data-theme");
            } else {
                document.documentElement.setAttribute("data-theme", this.theme);
            }

            if (document.querySelector("#banner-default")) {
                document.querySelector("#banner-default").dispatchEvent(new Event("glow")); // tell the banner component to glow
            }
        },
        hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            result = result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;

            if (result) {
                return `${result.r}, ${result.g}, ${result.b}`;
            } else {
                return null;
            }
        },
        saveChanges() {
            // make changes
            this.$md.ply.lvl = this.lvl;
            this.$md.ply.exp = this.xp;
            this.$md.ply.player_class.name = this.className;
            this.$md.ply.health.defaultAC = this.ac;
            this.$md.ply.stats.speed = this.speed;
            this.$md.ply.inv.gold = this.gold;
            this.$md.ply.health.hitdie = this.hitdie;
            this.$md.ply.stats.initiative = this.initiative;
            this.$md.ply.stats.passive_perception_mod = this.passive_perception_mod;
            this.$md.ply.theme = this.theme;

            this.$md.savePlayer(); // save

            // if the user changes name
            if (this.name != this.$md.ply.name) {
                // we put this in a separate method so we can update the ID, page url and save location accordingly.
                // its important we save *before* calling this block
                this.changeName();
            }

            // styling changes


            this.$parent.editMode = false; // exit edit menu
        },
        cancel() {
            this.theme = this.$md.ply.theme;
            this.changeTheme();

            this.$parent.editMode = false; // exit edit menu
        }
    }
}
</script>

<style lang="scss" scoped></style>