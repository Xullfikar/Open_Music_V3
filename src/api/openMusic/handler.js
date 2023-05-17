const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this.Service = service;
    this.Validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this.Validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this.Service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this.Service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this.Validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;

    await this.Service.editAlbumById({ id, name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this.Service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postSongHandler(request, h) {
    this.Validator.validateSongPayload(request.payload);
    const {
      title = 'untitled',
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    const songId = await this.Service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
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
    const songs = await this.Service.getSongs(searchTitle, searchPerformer);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this.Service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this.Validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    await this.Service.editSongById({
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this.Service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = AlbumHandler;
