<template>
  <MdModal idd="diceHistoryModal" title="Roll History">
    <div class="modal-body" style="max-height: 60vh; overflow-y: auto">

      <div v-if="md.ply && md.ply.dice_history && md.ply.dice_history.length > 0">
        <div v-for="(entries, date) in groupedHistory" :key="date" class="mb-4">
          <h6 class="border-bottom border-secondary-subtle pb-2">{{ date }}</h6>

          <ul class="list-group shadow-sm">
            <li v-for="(d, index) in entries" :key="index" class="list-group-item d-flex flex-column gap-2">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div class="fw-bold">
                    {{ d.dice }}
                    <span class="text-muted fw-normal ms-2" style="font-size: 0.8em">
                      <i class="bi bi-clock"></i> {{ formatTime(d.timestamp) }}
                    </span>
                  </div>
                  <small class="text-body-secondary" v-if="d.compText">{{ d.compText }}</small>
                </div>

                <div class="d-flex align-items-center gap-3">
                  <span class="fs-4 fw-bold" :class="d.total == d.max ? 'text-success' : ''">
                    {{ d.total }}
                  </span>
                  <button @click="deleteEntry(d)" class="btn btn-sm text-danger opacity-50 hover-opacity-100 p-0"
                    title="Delete record">
                    <i class="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </div>

              <div class="input-group input-group-sm mt-1">
                <span class="input-group-text bg-transparent border-0 text-muted ps-0"><i
                    class="bi bi-journal-text me-1"></i> Note:</span>
                <input type="text" class="form-control form-control-sm border-0 bg-secondary bg-opacity-10 rounded"
                  v-model="d.note" @change="saveHistory" placeholder="What was this roll for?">
              </div>

            </li>
          </ul>
        </div>
      </div>

      <div v-else class="text-center text-muted my-5 py-5">
        <i class="bi bi-dice-5 fs-1 opacity-50 mb-2 d-block"></i>
        No dice history for this character yet.
      </div>

    </div>
    <div class="modal-footer border-top-0">
      <MdButton type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">
        Close
      </MdButton>
    </div>
  </MdModal>
</template>

<script setup>
import { computed } from 'vue';
import MdButton from "./ui/mdButton.vue";
import MdModal from "./ui/mdModal.vue";
import { useMagicDice } from "@/stores/mdStore";

const { md } = useMagicDice();

// Groups the flat array into an object where keys are the Date string, and values are arrays of rolls
const groupedHistory = computed(() => {
  if (!md.ply || !md.ply.dice_history) return {};

  // Sort history by timestamp descending (newest first)
  const sortedHistory = [...md.ply.dice_history].sort((a, b) => b.timestamp - a.timestamp);

  return sortedHistory.reduce((groups, entry) => {
    // Format timestamp into a nice Day/Date string (e.g. "Monday, October 24, 2026")
    const dateStr = new Date(entry.timestamp).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(entry);
    return groups;
  }, {});
});

// Format the timestamp down to just the hour/minute for the inline display
const formatTime = (ts) => {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Find the exact object in the original flat array, splice it out, and save.
const deleteEntry = (entryObj) => {
  if (md.ply && md.ply.dice_history) {
    const index = md.ply.dice_history.indexOf(entryObj);
    if (index > -1) {
      md.ply.dice_history.splice(index, 1);
      md.savePlayer(); // Trigger save to localStorage
    }
  }
};

// Fire save to localStorage when a user finishes typing a note
const saveHistory = () => {
  md.savePlayer();
};
</script>

<style scoped>
.hover-opacity-100:hover {
  opacity: 1 !important;
  transition: opacity 0.2s ease-in-out;
}
</style>