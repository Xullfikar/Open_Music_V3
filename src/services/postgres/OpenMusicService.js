const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongsToModel, mapSongByIdToModel } = require('../../utils');

class OpenMusicService {
  constructor() {
    this.TPool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this.TPool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };

    const querySong = {
      text: 'SELECT * FROM song WHERE album_id = $1',
      values: [id],
    };

    const resultAlbum = await this.TPool.query(queryAlbum);
    const resultSongs = await this.TPool.query(querySong);

    const detailAlbum = resultAlbum.rows[0];

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const result = {
      id: detailAlbum.id,
      name: detailAlbum.name,
      year: detailAlbum.year,
      songs: resultSongs.rows.map(mapSongsToModel),
    };

    return result;
  }

  async editAlbumById({ id, name, year }) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this.TPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.TPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO song (id, title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this.TPool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(searchTitle, searchPerformer) {
    let query;
    if (!searchTitle && !searchPerformer) {
      query = {
        text: 'SELECT * FROM song',
      };
    } else if (searchTitle && searchPerformer) {
      query = {
        text: 'SELECT * FROM song WHERE (title ILIKE $1 AND performer ILIKE $2)',
        values: [`%${searchTitle}%`, `%${searchPerformer}%`],
      };
    } else {
      query = {
        text: 'SELECT * FROM song WHERE title ILIKE $1 OR performer ILIKE $2',
        values: [`%${searchTitle}%`, `%${searchPerformer}%`],
      };
    }

    const result = await this.TPool.query(query);

    return result.rows.map(mapSongsToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM song WHERE id = $1',
      values: [id],
    };

    const result = await this.TPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapSongByIdToModel)[0];
  }

  async editSongById({
    id, title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id =$6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this.TPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM song WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.TPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus song. Id tidak ditemukan');
    }
  }
}

module.exports = OpenMusicService;
