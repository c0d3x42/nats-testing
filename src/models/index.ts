import * as Knex from 'knex';
import { Model } from 'objection';

import Instance from './Instance';

const knexConfig = require('../../knexfile');
export const knex = Knex(knexConfig.development);
knex.migrate.latest();

Model.knex(knex);

export { Instance };
