const AlbumHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "album",
  version: "1.0.0",

  register: async (server, { albumService, songService, validator }) => {
    const albumHandler = new AlbumHandler(albumService, songService, validator);
    server.route(routes(albumHandler));
  },
};
