/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("album", {
    cover_url: {
      type: "TEXT",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("album", "cover_url");
};
