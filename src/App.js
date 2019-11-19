import React, { useState, useEffect } from 'react';
import './Main.css';
import styles from './App.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import uuid from 'react-uuid';

export default function App() {
    let noteTextArea = React.createRef();
    let searchInput = React.createRef();

    const [search, setSearch] = useState('');
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [note, setNote] = useState(null);
    
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        setFilteredNotes(notes.filter(note => {
            var isSearchInTitle = note.title.toUpperCase().search(search.toUpperCase()) !== -1;
            var isSearchInBody = note.body.toUpperCase().search(search.toUpperCase()) !== -1;

            return isSearchInTitle || isSearchInBody;
        }));
    }, [notes, search])

    const handleEnterPress = (e) => {
        if (e.key === 'Enter' && e.target.value !== '' && !filteredNotes.length > 0) {
            clearSearchInput();
            unselectAllNotes();
            
            addNote(e.target.value);
        }
    };

    const handleNoteClick = (note) => {
        unselectAllNotes();

        note.isSelected = true;

        setNote(note);
    };

    const focusNoteTextArea = () => {
        noteTextArea.current.focus();
    };

    useEffect(() => {
        if (note && !search) {
            focusNoteTextArea();
        }
    });

    const editNote = (e) => {
        note.body = e.target.value;
        
        setNotes(notes.map(n => n.id === note.id ? note : n));
        setFilteredNotes(notes.map(n => n.id === note.id ? note : n));
        setNote(note);
    }

    const clearSearchInput = () => {
        setSearch('');
    };

    const addNote = (title) => {
        var note = {
            id: uuid(),
            title: title,
            body: '',
            createdAt: moment(),
            isSelected: true
        };
        
        setNotes([note, ...notes]);
        setFilteredNotes([note, ...notes]);
        setNote(note);
    };

    const removeNote = () => {
        if (note) {
            notes.splice(notes.indexOf(note), 1);

            setNotes(notes);
            setFilteredNotes(notes);
            setNote(null);
        }
    };

    const unselectAllNotes = () => {
        notes.forEach(note => note.isSelected = false);
        setNotes(notes);
        setFilteredNotes(notes);
    }

    return (
        <div className="App">
            <div className={ styles.header }>
                <div className={ styles.dots }>
                    <span className={ `${ styles.dot } ${ styles.red }` }></span>
                    <span className={ `${ styles.dot } ${ styles.yellow }` }></span>
                    <span className={ `${ styles.dot } ${ styles.green }` }></span>
                </div>
                <button onClick={ removeNote }><FontAwesomeIcon icon={ faTrash } /></button>
                <input
                    value={ search }
                    onChange={ (e) => handleSearchChange(e) }
                    onKeyPress={ (e) => handleEnterPress(e) }
                    placeholder="Search"
                    ref={ searchInput } />
            </div>
            <main>
                <div className={ styles['notes-container'] }>
                    { filteredNotes.length > 0 ? 
                        filteredNotes.map(note => {
                            return (
                                <div 
                                    key={ note.id }
                                    className={ `${ note.isSelected ? [styles['active-note'], styles.note].join(' ') : styles.note }` }
                                    onClick={ () => handleNoteClick(note) }>
                                    <h3 className={ styles.title }>{ note.title }</h3>
                                    <div className={ styles['date-message-container'] }>
                                        <span className={ styles.date }>
                                            { moment(note.createdAt).format('h:mm A') }
                                        </span>
                                        <p className={ styles.body }>{ note.body }</p>
                                    </div>
                                </div>
                            )
                        }) : 
                        <div className={ styles['no-notes'] }>
                            <h3>No notes</h3>
                        </div>
                    }
                </div>
                <div className={ styles['note-container'] }>
                    { note && note.isSelected ? 
                        <div>
                            <div className={ styles['date-container'] }>
                                <p className={ styles.date }>{ moment(note.createdAt).format('MMMM Do, YYYY [at] h:mm A') }</p>
                            </div>
                            <textarea
                                className={ styles.body }
                                value={ note.body }
                                onChange={ (e) => editNote(e) }   
                                ref={ noteTextArea }></textarea>
                        </div>
                    : null }
                </div>
            </main>
        </div>
    )
};