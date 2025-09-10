<template>
    <MdModal idd="quickRolls" title="Edit quickrolls">
        <div class="modal-body">
            <div v-for="roll, index in $md.ply.quick_rolls">
                <div class="row mb-3 align-items-center">
                    <div class="col">
                        <!-- <label class="form-label mb-1 text-body-secondary">Roll</label> -->
                        <input type="text" class="form-control form-control-sm" v-model="roll.v" placeholder="Roll"
                            required />
                    </div>
                    <div class="col">
                        <!-- <label class="form-label mb-1 text-body-secondary">Label</label> -->
                        <input type="text" class="form-control form-control-sm" v-model="roll.label"
                            placeholder="Label (not required)" required />
                    </div>
                    <div class="col-auto ps-0">
                        <button type="button" class="btn btn-sm" @click="remove($md.ply.quick_rolls, index)"><i class="bi bi-x align-middle"></i></button>
                    </div>
                </div>
            </div>
            <div class="d-grid gap-2 mt-4">
                <button type="button" class="btn btn-outline-primary btn-sm align-middle"
                    @click="addOne($md.ply.quick_rolls)"><i class="bi bi-plus"></i> Add</button>
            </div>
        </div>
        <div class="modal-footer border-top-0">
            <mdButton type="submit" class="btn btn-outline-primary" data-bs-dismiss="modal"
                @click="submit($md.ply.quick_rolls, $md.savePlayer)">
                Save &amp; Close
            </mdButton>
        </div>
    </MdModal>
</template>

<script setup>
import MdModal from './ui/mdModal.vue';
import mdButton from './ui/mdButton.vue';

function addOne(arr) {
    arr.push({ v: "d20" });
}

function remove(arr, index) {
    arr.splice(index, 1);
}

function submit(quick_rolls, save) {
    quick_rolls.forEach((roll, i) => {
        if (!roll.v) {
            quick_rolls.splice(i, 1);
        }
    });

    save();
}

</script>