import React, { Component } from 'react';
import {connect} from 'react-redux';
import ABCJS from 'abcjs/midi';
import HandleNotes from '../handleNotes';
import {saveUserNotation} from '../actions/users';
import {saveDemoNotation} from '../actions/index';
import 'font-awesome/css/font-awesome.min.css';
import 'abcjs/abcjs-midi.css';
import './SheetMusic.css';

const SheetMusicJSX = (props) => ( 
	<div className="sheetMusicDiv">
		<HandleNotes />
		{/* anonymous function being called to write inline JSX */}
		{( () => {
    		if (props.writtenNotes.length > 1 && props.authToken !== null) {
    			return <a className="save-link" href="" onClick={(e) => props.saveNotation(e)}>Save</a>;
			}
    		else if (props.writtenNotes.length > 1 && props.demo === true) {
    			return <a className="save-link" href="" onClick={(e) => props.saveNotation(e)}>Save</a>;
    		}
    	})()}
		<div className="sheetMusic"></div>
		<div className="sheetMusicMidi"></div>
	</div>
);

export class SheetMusic extends Component {
	constructor(props) {
		super(props);
		this.saveNotation = this.saveNotation.bind(this);
	}

	saveNotation(e) {
		e.preventDefault();
		let titleText;
		let title = prompt('What would you like to title your composition?');
		if (title === null || title === '') {
			titleText = 'Composition';
		}
		else {
			titleText = title;
		}

		let date = new Date();
    	let dateString = date.toString();
    	let truncatedDateString = dateString.substring(0, dateString.length - 36);

    	let justNotationString = this.props.sheetMusic.substring(this.props.sheetMusic.indexOf('|') + 1);

    	justNotationString = `|${justNotationString}|`;

    	if (this.props.demo === true) {

    		let demoPiece = {
    			title: titleText,
				music: justNotationString,
				clef: this.props.clef,
				timeSignature: this.props.timeSignature,
				baseNoteValue: this.props.baseNoteValue,
				key: this.props.key
    		}
    		this.props.dispatch(saveDemoNotation(demoPiece));
    	}

    	else {
			const userInfoWithNotationString = {
				username: this.props.currentUser.username,
				title: titleText,
				music: justNotationString,
				clef: this.props.clef,
				timeSignature: this.props.timeSignature,
				baseNoteValue: this.props.baseNoteValue,
				key: this.props.key,
				creation: truncatedDateString
			}
			this.props.dispatch(saveUserNotation(userInfoWithNotationString));
		}
	}

 	componentDidMount() {
 		const abcDiv = document.querySelector('.sheetMusicDiv > .sheetMusic');

 		ABCJS.renderAbc(abcDiv, this.props.sheetMusic, {
 			responsive: 'resize'
 		});
 	}

 	componentDidUpdate() {

 		const abcDiv = document.querySelector('.sheetMusicDiv > .sheetMusic');

 		ABCJS.renderAbc(abcDiv, this.props.sheetMusic, {
 			responsive: 'resize'
 		});


 		if (ABCJS.midi.deviceSupportsMidi() && this.props.writtenNotes !== undefined && this.props.writtenNotes.length > 1) {
 			let abcString = this.props.sheetMusic;
			const abcMidiDiv = document.querySelector('.sheetMusicDiv > .sheetMusicMidi');
 			ABCJS.renderMidi(abcMidiDiv, abcString, { 
 				generateDownload: true, 
 				generateInline: true,
 				responsive: 'resize'
 			});
		 }
		 // remove the download/playback
		 else {
			let abcString = this.props.sheetMusic;
			const abcMidiDiv = document.querySelector('.sheetMusicDiv > .sheetMusicMidi');
			ABCJS.renderMidi(abcMidiDiv, abcString, { 
				generateDownload: false, 
				generateInline: false
			});
		 }
 	}
		
	render() {
		return <SheetMusicJSX saveNotation={this.saveNotation} {...this.props} />;
	}
}

const mapStateToProps = state => ({
	sheetMusic: state.singer.sheetMusic,
	keyCode: state.singer.keyCode,
	augmentationDotPressed: state.singer.augmentationDotPressed,
	writtenNotes: state.singer.writtenNotes,
	sixteenthNoteCount: state.singer.sixteenthNoteCount,
	clef: state.singer.clef,
	timeSignature: state.singer.timeSignature,
	baseNoteValue: state.singer.baseNoteValue,
	key: state.singer.key,
	authToken: state.auth.authToken,
	currentUser: state.auth.currentUser,
	demo: state.auth.demo
});

export default connect(mapStateToProps)(SheetMusic);
