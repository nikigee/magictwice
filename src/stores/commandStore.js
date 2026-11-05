import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMagicDice } from '@/stores/mdStore';
import { useAPIStore } from '@/stores/apiStore';
import { useAlertStore } from '@/stores/alertStore';
import { commandMap, getCommandSchemas } from '@/commands';

export const useCommandStore = defineStore('command', () => {
    const isProcessing = ref(false);
    const commands = { ...commandMap };

    function registerCommand(commandDef) {
        if (!commandDef || !commandDef.name) return;
        commands[commandDef.name] = commandDef;
    }

    async function runPrompt(userInput) {
        const prompt = (userInput || '').trim();
        if (!prompt || isProcessing.value) return;

        const apiStore = useAPIStore();
        const alertStore = useAlertStore();
        const { md } = useMagicDice();

        isProcessing.value = true;
        alertStore.process(true);

        try {
            const schemas = getCommandSchemas(commands);
            const result = await apiStore.resolveCommand(prompt, schemas);

            if (result && result.matched && result.command && commands[result.command]) {
                const outcome = await commands[result.command].execute(result.args || {}, { md });
                if (outcome && outcome.message) {
                    alertStore.create(outcome.message, outcome.type || 'primary');
                }
            } else {
                const fallbackMsg =
                    (result && result.message) || "Sorry, I don't know how to do that.";
                alertStore.create(fallbackMsg, 'warning');
            }
        } catch (err) {
            alertStore.create(
                err.message || 'Something went wrong while processing that command.',
                'danger'
            );
        } finally {
            isProcessing.value = false;
            alertStore.process(false);
        }
    }

    return {
        isProcessing,
        commands,
        registerCommand,
        runPrompt
    };
});
