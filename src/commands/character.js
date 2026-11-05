export const characterCommands = [
    {
        name: 'modify_gold',
        description:
            'Add, spend/remove, or set the character\'s gold pieces (GP) (e.g. "add 50 gold", "spend 15 gp", "set my gold to 200").',
        parameters: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['add', 'remove', 'set'],
                    description: 'Whether to add gold, remove/spend gold, or set the exact total.'
                },
                amount: {
                    type: 'number',
                    description: 'The positive number of gold pieces.'
                }
            },
            required: ['action', 'amount'],
            additionalProperties: false
        },
        execute({ action, amount }, { md }) {
            if (!md.ply?.inv) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            const val = Math.abs(Number(amount)) || 0;
            const current = Number(md.ply.inv.gold) || 0;

            if (action === 'add') {
                md.ply.inv.gold = current + val;
                md.savePlayer();
                return {
                    message: `Added **${val} GP**! You now have **${md.ply.inv.gold} GP**.`,
                    type: 'success'
                };
            }

            if (action === 'remove') {
                md.ply.inv.gold = Math.max(0, current - val);
                md.savePlayer();
                return {
                    message: `Spent **${val} GP**. You now have **${md.ply.inv.gold} GP**.`,
                    type: 'info'
                };
            }

            if (action === 'set') {
                md.ply.inv.gold = Math.max(0, val);
                md.savePlayer();
                return {
                    message: `Set gold to **${md.ply.inv.gold} GP**.`,
                    type: 'success'
                };
            }

            return { message: 'Unsupported gold action.', type: 'warning' };
        }
    },
    {
        name: 'modify_xp',
        description:
            'Add, remove, or set the character\'s experience points (XP) (e.g. "gain 350 xp", "add 1200 experience", "set xp to 2700").',
        parameters: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['add', 'remove', 'set'],
                    description: 'Whether to add XP, remove XP, or set the total XP.'
                },
                amount: {
                    type: 'number',
                    description: 'The positive number of experience points.'
                }
            },
            required: ['action', 'amount'],
            additionalProperties: false
        },
        execute({ action, amount }, { md }) {
            if (!md.ply) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            const val = Math.abs(Number(amount)) || 0;
            const current = Number(md.ply.exp) || 0;

            if (action === 'add') {
                md.ply.exp = current + val;
                md.savePlayer();
                return {
                    message: `Gained **${val} XP**! Total XP: **${md.ply.exp}**.`,
                    type: 'success'
                };
            }

            if (action === 'remove') {
                md.ply.exp = Math.max(0, current - val);
                md.savePlayer();
                return {
                    message: `Removed **${val} XP**. Total XP: **${md.ply.exp}**.`,
                    type: 'info'
                };
            }

            if (action === 'set') {
                md.ply.exp = Math.max(0, val);
                md.savePlayer();
                return {
                    message: `Set experience points to **${md.ply.exp} XP**.`,
                    type: 'success'
                };
            }

            return { message: 'Unsupported XP action.', type: 'warning' };
        }
    },
    {
        name: 'set_level',
        description:
            'Level up the character or set the character\'s level to a specific value (1-20) (e.g. "level up", "set my level to 5").',
        parameters: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['level_up', 'set'],
                    description: '"level_up" to increment current level by 1, or "set" to assign a specific level.'
                },
                level: {
                    type: 'number',
                    description: 'Target level when action is "set" (1-20). Use 0 when action is "level_up".'
                }
            },
            required: ['action', 'level'],
            additionalProperties: false
        },
        execute({ action, level }, { md }) {
            if (!md.ply) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            const currentLvl = Number(md.ply.lvl) || 1;
            const nextLvl =
                action === 'level_up'
                    ? Math.min(20, currentLvl + 1)
                    : Math.max(1, Math.min(20, Math.round(Number(level))));

            md.ply.lvl = nextLvl;
            md.savePlayer();

            return {
                message: `**${md.ply.name}** is now **Level ${md.ply.lvl}** (Proficiency Bonus: **+${md.ply.stats.prof}**)!`,
                type: 'success'
            };
        }
    },
    {
        name: 'long_rest',
        description:
            'Take a long rest, restoring HP to maximum, clearing temporary HP, and recovering up to half of total Hit Dice (e.g. "take a long rest", "long rest").',
        parameters: {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: false
        },
        execute(_args, { md }) {
            if (!md.ply?.health) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            md.ply.health.currentHP = Number(md.ply.health.maxHP);
            md.ply.health.tempHP = 0;
            md.ply.health.currentTempHP = 0;
            md.ply.health.currentAC = md.ply.health.defaultAC;

            try {
                const cvt = md.Dice.cvt(md.ply.health.hitdie);
                const recovered = Math.max(1, Math.floor(Number(md.ply.lvl) / 2));
                const nextCount = Math.min(Number(md.ply.lvl), cvt.iterator + recovered);
                md.ply.health.hitdie = `${nextCount}d${cvt.face}`;
            } catch (err) {
                // Keep existing hitdie string if non-standard
            }

            md.savePlayer();

            return {
                message: `You take a **Long Rest** and awaken fully restored (**${md.ply.health.currentHP} / ${md.ply.health.maxHP} HP**, Hit Dice: **${md.ply.health.hitdie}**)!`,
                type: 'success'
            };
        }
    }
];
