/**
 * To be responsible of exports handler.
 */
class ExportsHandler {
  /**
   * Construct to declare and bind variable.
   * @param {*} service Param represent of service.
   * @param {*} validator Param represent of validator.
   * @param {*} playlistsService Param represent of playlists service.
   */
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  /**
   * Post export songs handler response.
   * @param {*} request Param represent of request.
   * @param {*} h Param represent of response.
   * @return {*} Return is response of code.
   */
  async postExportSongsHandler(request, h) {
    this._validator.validateExportSongsPayload(request.payload);
    const {playlistId} = request.params;
    const {id: userId} = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:songs', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
