import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMagicDice } from '@/stores/mdStore';
import { useAPIStore } from '@/stores/apiStore';
import { useAlertStore } from '@/stores/alertStore';
import { commandMap, getCommandSchemas } from '@/commands';

function getPlayerSerializedJson(md) {
    if (!md.ply || !localStorage.getItem('charList')) return null;
    try {
        const list = JSON.parse(localStorage.getItem('charList'));
        return list[md.ply.id] ? JSON.stringify(list[md.ply.id]) : null;
    } catch {
        return null;
    }
}

function captureSnapshot(md) {
    if (md.ply) {
        md.savePlayer();
    }
    return {
        charId: md.ply?.id || null,
        charJson: getPlayerSerializedJson(md),
        diceHistory: Array.isArray(md.diceHistory) ? [...md.diceHistory] : [],
        lastRoll: localStorage.getItem('last_roll')
    };
}

function restoreSnapshot(md, snapshot) {
    if (!snapshot) return;

    if (snapshot.charJson && md.ply) {
        try {
            const saved = JSON.parse(snapshot.charJson);
            const ply = md.ply;

            // Mutate properties in-place on the Vue reactive `md.ply` proxy so UI updates immediately
            ply.name = saved.name;
            ply.lvl = Number(saved.lvl);
            ply.exp = saved.exp;
            ply.theme = saved.theme;

            if (Array.isArray(saved.quick_rolls) && Array.isArray(ply.quick_rolls)) {
                ply.quick_rolls.splice(0, ply.quick_rolls.length, ...saved.quick_rolls);
            }

            if (Array.isArray(saved.dice_history)) {
                if (!Array.isArray(ply.dice_history)) ply.dice_history = [];
                ply.dice_history.splice(0, ply.dice_history.length, ...saved.dice_history);
            }

            if (saved.healthData && ply.health) {
                Object.assign(ply.health, saved.healthData);
            }

            if (saved.statsData && ply.stats) {
                if (saved.statsData.ability && ply.stats.ability) {
                    Object.assign(ply.stats.ability, saved.statsData.ability);
                }

                if (Array.isArray(saved.statsData.save_throws) && Array.isArray(ply.stats.save_throws)) {
                    ply.stats.save_throws.splice(
                        0,
                        ply.stats.save_throws.length,
                        ...saved.statsData.save_throws
                    );
                }

                if (saved.statsData.new_save_throws && ply.stats.new_save_throws) {
                    for (const [key, val] of Object.entries(saved.statsData.new_save_throws)) {
                        if (ply.stats.new_save_throws[key]) {
                            Object.assign(ply.stats.new_save_throws[key], val);
                        }
                    }
                }

                if (saved.statsData.skill_modifiers && ply.stats.skill_modifiers) {
                    for (const [key, val] of Object.entries(saved.statsData.skill_modifiers)) {
                        if (ply.stats.skill_modifiers[key]) {
                            Object.assign(ply.stats.skill_modifiers[key], val);
                        }
                    }
                }

                ply.stats.speed = saved.statsData.speed;
                ply.stats.initiative = saved.statsData.initiative;
                ply.stats.passive_perception_mod = saved.statsData.passive_perception_mod;
                ply.stats.misc_notes = saved.statsData.misc_notes;
            }

            if (saved.invData && ply.inv) {
                ply.inv.gold = saved.invData.gold;
            }

            md.savePlayer();
        } catch (err) {
            console.error('Failed to restore character snapshot:', err);
        }
    }

    if (Array.isArray(md.diceHistory) && Array.isArray(snapshot.diceHistory)) {
        md.diceHistory.splice(0, md.diceHistory.length, ...snapshot.diceHistory);
    }

    if (snapshot.lastRoll !== null && snapshot.lastRoll !== undefined) {
        localStorage.setItem('last_roll', snapshot.lastRoll);
    } else {
        localStorage.removeItem('last_roll');
    }
}

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
                const snapshot = captureSnapshot(md);
                const outcome = await commands[result.command].execute(result.args || {}, { md });

                if (outcome && outcome.message) {
                    const afterJson = getPlayerSerializedJson(md);
                    const stateChanged =
                        snapshot.charJson !== afterJson ||
                        snapshot.diceHistory.length !== md.diceHistory.length;

                    let onUndo = null;
                    if (typeof outcome.undo === 'function') {
                        onUndo = () => outcome.undo({ md });
                    } else if (stateChanged && outcome.undoable !== false) {
                        onUndo = () => restoreSnapshot(md, snapshot);
                    }

                    alertStore.create(outcome.message, outcome.type || 'primary', { onUndo });
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
