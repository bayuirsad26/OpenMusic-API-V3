/**
 * To be responsible of users handler.
 */
class UsersHandler {
  /**
   * Construct to declare and bind variable.
   * @param {*} service Param represent of service.
   * @param {*} validator Param represent of validator.
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  /**
   * Post users handler response.
   * @param {*} request Param represent of request.
   * @param {*} h Param represent of response.
   * @return {*} Return is response of code.
   */
  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const {username, password, fullname} = request.payload;

    const userId = await this._service.addUser({
      username, password, fullname,
    });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * Get user by id handler response.
   * @param {*} request Param represent of request.
   * @param {*} h Param represent of response.
   * @return {*} Return is response of code.
   */
  async getUserByIdHandler(request, h) {
    const {id} = request.params;
    const user = await this._service.getUserById(id);
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;
