<template>
    <div>
        <div class="mb-3" v-for="group in getSpellsByLevel()">
            <h5 class="text-capitalize text-muted">{{ group[0] }} Level</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item list-group-item-action" v-for="spell in group[1]">
                    <router-link :to="`/player/${$md.ply.id}/spell/${toUrlFriendly(spell.name)}`" class="text-decoration-none">
                        <div class="ms-2 me-auto">
                            <div class="lato-bold fst-italic text-primary">{{ spell.name }}</div>
                            <div class="text-muted">{{ spell.ctime }}</div>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "SpellList",
    props: {
        filter: String
    },
    methods: {
        // turn the big spell list into a map, separated by level
        getSpellsByLevel() {
            // arr = {
            //     lvl: "cantrip",
            //     spells: []
            // }
            let arr = new Map();
            this.$md.ply.magic.spells.forEach(element => {
                // if that level exists in the map, add it to that levels list of spells
                const lvl = element.level.toLowerCase();
                if (element.name.toLowerCase().includes(this.filter.toLowerCase())) {
                    if (arr.has(lvl)) {
                        arr.get(lvl).push(element);
                    } else {
                        arr.set(lvl, []); // else, create new array at this location.
                        arr.get(lvl).push(element);
                    }
                }
            });
            return arr;
        },
        toUrlFriendly(name) {
            return name
                .toLowerCase()            // Convert to lowercase
                .replace(/[^a-z0-9 ]/g, '') // Remove special characters
                .trim()                   // Remove whitespace from start/end
                .replace(/\s+/g, '-');    // Replace spaces with hyphens
        }
    }
}
</script>

<style lang="scss" scoped></style>