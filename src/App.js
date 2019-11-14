import React, { Component }  from 'react';
import './Main.css';
import styles from './App.module.css';
import debounce from 'lodash/debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import uuid from 'react-uuid';

export default class App extends Component {
    constructor() {
        super()

        this.noteTextArea = React.createRef();

        this.state = {
            notes: [],
            filteredNotes: [],
            search: '',
            note: null,
            canCreateNewNote: false
        }
    }

    addNote(title)  {
        var newNote = {
            id: uuid(),
            title: title,
            body: '',
            createdAt: moment(),
            isSelected: true
        };

        var updatedNotes = [newNote, ...this.state.notes.map(note => {
            note.isSelected = false;
            return note;
        })];

        this.setState({
            notes: updatedNotes,
            filteredNotes: updatedNotes,
            note: newNote
        })
        
        setTimeout(() => {
            this.focusTextInput();
        }, 200);
    };

    focusTextInput() {
        this.noteTextArea.current.focus();
    };

    setNote(id) {
        var updatedNotes = this.state.notes.map(note => {
            note.isSelected = false;
            return note;
        });

        var note = this.state.notes.find(note => note.id === id);
        note.isSelected = true;

        this.setState({
            notes: updatedNotes,
            note: note
        })

        setTimeout(() => {
            this.focusTextInput();
        }, 200);
    };

    handleSearchChange(value) {
        this.setState({
            search: value
        })

        this.filterNotes(value);
    };

    filterNotes(value)  {
        var updatedList = this.state.notes;

        updatedList = updatedList.filter(note => {
            var isSearchInTitle = note.title.toUpperCase().search(value.toUpperCase()) !== -1;
            var isSearchInBody = note.body.toUpperCase().search(value.toUpperCase()) !== -1;

            return isSearchInTitle || isSearchInBody;
        })

        this.setState({
            filteredNotes: updatedList
        })
    };

    clearSearch() {
        this.setState({
            search: ''
        })
    };

    handleEnterPress(e) {
        if (e.key === 'Enter' && e.target.value !== '' && !this.state.filteredNotes.length > 0) {
            this.addNote(e.target.value);
            this.clearSearch();
        }
    };

    handleNoteBodyChange(e) {
        var updateNote = {
            ...this.state.note,
            body: e.target.value
        }

        this.setState({
            note: updateNote
        });

        this.updateNotes();  
    };

    removeNote(note) {
        var notes = this.state.notes;
        
        var noteToBeDeleted = this.state.notes.find(stateNote => stateNote.id === note.id);
        notes.splice(notes.indexOf(noteToBeDeleted), 1);

        this.updateNotes(notes);
    };

    updateNotes = debounce(() => {
        var updatedNotes = this.state.notes.map(note => {
            if (this.state.note.id === note.id) {
                return this.state.note;
            } else {
                return note;
            }
        });

        this.setState({
            notes: updatedNotes,
            filteredNotes: updatedNotes
        });
    }, 500);

    render() {
        return (
            <div className="App">
                <div className={ styles.header }>
                    <button><FontAwesomeIcon icon={ faTrash } onClick={ () => this.removeNote(this.state.note) } /></button>
                    <input
                        value={ this.state.search }
                        onChange={ (e) => this.handleSearchChange(e.target.value) }
                        onKeyPress={ (e) => this.handleEnterPress(e) }
                        placeholder="Search" />
                </div>
                <main>
                    <div className={ styles['notes-container'] }>
                        { this.state.filteredNotes.length > 0 ? 
                            this.state.filteredNotes.map(note => {
                                return <div key={ note.id } className={ `${ note.isSelected ? [styles['active-note'], styles.note].join(' ') : styles.note }` } onClick={ () => this.setNote(note.id) }>
                                    <h3 className={ styles.title }>{ note.title }</h3>
                                    <div className={ styles['date-message-container'] }>
                                        <span className={ styles.date }>{ moment(note.createdAt).format('h:mm A') }</span>
                                        <p className={ styles.body }>{ note.body }</p>
                                    </div>
                                </div>
                            }) : <div className={ styles['no-notes'] }>
                                <h3>You don't have any notes...yet!</h3>
                            </div> }
                    </div>
                    <div className={ styles['note-container'] }>
                        { this.state.note ? 
                            <div>
                                <div className={ styles['date-container'] }>
                                    <p className={ styles.date }>{ moment(this.state.note.createdAt).format('MMMM Do, YYYY [at] h:mm A') }</p>
                                </div>
                                <textarea
                                    className={ styles.body }
                                    value={ this.state.note.body }
                                    onChange={ (e) => this.handleNoteBodyChange(e) }   
                                    ref={ this.noteTextArea }></textarea>
                            </div>
                        : null }
                    </div>
                </main>
            </div>
        )
    }
};