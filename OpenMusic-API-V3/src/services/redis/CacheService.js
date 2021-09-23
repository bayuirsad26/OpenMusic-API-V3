const redis = require('redis');

/**
 * To be responsible of cache service.
 */
class CacheService {
  /**
   * Construct to create client.
   */
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });
    this._client.on('error', (error) => {
      console.error(error);
    });
  }

  /**
   * Set cache.
   * @param {*} key Param represent of key.
   * @param {*} value Param represent of value.
   * @param {*} expirationInSecond Param represent of expiration in second.
   * @return {*} Return is promise of set client.
   */
  set(key, value, expirationInSecond = 3600) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (error) {
          return reject(error);
        }
        return resolve(ok);
      });
    });
  }

  /**
   * Get cache.
   * @param {*} key Param represent of key.
   * @return {*} Return is promise of get client.
   */
  get(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (error) {
          return reject(error);
        }
        if (reply === null) {
          return reject(new Error('Cache tidak ditemukan'));
        }
        return resolve(reply.toString());
      });
    });
  }

  /**
   * Delete cache.
   * @param {*} key Param represent of key.
   * @return {*} Return is promise of delete client.
   */
  delete(key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (error) {
          return reject(error);
        }
        return resolve(count);
      });
    });
  }
}

module.exports = CacheService;
