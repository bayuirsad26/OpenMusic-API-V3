/**
 * To be responsible of collaborations handler.
 */
class CollaborationsHandler {
  /**
   * Construct to declare and bind variable.
   * @param {*} collaborationsService Param represent of collaborations service.
   * @param {*} playlistsService Param represent of playlists service.
   * @param {*} validator Param represent of validator.
   */
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(
        this,
    );
  }

  /**
   * Post collaboration handler response.
   * @param {*} request Param represent of request.
   * @param {*} h Param represent of response.
   * @return {*} Return is response of code.
   */
  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._playlistsService.verifyPlaylistOwner(
        playlistId, credentialId,
    );
    // eslint-disable-next-line max-len
    const collaborationId = await this._collaborationsService.addCollaboration(
        playlistId, userId,
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * Delete collaboration handler response.
   * @param {*} request Param represent of request.
   * @param {*} h Param represent of response.
   * @return {*} Return is response of code.
   */
  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._playlistsService.verifyPlaylistOwner(
        playlistId, credentialId,
    );
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
