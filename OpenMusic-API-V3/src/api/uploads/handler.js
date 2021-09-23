/**
 * To be responsible of uploads handler.
 */
class UploadsHandler {
  /**
   * Construct to declare and bind variable.
   * @param {*} service Param represent of service.
   * @param {*} validator Param represent of validator.
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  /**
   * Post upload image handler response.
   * @param {*} request Param represent of request.
   * @param {*} h Param represent of response.
   * @return {*} Return is response of code.
   */
  async postUploadImageHandler(request, h) {
    const {data} = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    const fileName = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${fileName}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
