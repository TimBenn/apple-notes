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
        var note = {
            id: uuid(),
            title: title,
            body: '',
            createdAt: moment(),
            isSelected: true
        };

        var notes = this.state.notes;
        notes.unshift(note);

        this.unselectAllNotes();

        this.setState({
            note: note,
            notes: notes,
            filtered: notes
        })
        
        setTimeout(() => {
            this.focusNoteTextArea();
        }, 200);
    };

    setCurrentNote(id) {
        this.unselectAllNotes();

        var note = this.state.notes.find(note => note.id === id);
        note.isSelected = true;

        this.setState({
            note: note
        });

        setTimeout(() => {
            this.focusNoteTextArea();
        }, 200);
    };

    focusNoteTextArea() {
        this.noteTextArea.current.focus();
    };

    unselectAllNotes() {
        var notes = this.state.notes.map(note => {
            note.isSelected = false;
            return note;
        });

        this.setState({
            notes: notes,
            filteredNotes: notes,
        });
    }

    handleSearchChange(value) {
        this.setState({
            search: value
        })

        this.filterNotes(value);
    };

    filterNotes(value)  {
        var notes = this.state.notes;

        var filteredNotes = notes.filter(note => {
            var isSearchInTitle = note.title.toUpperCase().search(value.toUpperCase()) !== -1;
            var isSearchInBody = note.body.toUpperCase().search(value.toUpperCase()) !== -1;

            return isSearchInTitle || isSearchInBody;
        })

        this.setState({
            filteredNotes: filteredNotes
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
        var note = {
            ...this.state.note,
            body: e.target.value
        }

        this.setState({
            note: note
        });

        this.updateNote();  
    };

    removeNote(note) {
        var notes = this.state.notes;
        
        var noteToBeDeleted = this.state.notes.find(stateNote => stateNote.id === note.id);
        notes.splice(notes.indexOf(noteToBeDeleted), 1);

        this.setState({
            notes: notes
        })
    };

    updateNote = debounce(() => {
        var notes = this.state.notes.map(note => {
            if (this.state.note.id === note.id) {
                return this.state.note;
            } else {
                return note;
            }
        });

        this.setState({
            notes: notes,
            filteredNotes: notes
        });
    }, 500);

    render() {
        return (
            <div className="App">
                <div className={ styles.header }>
                    <div className={ styles.dots }>
                        <span className={ `${ styles.dot } ${ styles.red }` }></span>
                        <span className={ `${ styles.dot } ${ styles.yellow }` }></span>
                        <span className={ `${ styles.dot } ${ styles.green }` }></span>
                    </div>
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
                                return <div key={ note.id } className={ `${ note.isSelected ? [styles['active-note'], styles.note].join(' ') : styles.note }` } onClick={ () => this.setCurrentNote(note.id) }>
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