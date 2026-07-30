import * as migration_20260729_142156_initial from './20260729_142156_initial';

export const migrations = [
  {
    up: migration_20260729_142156_initial.up,
    down: migration_20260729_142156_initial.down,
    name: '20260729_142156_initial'
  },
];
