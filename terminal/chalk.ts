import { Chalk } from 'chalk';

import { configuredChalkLevel } from './colorEnv';

const forcedChalk = new Chalk({ level: configuredChalkLevel });

export default forcedChalk;
