const autoBind = require("auto-bind");

class SongHandler {
  constructor(service, validator) {
    /*eslint no-underscore-dangle: ["error", { "allowAfterThis": true }]*/
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: "success",
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const searchTitle = request.query.title;
    const searchPerformer = request.query.performer;
    const songs = await this._service.getSongs(searchTitle, searchPerformer);
    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: "success",
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: "success",
      message: "Song berhasil diperbarui",
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return {
      status: "success",
      message: "Song berhasil dihapus",
    };
  }
}

module.exports = SongHandler;