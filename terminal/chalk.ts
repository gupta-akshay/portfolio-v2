import { Chalk } from 'chalk';

import { configuredChalkLevel } from './colorEnv';

const createChalkInstance = () => new Chalk({ level: configuredChalkLevel });

const forcedChalk = createChalkInstance();

export default forcedChalk;
