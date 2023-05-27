const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapSongsToModel } = require("../../utils");

class AlbumService {
  constructor() {
    /* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
    this._pool = new Pool();
  }

  async addAlbum(payload) {
    const { name, year } = payload;
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO album VALUES($1, $2, $3, NULL) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM album WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    return result.rows[0];
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

  async addCoverUrl(albumId, coverUrl) {
    const query = {
      text: "UPDATE album SET cover_url = $1 WHERE id = $2 RETURNING id",
      values: [coverUrl, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal menambahkan cover Album. Id tidak ditemukan"
      );
    }
  }
}

module.exports = AlbumService;
