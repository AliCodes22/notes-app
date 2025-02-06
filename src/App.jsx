import { useState, useEffect } from "react";
import axios from "axios";
import Note from "./components/Note";

import noteService from "./services/notes";
import Notification from "./components/Notification";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happened");

  useEffect(() => {
    noteService.getAll().then((notes) => setNotes(notes));
  }, []);

  console.log("render", notes.length, "notes");

  const addNote = (e) => {
    e.preventDefault();

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    const response = noteService.create(noteObject);
    setNotes(notes.concat(response));
    setNewNote("");
  };

  const handleNoteChange = (e) => {
    console.log(e.target);
    setNewNote(e.target.value);
  };

  // toggle importance handler
  const toggleImportanceOf = (id) => {
    const url = `http:localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    const response = noteService.update(id, changedNote);
    setNotes(notes.map((n) => (n.id === id ? response : n)));
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
