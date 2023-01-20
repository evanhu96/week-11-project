const notes = require('express').Router();
const { readFromFile, readAndAppend ,writeToFile} = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new UX/UI notes
notes.post('/', (req, res) => {

  const { title, text, note_id } = req.body;

  if (req.body) {
    const newnotes = {
      title,
      text, 
      note_id: uuidv4()
    };
    console.log(newnotes);

    readAndAppend(newnotes, './db/notes.json');
    res.json(`notes added successfully 🚀`);
  } else {
    res.error('Error in adding notes');
  }
});

notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  console.log(noteId)
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.note_id !== noteId);
      console.log(result);

      // Save that array to the filesystem
      writeToFile('./db/notes.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

module.exports = notes;
