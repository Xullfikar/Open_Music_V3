/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("album", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
  });
  pgm.createTable("song", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
    performer: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    genre: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    duration: {
      type: "INT",
    },
    album_id: {
      type: "VARCHAR(50)",
      references: "album(id)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("album");
  pgm.dropTable("song");
};
