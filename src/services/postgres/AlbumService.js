const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor(cacheService) {
    /* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum(payload) {
    const { name, year } = payload;
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3, NULL) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async editAlbumById(id, payload) {
    const { name, year } = payload;
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }

  async addCoverUrl(albumId, coverUrl) {
    const query = {
      text: 'UPDATE album SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal menambahkan cover Album. Id tidak ditemukan',
      );
    }
  }

  async verifyAlbumLikedByUser(albumId, userId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Anda sudah menyukai Album ini!');
    }
  }

  async addAlbumLikedByUser(albumId, userId) {
    const id = `album-like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like album dari user gagal');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async deleteAlbumLikedByUser(albumId, userId) {
    const query = {
      text: 'DELETE from user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal membatalkan Like album');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getAlbumLiked(albumId) {
    const cache = await this._cacheService.get(`likes:${albumId}`);
    if (cache) {
      return {
        value: JSON.parse(cache),
        from: 'cache',
      };
    }
    const query = {
      text: 'SELECT COUNT(*) AS total_like FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    await this._cacheService.set(
      `likes:${albumId}`,
      JSON.stringify(result.rows[0].total_like),
    );

    return {
      value: result.rows[0].total_like,
      from: 'database',
    };
  }
}

module.exports = AlbumService;
