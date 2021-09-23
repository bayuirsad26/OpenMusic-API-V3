const {Pool} = require('pg');

/**
 * To be responsible of notes service.
 */
class NotesService {
  /**
   * Construct to get access in database.
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * Get notes from database.
   * @param {*} userId Param represent of user id.
   * @return {*} Return is result of query.
   */
  async getNotes(userId) {
    const query = {
      text: `SELECT notes.* FROM notes
      LEFT JOIN collaborations ON collaborations.note_id = notes.id
      WHERE notes.owner = $1 OR collaborations.user_id = $1
      GROUP BY notes.id`,
      values: [userId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = NotesService;
