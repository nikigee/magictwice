<template>
  <MdModal idd="diceHistoryModal" title="Roll History">
    <div class="modal-body" style="max-height: 60vh; overflow-y: auto">
      <p class="text-muted">(feature is a work in progress)</p>
      <ul class="list-group" v-if="md.diceHistory && md.diceHistory.length > 0">
        <li
          v-for="(d, index) in md.diceHistory"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <div class="fw-bold">{{ d.dice }}</div>
            <small class="text-body-secondary" v-if="d.compText">{{ d.compText }}</small>
          </div>
          <span class="fs-4 fw-bold" :class="d.total == d.max ? 'text-success' : ''">
            {{ d.total }}
          </span>
        </li>
      </ul>
      <div v-else class="text-center text-muted my-4">No dice rolls yet.</div>
    </div>
    <div class="modal-footer border-top-0">
      <MdButton type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">
        Close
      </MdButton>
    </div>
  </MdModal>
</template>

<script setup>
import MdButton from "./ui/mdButton.vue";
import MdModal from "./ui/mdModal.vue";

import { useMagicDice } from "@/stores/mdStore";
const md = useMagicDice().md;
</script>
