<template>
    <div>
        <form>
            <div class="mb-2 mt-2 row">
                <div class="col-lg-8">
                    <label for="mdClass" class="form-label mb-1">Class</label>
                    <input type="text" placeholder="Class" class="form-control form-control-sm" id="mdClass"
                        list="mdClasses" aria-describedby="mdClassHelp" />
                    <datalist id="mdClasses">
                        <option>Fighter</option>
                        <option>Rogue</option>
                        <option>Wizard</option>
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
                    <label for="mdLevel" class="form-label mb-1">Level</label>
                    <input type="number" placeholder="1" class="form-control form-control-sm" id="mdLevel" />
                </div>
            </div>
            <div class="mb-2">
                <label for="mdExp" class="form-label mb-1">Experience Points</label>
                <input placeholder="0" type="number" class="form-control" id="mdExp" />
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: "EditPlayerBio"
}
</script>

<style lang="scss" scoped></style>