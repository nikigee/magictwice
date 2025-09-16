<template>
    <div class="mb-2">
        <div class="dropdown">
            <label for="md-healthbar" class="text-body-secondary">Health Points</label>
            <div id="md-healthbar" class="bg-dark-subtle rounded overflow-hidden" data-bs-toggle="dropdown"
                aria-expanded="false">
                <div class="p-1 text-center healthbar" :class="getColor()"
                    :style="{ width: getPercentage($md.ply.health.currentHP, $md.ply.health.maxHP) + '%' }">
                    <span style="text-wrap: nowrap">{{ $md.ply.health.currentHP }} / {{ $md.ply.health.maxHP }}</span>
                </div>
            </div>
            <ul class="dropdown-menu dropdown-menu-end" style="">
                <form class="px-3 py-2 text-center" @submit="runForm">
                    <div class="mb-2">
                        <label for="healthInput" class="form-label">Modify Health</label>
                        <input v-model="hpInt" type="text" class="form-control" id="healthInput" placeholder="5"
                            autofocus style="width: 140px;">
                    </div>
                    <div class="d-flex justify-content-center">
                        <mdButton @click="addHP()">Heal</mdButton>
                        <mdButton @click="addHP(true)">Damage</mdButton>
                    </div>
                </form>
            </ul>
        </div>
    </div>
</template>

<script>
import mdButton from "@/components/ui/mdButton.vue"

export default {
    name: "HealthBar",
    data() {
        return {
            hpInt: ''
        }
    },
    components: {
        mdButton: mdButton
    },
    methods: {
        runForm(e) {
            e.preventDefault();
            return false;
        },
        addHP(reverse = false) {

            const diceRoll = this.$md.Dice.x(this.hpInt, true);
            this.$md.ply.health.add(reverse ? diceRoll.total * -1 : diceRoll.total);

            if (diceRoll.list.length > 0) {
                this.$md.diceHistory.push(diceRoll);
                localStorage.setItem("last_roll", JSON.stringify(diceRoll));
            }
            this.hpInt = "";

            this.$md.savePlayer(); // save changes
        },
        getPercentage(current, max) {
            return (current / max * 100) < 0 ? 0 : (current / max * 100);
        },
        getColor() {
            const perc = this.getPercentage(this.$md.ply.health.currentHP, this.$md.ply.health.maxHP);
            if (perc <= 25) {
                return "bg-danger-subtle text-danger-emphasis";
            } else if (perc <= 50) {
                return "bg-warning-subtle text-warning-emphasis"
            }

            return "full-hp text-white";
        }
    }
}
</script>

<style lang="scss">
.healthbar {
    transition: 0.4s;
}

.full-hp {
    background-color: var(--md-health);
}
</style>