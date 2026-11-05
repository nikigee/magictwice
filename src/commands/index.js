import { skillsCommands } from './skills';
import { healthCommands } from './health';
import { diceCommands } from './dice';
import { characterCommands } from './character';

export const commandList = [
    ...skillsCommands,
    ...healthCommands,
    ...diceCommands,
    ...characterCommands
];

export const commandMap = Object.fromEntries(
    commandList.map((cmd) => [cmd.name, cmd])
);

export function getCommandSchemas(registry = commandMap) {
    return Object.values(registry).map(({ name, description, parameters }) => ({
        name,
        description,
        parameters
    }));
}
