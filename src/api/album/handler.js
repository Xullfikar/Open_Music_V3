const autoBind = require("auto-bind");

class AlbumHandler {
  constructor(albumService, songService, validator) {
    /* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
    this._albumService = albumService;
    this._songService = songService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._albumService.addAlbum(request.payload);

    const response = h.response({
      status: "success",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const resultAlbum = await this._albumService.getAlbumById(id);
    const resultSongs = await this._songService.getSongByAlbumId(id);

    const album = {
      id: resultAlbum.id,
      name: resultAlbum.name,
      year: resultAlbum.year,
      coverUrl: resultAlbum.cover_url,
      songs: resultSongs,
    };

    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumService.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Album berhasil diperbarui",
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._albumService.deleteAlbumById(id);
    return {
      status: "success",
      message: "Album berhasil dihapus",
    };
  }
}

module.exports = AlbumHandler;
