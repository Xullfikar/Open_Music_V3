const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapSongsToModel, mapSongByIdToModel } = require("../../utils");

class AlbumService {
  constructor() {
    /*eslint no-underscore-dangle: ["error", { "allowAfterThis": true }]*/
    this._pool = new Pool();
  }

  async addAlbum(payload) {
    const { name, year } = payload;
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO album VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: "SELECT * FROM album WHERE id = $1",
      values: [id],
    };

    const querySong = {
      text: "SELECT * FROM song WHERE album_id = $1",
      values: [id],
    };

    const resultAlbum = await this._pool.query(queryAlbum);
    const resultSongs = await this._pool.query(querySong);

    const detailAlbum = resultAlbum.rows[0];

    if (!resultAlbum.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const result = {
      id: detailAlbum.id,
      name: detailAlbum.name,
      year: detailAlbum.year,
      songs: resultSongs.rows.map(mapSongsToModel),
    };

    return result;
  }

  async editAlbumById(id, payload) {
    const { name, year } = payload;
    const query = {
      text: "UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM album WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus album. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
