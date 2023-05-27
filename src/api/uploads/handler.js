const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, albumService, validator) {
    /* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
    this._storageService = storageService;
    this._albumService = albumService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._albumService.addCoverUrl(id, coverUrl);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
