const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  user: 'vagrant',
  database: 'lightbnb',
  password: '123',
});

pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => { })


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {

  const values = [`${email}`];

  return pool.query(`
    SELECT *
    FROM users
    WHERE email = $1
  `, values)
    .then(res => {
      return (res.rows[0]);
    })
    .catch(err => {
      console.error(err.stack);
    });

}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {

  const values = [`${id}`];

  return pool.query(`
    SELECT * 
    FROM users 
    WHERE id = $1
  `, values)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      console.error('query', err.stack)
    });

}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {

  const values = [`${user.name}`, `${user.email}`, `${user.password}`];

  return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, values)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      console.error('query', err.stack);
    });

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {

  return pool.query(`
    SELECT properties.*
    FROM reservations 
    JOIN users ON guest_id = users.id
    JOIN properties ON reservations.property_id = properties.id
    WHERE guest_id = $1
    LIMIT $2
  `, [guest_id, limit])
    .then(res => {
      console.log(res.rows);
      return (res.rows);
    })
    .catch(err => {
      console.error('query', err.stack);
    });

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {

  return pool
    .query(`SELECT * FROM properties LIMIT $1;`, [limit])
    .then(res => {
      console.log(res.rows);
      return (res.rows);
    })
    .catch(err => {
      console.error('query', err.stack);
    });

}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
