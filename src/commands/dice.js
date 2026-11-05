import { normalizeSkillKey } from './skills';

const ABILITY_NAMES = {
    str: 'Strength',
    dex: 'Dexterity',
    cnst: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    chr: 'Charisma'
};

function recordRoll(md, result, note = '') {
    md.diceHistory.push(result);

    if (md.ply) {
        if (!md.ply.dice_history) md.ply.dice_history = [];
        md.ply.dice_history.push({
            dice: result.dice,
            compText: result.compText,
            total: result.total,
            max: result.max,
            timestamp: Date.now(),
            note
        });
        md.savePlayer();
    }
}

function calcSkillModifier(skillObj, stats) {
    let val = stats.ability_mod[skillObj.raw];
    if (skillObj.proficent) {
        val += stats.prof;
        if (skillObj.expert) {
            val += stats.prof;
        }
    }
    if (skillObj.custom && !isNaN(skillObj.custom)) {
        val += Number(skillObj.custom);
    }
    return val;
}

export const diceCommands = [
    {
        name: 'roll_dice',
        description:
            'Roll a dice expression (e.g. "roll 2d6+3", "roll d20", "roll 8d6 for fireball") and record it in the Dice Tray and Roll History.',
        parameters: {
            type: 'object',
            properties: {
                expression: {
                    type: 'string',
                    description: 'Standard dice expression to roll (e.g. "1d20+5", "2d6+3", "8d6").'
                },
                note: {
                    type: 'string',
                    description: 'Optional label or reason for the roll (use "" if none).'
                }
            },
            required: ['expression', 'note'],
            additionalProperties: false
        },
        execute({ expression, note }, { md }) {
            const cleanExpr = String(expression || '').trim();
            if (!cleanExpr) {
                return { message: 'Please provide a dice expression to roll.', type: 'warning' };
            }

            const result = md.Dice.x(cleanExpr);
            if (!result || typeof result.total !== 'number' || isNaN(result.total)) {
                return {
                    message: `Could not roll **${cleanExpr}**.`,
                    type: 'warning'
                };
            }

            recordRoll(md, result, note || '');

            const label = note ? ` for **${note}**` : '';
            return {
                message: `Rolled \`${result.dice}\`${label}: **${result.total}** (${result.compText})!`,
                type: 'primary'
            };
        }
    },
    {
        name: 'roll_check',
        description:
            'Roll a skill check, saving throw, ability check, or initiative using the character\'s modifiers (e.g. "roll perception", "make a dexterity saving throw", "roll a strength check", "roll initiative").',
        parameters: {
            type: 'object',
            properties: {
                check_type: {
                    type: 'string',
                    enum: ['skill', 'saving_throw', 'ability', 'initiative'],
                    description: 'The category of d20 roll to make.'
                },
                target: {
                    type: 'string',
                    description:
                        'For "skill": skill key (e.g. "stealth", "athletics", "sleight_of_hand"). For "saving_throw" or "ability": ability key ("str", "dex", "cnst", "int", "wis", "chr"). For "initiative": use "initiative".'
                }
            },
            required: ['check_type', 'target'],
            additionalProperties: false
        },
        execute({ check_type, target }, { md }) {
            if (!md.ply?.stats) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            const stats = md.ply.stats;
            let mod = 0;
            let label = '';

            if (check_type === 'skill') {
                const key = normalizeSkillKey(target.toLowerCase(), stats.skill_modifiers);
                const skillObj = stats.skill_modifiers[key];
                if (!skillObj) {
                    return { message: `Unknown skill **${target}**.`, type: 'warning' };
                }
                mod = calcSkillModifier(skillObj, stats);
                label = `${skillObj.name} Roll`;
            } else if (check_type === 'saving_throw') {
                const key = target.toLowerCase();
                if (stats.sthrows.get(key) === undefined) {
                    return { message: `Unknown saving throw **${target}**.`, type: 'warning' };
                }
                mod = stats.sthrows.get(key);
                label = `${ABILITY_NAMES[key] || key} Saving Throw`;
            } else if (check_type === 'ability') {
                const key = target.toLowerCase();
                if (stats.ability_mod[key] === undefined) {
                    return { message: `Unknown ability **${target}**.`, type: 'warning' };
                }
                mod = stats.ability_mod[key];
                label = `${ABILITY_NAMES[key] || key} Check`;
            } else if (check_type === 'initiative') {
                mod = Number(md.ply.parse(String(stats.initiative))) || 0;
                label = 'Initiative';
            }

            const formula = mod >= 0 ? `d20+${mod}` : `d20${mod}`;
            const result = md.Dice.x(formula);
            recordRoll(md, result, label);

            return {
                message: `**${label}**: rolled **${result.total}** (${result.compText})!`,
                type: 'primary'
            };
        }
    }
];
