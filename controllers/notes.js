const pool = require("../configs/db");

exports.addNote = (req, res) => {
  const { heading, content } = req.body;

  pool
    .query("INSERT INTO notes (email, heading, content) VALUES ($1,$2,$3)", [
      req.email,
      heading,
      content,
    ])
    .then((data) => {
      res.status(200).json({
        message: "Note added successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Database error occured.",
      });
    });
};

exports.getAllNotes = (req, res) => {
  pool
    .query("SELECT * FROM notes WHERE email = $1", [req.email])
    .then((data) => {
      const noteData = data.rows;
      const filteredData = noteData.map((note) => {
        return {
          noteId: note.noteid,
          heading: note.heading,
          content: note.content,
        };
      });
      res.status(200).json({
        message: "Notes received successfully.",
        data: filteredData,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Database error occured.",
      });
    });
};

exports.updateNote = (req, res) => {
  const noteId = req.noteId;
  const { heading, content } = req.body;
  pool
    .query("UPDATE notes SET heading = $1, content = $2 WHERE noteid = $3", [
      heading,
      content,
      noteId,
    ])
    .then((data) => {
      res.status(200).json({
        message: "Success",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Database error occured",
      });
    });
};

exports.deleteNote = (req, res) => {
  const noteId = req.noteId;
  pool
    .query("DELETE FROM notes WHERE noteid = $1", [noteId])
    .then(() => {
      res.status(200).json({
        message: "Note successfully deleted.",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Failed to delete the note.",
      });
    });
};
