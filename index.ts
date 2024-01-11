import * as inquirer from 'inquirer';

import logger from '@@/util/logger';
import { isPosiInt } from '@@/util/number';
import { runBankerRounds } from './banker-score';

(async () => {
  const { mode } = await inquirer.prompt([{
    type: 'list',
    message: 'select game mode',
    name: 'mode',
    choices: [
      { name: 'get banker results', value: 'banker-results' },
    ], 
  }]);

  switch (mode) {
    case 'banker-results': {
      const { oRounds } = await inquirer.prompt([{
        type: 'input',
        message: 'set banker rounds',
        name: 'oRounds',
        default: '10000',
        validate: (val) => {
          if (!isPosiInt(+val)) {
            return 'rounds must be positive integer';
          }

          return true;
        },
      }]);

      const rounds = +oRounds;

      const results = runBankerRounds(rounds);

      logger.log('banker results: ');
      Object.entries(results).forEach(([score, count]) => {
        logger.log(
          score,
          '---',
          `${(count / rounds) * 100}%`,
        );
      });

      break;
    }
  }
})();


