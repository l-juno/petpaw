import * as dotenv from 'dotenv'
import { withOracleDB } from './appService.js';

dotenv.config()

export async function getTables() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT table_name
      FROM user_tables`,
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

export async function getAttributes(name) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT column_name
      FROM user_tab_columns
      WHERE table_name = :name`,
      { name }
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

export async function getTuples(name, attributes) {
  try {
    const validTables = await getTables();
    const validAttributes = await getAttributes(name);

    const table = validTables.includes(name) ? name : null;
    if (!table) throw new Error('Invalid table name');

    const attrs = attributes.filter(attr => validAttributes.includes(attr));
    if (attrs.length === 0) throw new Error('No valid attributes');

    const query = `
      SELECT ${attrs.join(', ')}
      FROM ${table}
    `;

    return await withOracleDB(async (connection) => {
      const result = await connection.execute(query);
      return result.rows;
    });
  } catch {
      return [];
  }
}