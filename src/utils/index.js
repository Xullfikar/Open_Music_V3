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
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = { mapSongsToModel, mapSongByIdToModel };
