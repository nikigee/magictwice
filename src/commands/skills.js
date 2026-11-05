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

const ABILITY_KEYS = ['str', 'dex', 'cnst', 'int', 'wis', 'chr'];

const ABILITY_NAMES = {
    str: 'Strength',
    dex: 'Dexterity',
    cnst: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    chr: 'Charisma'
};

export function normalizeSkillKey(skill, skillModifiers) {
    if (skill === 'religion' && skillModifiers && !skillModifiers.religion) {
        return 'religon';
    }
    return skill;
}

export const skillsCommands = [
    {
        name: 'update_skill',
        description:
            'Grant or remove proficiency or expertise in a D&D 5e skill, or set a custom bonus modifier on a skill (e.g. "mark athletics as proficient", "give me expertise in stealth", "add a +2 bonus to perception").',
        parameters: {
            type: 'object',
            properties: {
                skill: {
                    type: 'string',
                    enum: SKILL_KEYS,
                    description: 'The skill key to update.'
                },
                mode: {
                    type: 'string',
                    enum: ['proficient', 'expert', 'custom_modifier'],
                    description:
                        'Whether to change proficiency, expertise, or the custom numerical modifier.'
                },
                enabled: {
                    type: 'boolean',
                    description:
                        'For "proficient" or "expert" mode: true to enable, false to remove. Ignored for "custom_modifier".'
                },
                modifier: {
                    type: 'number',
                    description:
                        'For "custom_modifier" mode: the custom numeric bonus/penalty to set (e.g. 2, -1, 0). Use 0 for other modes.'
                }
            },
            required: ['skill', 'mode', 'enabled', 'modifier'],
            additionalProperties: false
        },
        execute({ skill, mode, enabled, modifier }, { md }) {
            const skillModifiers = md.ply?.stats?.skill_modifiers;
            if (!skillModifiers) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            const key = normalizeSkillKey(skill, skillModifiers);
            const skillObj = skillModifiers[key];
            if (!skillObj) {
                return { message: `Could not find skill **${skill}**.`, type: 'warning' };
            }

            if (mode === 'proficient') {
                if (Boolean(skillObj.proficent) === Boolean(enabled)) {
                    return {
                        message: `**${skillObj.name}** is already ${
                            enabled ? 'proficient' : 'not proficient'
                        }.`,
                        type: 'info'
                    };
                }
                skillObj.proficent = Boolean(enabled);
                if (!enabled && skillObj.expert) {
                    skillObj.expert = false;
                }
                md.savePlayer();
                return {
                    message: enabled
                        ? `Marked **${skillObj.name}** as proficient!`
                        : `Removed proficiency from **${skillObj.name}**.`,
                    type: 'success'
                };
            }

            if (mode === 'expert') {
                if (Boolean(skillObj.expert) === Boolean(enabled)) {
                    return {
                        message: `**${skillObj.name}** already has expertise ${
                            enabled ? 'enabled' : 'disabled'
                        }.`,
                        type: 'info'
                    };
                }
                if (enabled && !skillObj.proficent) {
                    skillObj.proficent = true;
                }
                skillObj.expert = Boolean(enabled);
                md.savePlayer();
                return {
                    message: enabled
                        ? `Granted expertise in **${skillObj.name}**!`
                        : `Removed expertise from **${skillObj.name}**.`,
                    type: 'success'
                };
            }

            if (mode === 'custom_modifier') {
                skillObj.custom = Number(modifier) || 0;
                md.savePlayer();
                const sign = skillObj.custom >= 0 ? `+${skillObj.custom}` : `${skillObj.custom}`;
                return {
                    message: `Set **${skillObj.name}** custom modifier to **${sign}**.`,
                    type: 'success'
                };
            }

            return { message: 'Unsupported skill update mode.', type: 'warning' };
        }
    },
    {
        name: 'update_saving_throw',
        description:
            'Grant or remove proficiency in a saving throw (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma), or set a custom modifier on a saving throw.',
        parameters: {
            type: 'object',
            properties: {
                ability: {
                    type: 'string',
                    enum: ABILITY_KEYS,
                    description: 'The ability key (str, dex, cnst, int, wis, chr).'
                },
                mode: {
                    type: 'string',
                    enum: ['proficient', 'custom_modifier'],
                    description: 'Whether to update saving throw proficiency or custom modifier.'
                },
                enabled: {
                    type: 'boolean',
                    description: 'For "proficient" mode: true to add proficiency, false to remove.'
                },
                modifier: {
                    type: 'number',
                    description: 'For "custom_modifier" mode: numeric modifier to set (0 otherwise).'
                }
            },
            required: ['ability', 'mode', 'enabled', 'modifier'],
            additionalProperties: false
        },
        execute({ ability, mode, enabled, modifier }, { md }) {
            if (!md.ply?.stats) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            const label = ABILITY_NAMES[ability] || ability;

            if (mode === 'proficient') {
                const saves = md.ply.stats.save_throws;
                const hasProf = saves.includes(ability);

                if (hasProf === Boolean(enabled)) {
                    return {
                        message: `**${label}** saving throws are already ${
                            enabled ? 'proficient' : 'not proficient'
                        }.`,
                        type: 'info'
                    };
                }

                if (enabled) {
                    saves.push(ability);
                } else {
                    const idx = saves.indexOf(ability);
                    if (idx > -1) saves.splice(idx, 1);
                }

                md.savePlayer();
                return {
                    message: enabled
                        ? `Added proficiency to **${label}** saving throws!`
                        : `Removed proficiency from **${label}** saving throws.`,
                    type: 'success'
                };
            }

            if (mode === 'custom_modifier') {
                if (md.ply.stats.new_save_throws?.[ability]) {
                    md.ply.stats.new_save_throws[ability].custom = Number(modifier) || 0;
                    md.savePlayer();
                    const val = md.ply.stats.new_save_throws[ability].custom;
                    const sign = val >= 0 ? `+${val}` : `${val}`;
                    return {
                        message: `Set **${label}** saving throw custom modifier to **${sign}**.`,
                        type: 'success'
                    };
                }
            }

            return { message: 'Could not update saving throw.', type: 'warning' };
        }
    },
    {
        name: 'set_ability_score',
        description:
            'Set one of the character\'s six core ability scores (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma) to a specific number (e.g. "set strength to 18", "change my wisdom score to 14").',
        parameters: {
            type: 'object',
            properties: {
                ability: {
                    type: 'string',
                    enum: ABILITY_KEYS,
                    description: 'The ability key (str, dex, cnst, int, wis, chr).'
                },
                score: {
                    type: 'number',
                    description: 'The new ability score value (typically between 1 and 30).'
                }
            },
            required: ['ability', 'score'],
            additionalProperties: false
        },
        execute({ ability, score }, { md }) {
            if (!md.ply?.stats?.ability) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            const label = ABILITY_NAMES[ability] || ability;
            const numericScore = Math.max(1, Math.min(30, Math.round(Number(score))));
            md.ply.stats.ability[ability] = numericScore;
            md.savePlayer();

            const mod = md.ply.stats.ability_mod[ability];
            const modStr = mod >= 0 ? `+${mod}` : `${mod}`;

            return {
                message: `Set **${label}** to **${numericScore}** (modifier **${modStr}**)!`,
                type: 'success'
            };
        }
    }
];
