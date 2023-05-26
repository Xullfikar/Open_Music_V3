const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapSongsToModel, mapSongByIdToModel } = require("../../utils");

class SongService {
  constructor() {
    /* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
    this._pool = new Pool();
  }

  async addSong(payload) {
    const id = nanoid(16);
    const {
      title = "untitled",
      year,
      genre,
      performer,
      duration,
      albumId,
    } = payload;

    const query = {
      text: "INSERT INTO song (id, title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs(searchTitle, searchPerformer) {
    let query;
    if (!searchTitle && !searchPerformer) {
      query = {
        text: "SELECT * FROM song",
      };
    } else if (searchTitle && searchPerformer) {
      query = {
        text: "SELECT * FROM song WHERE (title ILIKE $1 AND performer ILIKE $2)",
        values: [`%${searchTitle}%`, `%${searchPerformer}%`],
      };
    } else {
      query = {
        text: "SELECT * FROM song WHERE title ILIKE $1 OR performer ILIKE $2",
        values: [`%${searchTitle}%`, `%${searchPerformer}%`],
      };
    }

    const result = await this._pool.query(query);

    return result.rows.map(mapSongsToModel);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    return result.rows.map(mapSongByIdToModel)[0];
  }

  async editSongById(id, payload) {
    const { title, year, genre, performer, duration, albumId } = payload;
    const query = {
      text: "UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id =$6 WHERE id = $7 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui Song. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM song WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus song. Id tidak ditemukan");
    }
  }
}

module.exports = SongService;
