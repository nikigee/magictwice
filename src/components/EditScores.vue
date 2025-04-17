<template>
    <div>
        <div class="mb-2">
            <label class="text-body-secondary">Health Points</label>
            <input class="form-control" type="number" v-model="maxHP" />
        </div>

        <label class="text-body-secondary form-label">Ability Scores</label>
        <div class="mb-2 row row-cols-3 row-cols-xl-6 justify-content-center text-center ab-scores">
            <div class="col">
                <label class="text-body-secondary">Strength</label>
                <input class="form-control form-control-lg fs-5" type="number" v-model="ability.str" max="30" />
                <p class="text-muted mb-0">( {{ serAbility(ability.str) }} )</p>
            </div>
            <div class="col">
                <label class="text-body-secondary">Dexterity</label>
                <input class="form-control form-control-lg fs-5" type="number" v-model="ability.dex" />
                <p class="text-muted mb-0">( {{ serAbility(ability.dex) }} )</p>
            </div>
            <div class="col">
                <label class="text-body-secondary">Constitution</label>
                <input class="form-control form-control-lg fs-5" type="number" v-model="ability.cnst" />
                <p class="text-muted mb-0">( {{ serAbility(ability.cnst) }} )</p>
            </div>
            <div class="col">
                <label class="text-body-secondary">Intelligence</label>
                <input class="form-control form-control-lg fs-5" type="number" v-model="ability.int" />
                <p class="text-muted mb-0">( {{ serAbility(ability.int) }} )</p>
            </div>
            <div class="col">
                <label class="text-body-secondary">Wisdom</label>
                <input class="form-control form-control-lg fs-5" type="number" v-model="ability.wis" />
                <p class="text-muted mb-0">( {{ serAbility(ability.wis) }} )</p>
            </div>
            <div class="col">
                <label class="text-body-secondary">Charisma</label>
                <input class="form-control form-control-lg fs-5" type="number" v-model="ability.chr" />
                <p class="text-muted mb-0">( {{ serAbility(ability.chr) }} )</p>
            </div>
        </div>
        <div class="mb-2">
            <label class="text-body-secondary mb-1">Spellcasting Modifier</label>
            <select class="form-select" v-model="spcMod">
                <option value="">None</option>
                <option value="str">Strength</option>
                <option value="dex">Dexterity</option>
                <option value="cnst">Constitution</option>
                <option value="int">Intelligence</option>
                <option value="wis">Wisdom</option>
                <option value="chr">Charisma</option>
            </select>
        </div>

        <div class="text-center mt-3">
            <mdButton class="ms-0" @click="save()">Save</mdButton>
            <mdButton class="btn-outline-secondary me-0" @click="$parent.editScores = false">Cancel</mdButton>
        </div>
    </div>
</template>

<script>
import mdButton from './ui/mdButton.vue';
export default {
    name: "Editscores",
    components: {
        mdButton
    },
    methods: {
        serAbility(value) {
            var modifier = -5;
            for (var i = 1; i <= 31; i += 2) {
                if (i >= value) {
                    return modifier
                } else {
                    modifier++;
                }
            }
            return 10;
        },
        save(){
            // set hp
            if(this.$md.ply.health.maxHP == this.$md.ply.health.currentHP){
                this.$md.ply.health.currentHP = this.maxHP; // for convenience to player
            }
            this.$md.ply.health.maxHP = this.maxHP;

            // set ab scores
            this.$md.ply.stats.ability = this.ability;
            this.$md.ply.player_class.spcMod = this.spcMod;


            this.$md.savePlayer(); // save
            this.$parent.editScores = false;
        }
    },
    data() {
        return {
            maxHP: this.$md.ply.health.maxHP,
            ability: {
                str: this.$md.ply.stats.ability.str,
                dex: this.$md.ply.stats.ability.dex,
                cnst: this.$md.ply.stats.ability.cnst,
                int: this.$md.ply.stats.ability.int,
                wis: this.$md.ply.stats.ability.wis,
                chr: this.$md.ply.stats.ability.chr
            },
            spcMod: this.$md.ply.player_class.spcMod
        }
    }
}
</script>

<style lang="scss" scoped>
.ab-scores {
    font-size: 14px;
}
</style>