<template>
    <form class="action-bar d-print-none" @submit.prevent="handleSubmit">
        <div class="input-group input-group-sm">
            <span class="input-group-text action-bar-bg border-end-0 text-primary">
                <span v-if="isBusy" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-stars"></i>
            </span>
            <input
                v-model="input"
                type="text"
                class="form-control form-control-sm action-bar-bg border-start-0 ps-0"
                :placeholder="placeholder"
                :disabled="disabled || isBusy"
                aria-label="Do anything action bar"
                autocorrect="off"
                autocapitalize="none"
                spellcheck="false"
                autocomplete="off"
            />
        </div>
    </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCommandStore } from '@/stores/commandStore';

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Do anything with Purple...'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['submit']);

const commandStore = useCommandStore();
const input = ref('');

const isBusy = computed(() => props.loading || commandStore.isProcessing);

async function handleSubmit() {
    const raw = input.value.trim();
    if (!raw || props.disabled || isBusy.value) return;

    input.value = '';
    emit('submit', raw);
    await commandStore.runPrompt(raw);
}
</script>

<style lang="scss" scoped>
.action-bar {
    .action-bar-bg {
        background-color: rgba(0, 0, 0, 0.45);
    }

    .form-control:focus {
        background-color: rgba(0, 0, 0, 0.45);
        box-shadow: none;
        border-color: var(--bs-border-color);
    }

    .input-group:focus-within {
        box-shadow: 0 0 0 0.15rem rgba(var(--bs-primary-rgb), 0.25);
        border-radius: var(--bs-border-radius-sm);
    }
}
</style>
