import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMagicDice } from '@/stores/mdStore';
import { useAPIStore } from '@/stores/apiStore';
import { useAlertStore } from '@/stores/alertStore';

const SKILL_KEYS = [
    'acrobatics',
    'animal_handling',
    'arcana',
    'athletics',
    'deception',
    'history',
    'insight',
    'intimidation',
    'investigation',
    'medicine',
    'nature',
    'perception',
    'performance',
    'persuasion',
    'religion',
    'religon',
    'sleight_of_hand',
    'stealth',
    'survival'
];

export const useCommandStore = defineStore('command', () => {
    const isProcessing = ref(false);

    // Registry of preprogrammed commands
    const commands = {
        mark_proficient: {
            name: 'mark_proficient',
            description:
                'Grant or remove proficiency in a Dungeons & Dragons 5e skill on the character sheet (e.g. "mark athletics as proficient", "remove stealth proficiency").',
            parameters: {
                type: 'object',
                properties: {
                    skill: {
                        type: 'string',
                        enum: SKILL_KEYS,
                        description: 'The skill identifier to update.'
                    },
                    proficient: {
                        type: 'boolean',
                        description:
                            'True to mark the skill as proficient, false to remove proficiency.'
                    }
                },
                required: ['skill', 'proficient'],
                additionalProperties: false
            },
            execute({ skill, proficient }, { md }) {
                if (!md.ply || !md.ply.stats || !md.ply.stats.skill_modifiers) {
                    return {
                        message: 'No active character loaded.',
                        type: 'danger'
                    };
                }

                // Normalize 'religion' to the internal key 'religon' used in md_magicdie.js
                const normalizedKey =
                    skill === 'religion' && !md.ply.stats.skill_modifiers.religion
                        ? 'religon'
                        : skill;

                const skillObj = md.ply.stats.skill_modifiers[normalizedKey];
                if (!skillObj) {
                    return {
                        message: `Could not find skill **${skill}**.`,
                        type: 'warning'
                    };
                }

                if (Boolean(skillObj.proficent) === Boolean(proficient)) {
                    return {
                        message: `**${skillObj.name}** is already ${
                            proficient ? 'proficient' : 'not proficient'
                        }.`,
                        type: 'info'
                    };
                }

                skillObj.proficent = Boolean(proficient);
                if (!proficient && skillObj.expert) {
                    skillObj.expert = false;
                }

                md.savePlayer();

                return {
                    message: proficient
                        ? `Marked **${skillObj.name}** as proficient!`
                        : `Removed proficiency from **${skillObj.name}**.`,
                    type: 'success'
                };
            }
        }
    };

    function registerCommand(commandDef) {
        if (!commandDef || !commandDef.name) return;
        commands[commandDef.name] = commandDef;
    }

    function getCommandSchemas() {
        return Object.values(commands).map(({ name, description, parameters }) => ({
            name,
            description,
            parameters
        }));
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
            const result = await apiStore.resolveCommand(prompt, getCommandSchemas());

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
        getCommandSchemas,
        runPrompt
    };
});
