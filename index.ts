import * as inquirer from 'inquirer';

import { startBankerSimulate } from './start-banker-simulate';
import { startGame } from './start-game';



(async () => {
  const { mode } = await inquirer.prompt([{
    type: 'list',
    message: 'select game mode',
    name: 'mode',
    choices: [
      { name: 'start game', value: 'game-start' },
      { name: 'simulate banker score', value: 'banker-simulate' },
    ], 
  }]);

  switch (mode) {
    case 'banker-simulate': {
      await startBankerSimulate();
      break;
    }

    case 'game-start': {
      await startGame();
      break;
    }
  }
})();


