/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    album_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "user_album_likes",
    "fk_user_album_id.user_id_users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id)"
  );

  pgm.addConstraint(
    "user_album_likes",
    "fk_user_album_id.album_id_album.id",
    "FOREIGN KEY(album_id) REFERENCES album(id)"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("user_album_likes");
};
