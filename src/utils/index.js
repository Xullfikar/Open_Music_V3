const mapSongsToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapSongByIdToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumid,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: albumid,
});

module.exports = { mapSongsToModel, mapSongByIdToModel };
