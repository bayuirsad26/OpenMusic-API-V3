const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * To be responsible of collaborations service.
 */
class CollaborationsService {
  /**
   * Construc to get access in database.
   * @param {*} cacheService Param represent of cache service.
   */
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  /**
   * Add collaboration into database.
   * @param {*} playlistId Param represent of playlist id.
   * @param {*} userId Param represent of user id.
   * @return {*} Return is result of query.
   */
  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  /**
   * Delete collaboration from database.
   * @param {*} playlistId Param represent of playlist id.
   * @param {*} userId Param represent of user id.
   */
  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: `DELETE FROM collaborations
       WHERE playlist_id = $1 AND user_id = $2 RETURNING id`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }

    await this._cacheService.delete(`songs:${playlistId}`);
  }

  /**
   * Verify collaborator from database.
   * @param {*} playlistId Param represent of playlist id.
   * @param {*} userId Param represent of user id.
   */
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT * FROM collaborations
       WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
