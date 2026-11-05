export const healthCommands = [
    {
        name: 'modify_health',
        description:
            'Heal the character, apply damage, or set current HP, maximum HP, or temporary HP. Supports numbers or dice expressions (e.g. "heal 8 hp", "take 14 damage", "heal 2d4+2", "give me 10 temp hp", "set max hp to 45").',
        parameters: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['heal', 'damage', 'set_current', 'set_max', 'set_temp'],
                    description: 'The type of health modification to perform.'
                },
                amount: {
                    type: 'string',
                    description:
                        'The numeric amount or dice formula as a string (e.g. "10" or "2d4+2").'
                }
            },
            required: ['action', 'amount'],
            additionalProperties: false
        },
        execute({ action, amount }, { md }) {
            const health = md.ply?.health;
            if (!health) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            const rollResult = md.Dice.x(String(amount).trim(), true);
            const resolvedValue =
                rollResult && typeof rollResult.total === 'number' && !isNaN(rollResult.total)
                    ? rollResult.total
                    : Number(amount);

            if (isNaN(resolvedValue)) {
                return {
                    message: `Could not evaluate health amount **${amount}**.`,
                    type: 'warning'
                };
            }

            // If dice were rolled as part of healing/damage, record in the Dice Tray
            if (rollResult && Array.isArray(rollResult.list) && rollResult.list.length > 0) {
                md.diceHistory.push(rollResult);
                localStorage.setItem('last_roll', JSON.stringify(rollResult));
            }

            if (action === 'heal') {
                const amt = Math.abs(resolvedValue);
                health.add(amt);
                md.savePlayer();
                return {
                    message: `Healed for **${amt} HP**! Current HP: **${health.currentHP} / ${health.maxHP}**.`,
                    type: 'success'
                };
            }

            if (action === 'damage') {
                const amt = Math.abs(resolvedValue);
                health.add(-amt);
                md.savePlayer();
                return {
                    message: `Took **${amt} damage**! Current HP: **${health.currentHP} / ${health.maxHP}**.`,
                    type: 'danger'
                };
            }

            if (action === 'set_current') {
                health.currentHP = Math.min(Number(health.maxHP), Math.max(0, resolvedValue));
                md.savePlayer();
                return {
                    message: `Set current HP to **${health.currentHP} / ${health.maxHP}**.`,
                    type: 'info'
                };
            }

            if (action === 'set_max') {
                const wasAtFull = Number(health.currentHP) === Number(health.maxHP);
                health.maxHP = Math.max(1, resolvedValue);
                if (wasAtFull || Number(health.currentHP) > health.maxHP) {
                    health.currentHP = health.maxHP;
                }
                md.savePlayer();
                return {
                    message: `Set maximum HP to **${health.maxHP}**!`,
                    type: 'success'
                };
            }

            if (action === 'set_temp') {
                const tempVal = Math.max(0, resolvedValue);
                health.tempHP = tempVal;
                health.currentTempHP = tempVal;
                md.savePlayer();
                return {
                    message:
                        tempVal > 0
                            ? `Granted **${tempVal} temporary HP**!`
                            : 'Cleared temporary HP.',
                    type: 'info'
                };
            }

            return { message: 'Unsupported health action.', type: 'warning' };
        }
    },
    {
        name: 'update_combat_stat',
        description:
            'Update the character\'s Armor Class (AC), movement speed, or initiative modifier (e.g. "set my AC to 17", "set speed to 35", "set initiative to dex+2").',
        parameters: {
            type: 'object',
            properties: {
                stat: {
                    type: 'string',
                    enum: ['ac', 'speed', 'initiative'],
                    description: 'Which combat stat to change.'
                },
                value: {
                    type: 'string',
                    description: 'The new value or formula (e.g. "16", "10 + dex", "35").'
                }
            },
            required: ['stat', 'value'],
            additionalProperties: false
        },
        execute({ stat, value }, { md }) {
            if (!md.ply) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            if (stat === 'ac') {
                md.ply.health.defaultAC = String(value).trim();
                md.ply.health.currentAC = md.ply.health.defaultAC;
                md.savePlayer();
                const parsed = md.ply.parse(String(md.ply.health.defaultAC));
                return {
                    message: `Updated **Armor Class** to **${parsed}**!`,
                    type: 'success'
                };
            }

            if (stat === 'speed') {
                const numSpeed = Number(value);
                if (isNaN(numSpeed)) {
                    return { message: `Invalid speed value **${value}**.`, type: 'warning' };
                }
                md.ply.stats.speed = numSpeed;
                md.savePlayer();
                return {
                    message: `Updated **Speed** to **${numSpeed} ft.**!`,
                    type: 'success'
                };
            }

            if (stat === 'initiative') {
                md.ply.stats.initiative = String(value).trim();
                md.savePlayer();
                const parsed = md.ply.parse(String(md.ply.stats.initiative));
                return {
                    message: `Updated **Initiative** modifier to **${parsed}**!`,
                    type: 'success'
                };
            }

            return { message: 'Unsupported combat stat.', type: 'warning' };
        }
    },
    {
        name: 'set_hit_dice',
        description:
            'Set or update the character\'s Hit Dice (e.g. "set hit dice to 4d10", "change my hit die to d8", "set remaining hit dice to 2").',
        parameters: {
            type: 'object',
            properties: {
                hit_dice: {
                    type: 'string',
                    description:
                        'The hit dice value to set, such as a full dice string ("3d10"), a die type ("d8"), or a remaining count ("2").'
                }
            },
            required: ['hit_dice'],
            additionalProperties: false
        },
        execute({ hit_dice }, { md }) {
            if (!md.ply?.health) {
                return { message: 'No active character loaded.', type: 'danger' };
            }

            const raw = String(hit_dice || '').trim().toLowerCase();
            if (!raw) {
                return { message: 'Please specify a Hit Dice value.', type: 'warning' };
            }

            const current = String(md.ply.health.hitdie || '1d8').toLowerCase();
            const currentParts = current.split('d');
            const currentCount = parseInt(currentParts[0], 10) || Number(md.ply.lvl) || 1;
            const currentFace = parseInt(currentParts[1], 10) || 8;

            let nextHitDie = raw;
            if (/^\d+d\d+$/.test(raw)) {
                nextHitDie = raw;
            } else if (/^d\d+$/.test(raw)) {
                nextHitDie = `${currentCount}${raw}`;
            } else if (/^\d+$/.test(raw)) {
                nextHitDie = `${raw}d${currentFace}`;
            }

            md.ply.health.hitdie = nextHitDie;
            md.savePlayer();

            return {
                message: `Updated **Hit Dice** to **${md.ply.health.hitdie}**!`,
                type: 'success'
            };
        }
    }
];
