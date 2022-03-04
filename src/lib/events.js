import { readFile } from 'fs/promises';
import pg from 'pg';
import { slugify } from './slugify.js';

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';

const { DATABASE_URL: connectionString, NODE_ENV: nodeEnv = 'development' } =
  process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development
// mode, á heroku, ekki á local vél
const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

export async function query(q, values = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    if (nodeEnv !== 'test') {
      console.error('unable to query', e);
    }
    return null;
  } finally {
    client.release();
  }
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('utf-8'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('utf-8'));
}

export async function createEvent(userid, name, description) {
  const slug = slugify(name,'-');
  const q = `
    INSERT INTO events
      (userid, name, slug, description, created, updated)
    VALUES
      ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id, name, slug, description;
  `;
  const values = [userid, name, slug, description];
  const result = await query(q, values);

  if (result && result.rowCount === 1) return result.rows[0];

  return null;
}

export async function updateEvent(id, description) {
  const q = `
    UPDATE events
      SET
        description = $2,
        updated = CURRENT_TIMESTAMP
    WHERE
      id = $1
    RETURNING id, userid, name, slug, description;
  `;

  try {
    const values = [id, description];
    const result = await query(q, values);

    if (result && result.rowCount === 1) return result.rows[0];
  } catch (e) {
    console.error('no such event', e);
  }

  return false;
}

export async function deleteEvent(id) {
  const q = `
    DELETE FROM events
    WHERE
      id = $1
`;
  const values = [id];
  const result = await query(q, values);

  if (result && result.rowCount === 1) return result.rows[0];

  return null;
}

export async function register(userid, comment, eventid ) {
  const q = `
    INSERT INTO registrations
      (userId, comment, eventid, created)
    VALUES
      ($1, $2, $3, CURRENT_TIMESTAMP)
    RETURNING
      id, userid, comment, eventid;
  `;

  const values = [userid, comment, eventid];
  try{
    const result = await query(q, values);
    if (result && result.rowCount === 1) return result.rows[0];
  } catch (e) {
    console.error('no such event', e);
    return false;
  }

  return null;
}

export async function listEvents() {
  const q = `
    SELECT
      id, name, slug, description, created, updated
    FROM
      events
  `;

  const result = await query(q);

  if (result) return result.rows;

  return null;
}

export async function listEvent(slug) {
  const q = `
    SELECT
      id, name, slug, description, created, updated
    FROM
      events
    WHERE slug = $1
  `;

  const result = await query(q, [slug]);

  if (result && result.rowCount === 1) return result.rows[0];

  return null;
}

export async function listEventByName(name) {
  const q = `
    SELECT
      id, name, slug, description, created, updated
    FROM
      events
    WHERE name = $1
  `;

  const result = await query(q, [name]);

  if (result && result.rowCount === 1) return result.rows[0];

  return null;
}

export async function listEventById(id) {
  const q = `
    SELECT
      id, userId, name, slug, description, created, updated
    FROM
      events
    WHERE id = $1
  `;

  const result = await query(q, [id]);

  if (result && result.rowCount === 1) return result.rows[0];

  return null;
}

export async function listRegistered(event) {
  const q = `
    SELECT
      id, name, comment
    FROM
      registrations
    WHERE event = $1
  `;

  const result = await query(q, [event]);

  if (result) {
    return result.rows;
  }

  return null;
}

export async function end() {
  await pool.end();
}

export async function deleteRegistration(id, userId) {
  const q = `
    DELETE FROM
      registrations
    WHERE
      eventid = $1 and userid = $2
`;
  const values = [id, userId];
  const result = await query(q, values);
  if (result && result.rowCount === 1) return true;

  return null;
}
