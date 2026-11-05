import { useAPIStore } from '@/stores/apiStore';

function buildFullConversationContext(md) {
    if (!md.ply) return null;

    md.savePlayer();

    let context = {};
    try {
        const list = JSON.parse(localStorage.getItem('charList') || '{}');
        context = list[md.ply.id] ? JSON.parse(JSON.stringify(list[md.ply.id])) : {};
    } catch {
        context = {};
    }

    // Strip heavy visual/history fields, but KEEP statsData.misc_notes (Notebook)
    delete context.renderData;
    delete context.dice_history;

    // Attach pre-calculated sheet values so the AI doesn't have to guess 5e math
    if (md.ply.stats && md.ply.health) {
        const savingThrows = {};
        if (md.ply.stats.sthrows) {
            md.ply.stats.sthrows.forEach((val, key) => {
                savingThrows[key] = val;
            });
        }

        context.computed = {
            proficiencyBonus: md.ply.stats.prof,
            armorClass: md.ply.parse(String(md.ply.health.defaultAC)),
            initiativeBonus: md.ply.parse(String(md.ply.stats.initiative)),
            passivePerception: md.ply.parse(
                `${md.ply.stats.passive_perception} + ${
                    md.ply.stats.passive_perception_mod || 0
                }`
            ),
            abilityModifiers: md.ply.stats.ability_mod,
            savingThrowBonuses: savingThrows,
            skillBonuses: md.ply.stats.skills,
            spellSaveDC: md.ply.magic?.spcMod ? md.ply.magic.DC : null,
            spellAttackBonus: md.ply.magic?.spcMod ? md.ply.magic.SPAttack : null
        };
    }

    return context;
}

export const conversationCommands = [
    {
        name: 'make_conversation',
        description:
            'Answer questions about the character sheet, look up information in the character\'s notebook/notes, explain D&D 5e rules, or chat conversationally with the player. ' +
            'IMPORTANT: Do NOT use this tool if the user is asking to modify their character sheet or roll dice (even if phrased politely as a question like "can you heal me 5 hp?"). ' +
            'Only use this tool for questions, note lookups, advice, or conversation.',
        parameters: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'The user\'s question or conversational message.'
                }
            },
            required: ['prompt'],
            additionalProperties: false
        },
        async execute({ prompt }, { md }) {
            const apiStore = useAPIStore();
            const context = buildFullConversationContext(md);
            const reply = await apiStore.sendPrompt(prompt, context);

            return {
                message: reply || "I'm not quite sure how to answer that!",
                type: 'info',
                undoable: false
            };
        }
    }
];
