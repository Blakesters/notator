import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addNote, deleteNote, pressAugmentationDot, releaseAugmentationDot, changeSixteenthNoteCount, changeSheetMusic} from './actions';

export class HandleNotes extends Component {

	componentDidMount() {
		document.addEventListener('keydown', this.pressKey);
		document.addEventListener('keyup', this.releaseKey);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.pressKey);
		document.removeEventListener('keyup', this.releaseKey);
	}

	pressKey = (e) => {

	  // delete handling for notes
	  if (e.keyCode === 68 && this.props.writtenNotes.length >= 1) {
  	    
	    let length = this.props.writtenNotes.length;

	    //if last entry was a barline
	    if (this.props.writtenNotes[length - 1] === '|') {
				if (this.props.timeSignature === '4/4') {
					this.props.dispatch(changeSixteenthNoteCount(16));
				}
				else if (this.props.timeSignature === '3/4' || this.props.timeSignature === '6/8') {
					this.props.dispatch(changeSixteenthNoteCount(12));
				}
				else if (this.props.timeSignature === '2/4') {
					this.props.dispatch(changeSixteenthNoteCount(8));
				}
	    }

	    //if last entry was a sixteenth note
	    else if (this.props.writtenNotes[length - 1].includes('/4')) {
	      this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount - 1));
	    }
	    //if last entry was a eighth note
	    else if (this.props.writtenNotes[length - 1].includes('/2')) {
	      this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount - 2));
	    }
	    //if last entry was a dotted eighth note
	    else if (this.props.writtenNotes[length - 1].includes('3//')) {
	      this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount - 3));
	    }
	    //if last entry was a dotted quarter note
	    else if (this.props.writtenNotes[length - 1].includes('3/')) {
	      this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount - 6));
	    }
	    //if last entry was a half note
	    else if (this.props.writtenNotes[length - 1].includes('2')) {
	    	this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount - 8));
	    }
	    //if last entry was a dotted half note
	    else if (this.props.writtenNotes[length - 1].includes('3') && !this.props.writtenNotes[length - 1].includes('/')) {
	      this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount - 12));
	    }
	    //if last entry was a whole note
	    else if (this.props.writtenNotes[length - 1].includes('4')) {
	      this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount - 16));
	    }
	    //if last entry was a quarter note
	    else {
	    	this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount - 4));
	    }
	    this.props.dispatch(deleteNote());
	  }

	  if (this.props.pitch === undefined || this.props.pitch === '0') {
	  	return;
	  }

	  let note = this.props.pitch;
	  
	  const suitableKeyCodes = [81, 69, 72, 87, 83, 190, 68];

	  if (e.keyCode === 190) {
	  	this.props.dispatch(pressAugmentationDot());
	  }

	  if (suitableKeyCodes.includes(e.keyCode)) {

		let filteredNote;

		if (note[1] !== '#') {

			//really high pitches (C7 - TBD)
			if (parseInt(note[1], 10) === 7) {
			  filteredNote = `${note[0].toLowerCase()}''`;
			}
			//high pitches (C6 - B6)
			else if (parseInt(note[1], 10) === 6) {
			  filteredNote = `${note[0].toLowerCase()}'`;
			}
			//mid-high pitches (C5 - B5)
			else if (parseInt(note[1], 10) === 5) {
			  filteredNote = note[0].toLowerCase();
			}
			//lower pitches (C3 - B3)
			else if (parseInt(note[1], 10) === 3) {
			  //commas are used to designate lower octave
			  let lowNote = `${note[0]},`;
			  filteredNote = `${lowNote}`;
			}
			//low pitches (C2 – B2)
			else if (parseInt(note[1], 10) === 2) {
			  //commas are used to designate lower octave
			  let lowNote = `${note[0]},,`;
			  filteredNote = lowNote;
			}
			//very low pitches (C1 – B1)
			else if (parseInt(note[1], 10) === 1) {
			  //commas are used to designate lower octave
			  let lowNote = `${note[0]},,,`;
			  filteredNote = lowNote;
			}
			//mid-range pitches (C4 - B4)
			else {
			  filteredNote = note[0];
			}

			let musicString = this.props.writtenNotes.toString();

			let currentMeasure = musicString.substr(musicString.lastIndexOf('|'), musicString.length);
			// console.log(musicString)
			// console.log(note[0]);

			if (currentMeasure.includes(`^${note[0]},,,`)
				|| currentMeasure.includes(`^${note[0]},,`)
				|| currentMeasure.includes(`^${note[0]},`)
				|| currentMeasure.includes(`^${note[0].toLowerCase()}''`)
				|| currentMeasure.includes(`^${note[0].toLowerCase()}'`)
				|| currentMeasure.includes(`^${note[0].toLowerCase()}`)
				|| currentMeasure.includes(`^${note[0]}`) 
				) {

				let stringSinceLastSharp = currentMeasure.substr(currentMeasure.lastIndexOf('^'), currentMeasure.length);
				// checks if natural was stated before in the measure
				if (stringSinceLastSharp.includes(`=${note[0]},,,`)
				|| stringSinceLastSharp.includes(`=${note[0]},,`)
				|| stringSinceLastSharp.includes(`=${note[0]},`)
				|| stringSinceLastSharp.includes(`=${note[0].toLowerCase()}''`)
				|| stringSinceLastSharp.includes(`=${note[0].toLowerCase()}'`)
				|| stringSinceLastSharp.includes(`=${note[0].toLowerCase()}`)
				|| stringSinceLastSharp.includes(`=${note[0]}`) 
				) {
				}
				else {
					filteredNote = `=${filteredNote}`;
				}
			}
		}

		else if (note[1] === '#') {

			let regexOfHash = /#/;
			let noHashNote = note.replace(regexOfHash, '');

			//very high pitches (C7 - TBD)
			if (parseInt(noHashNote[1], 10) === 7) {
			  filteredNote = `^${noHashNote[0].toLowerCase()}''`;
			}
			//high pitches (C6 - B6)
			else if (parseInt(noHashNote[1], 10) === 6) {
			  filteredNote = `^${noHashNote[0].toLowerCase()}'`;
			}
			//mid-high pitches (C5 to B5)
			else if (parseInt(noHashNote[1], 10) === 5) {
			  filteredNote = `^${noHashNote[0].toLowerCase()}`;
			}
			//lower pitches (C3 - B3)
			else if (parseInt(noHashNote[1], 10) === 3) {
			  //commas are used to designate lower octave
			  let lowNote = `${noHashNote[0]},`;
			  filteredNote = `^${lowNote}`;
			  // console.log(filteredNote)
			}
			//low pitches (C2 – B2)
			else if (parseInt(noHashNote[1], 10) === 2) {
			  //commas are used to designate lower octave
			  let lowNote = `${noHashNote[0]},,`;
			  filteredNote = `^${lowNote}`;
			  // console.log(filteredNote)
			}
			//very low pitches (C1 – B1)
			else if (parseInt(noHashNote[1], 10) === 1) {
			  //commas are used to designate lower octave
			  let lowNote = `${noHashNote[0]},,,`;
			  filteredNote = `^${lowNote}`;
			  // console.log(filteredNote)
			}
			//mid-range pitches (C4 - B4)
			else {
			  filteredNote = `^${noHashNote[0]}`;
			} 
		}

	    //dotted notes
	    if (this.props.augmentationDotPressed === true && e.keyCode !== 190) {

	      // //dotted whole 
	      // if (e.keyCode === 87) {
	      // 	this.assignABCNotation(`${note[0]}5`);
	      // 	console.log('I say!')
	      // }
	      //dotted half
	      if (e.keyCode === 72) {
	      	this.writeABCNotation(`${filteredNote}3`);
	      }
	      //dotted quarter
	      else if (e.keyCode === 81) {
	      	this.writeABCNotation(`${filteredNote}3/`);
	      }
	      //dotted eighth
	      else if (e.keyCode === 69) {
	      	this.writeABCNotation(`${filteredNote}3//`);
	      }
	    }

	    //non-dotted notes
	    //whole note 
	    else if (e.keyCode === 87) {
	    	this.writeABCNotation(`${filteredNote}4`);
	    }

	    //half note
	    else if (e.keyCode === 72) {
	    	this.writeABCNotation(`${filteredNote}2`);
	    }

	    //quarter note
	    else if (e.keyCode === 81) {
	    	this.writeABCNotation(`${filteredNote}`);
	    }

	    //eighth note
	    else if (e.keyCode === 69) {
	    	this.writeABCNotation(`${filteredNote}/2`);
	    }

	    //sixteenth note
	    else if (e.keyCode === 83) {
	    	this.writeABCNotation(`${filteredNote}/4`);
	    }
	  } 
	}
	
	writeABCNotation = (noteToBeWritten) => {

	  let notesToDisplay;
  
	  if (noteToBeWritten === undefined) {
	    return;
	  }

	  //if deleted note
	  else if (noteToBeWritten === '') {
	    notesToDisplay = this.props.writtenNotes.join('');
	  }

	  //if whole note 
	  else if (noteToBeWritten.includes('4') && !noteToBeWritten.includes('/')) {
			if (this.props.timeSignature === '4/4') {
				if (this.props.sixteenthNoteCount !== 0 && this.props.sixteenthNoteCount !== 16) {
					return;
				}
				else if (this.props.sixteenthNoteCount === 16) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
				}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
				this.props.dispatch(addNote(noteToBeWritten));
				notesToDisplay = this.props.writtenNotes.join('');
				this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount + 16));
			}
			else if (this.props.timeSignature === '2/4' || this.props.timeSignature === '3/4' || this.props.timeSignature.includes('/8')) {
				return;
			}
	  }

	  //if dotted half
	  else if (noteToBeWritten.includes('3') && !noteToBeWritten.includes('/')) {
			if (this.props.timeSignature === '4/4') {
				if (this.props.sixteenthNoteCount > 4 && this.props.sixteenthNoteCount < 16) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 16) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '3/4' || this.props.timeSignature === '6/8') {
				if (this.props.sixteenthNoteCount !== 0 && this.props.sixteenthNoteCount !== 12) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 12) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '2/4') {
				return;
			}
			this.props.dispatch(addNote(noteToBeWritten));
			notesToDisplay = this.props.writtenNotes.join('');
			this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount + 12));
	  }

	  //if half note
	  else if (noteToBeWritten.includes('2') && !noteToBeWritten.includes('/')) {

			if (this.props.timeSignature === '4/4') {
				if (this.props.sixteenthNoteCount > 8 && this.props.sixteenthNoteCount < 16) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 16) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '3/4' || this.props.timeSignature === '6/8') {
				if (this.props.sixteenthNoteCount > 4 && this.props.sixteenthNoteCount < 12) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 12) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '2/4') {
				if (this.props.sixteenthNoteCount > 0 && this.props.sixteenthNoteCount < 8) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 8) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			// if not at the end of a measure or if there's enough room in the measure
	    this.props.dispatch(addNote(noteToBeWritten));
	    notesToDisplay = this.props.writtenNotes.join('');
			this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount + 8));
	  }

	  //if dotted quarter
	  else if (noteToBeWritten.includes('3/') && !noteToBeWritten.includes('//')) {
			if (this.props.timeSignature === '4/4') {
				if (this.props.sixteenthNoteCount > 10 && this.props.sixteenthNoteCount < 16) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 16) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '3/4' || this.props.timeSignature === '6/8') {
				if (this.props.sixteenthNoteCount > 6 && this.props.sixteenthNoteCount < 12) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 12) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '2/4') {
				if (this.props.sixteenthNoteCount > 2 && this.props.sixteenthNoteCount < 8) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 8) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
	    this.props.dispatch(addNote(noteToBeWritten));
	    notesToDisplay = this.props.writtenNotes.join('');
	    this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount + 6));
	  }

	  //if dotted eigth
	  else if (noteToBeWritten.includes('3//')) {
			if (this.props.timeSignature === '4/4') {
				if (this.props.sixteenthNoteCount > 13 && this.props.sixteenthNoteCount < 16) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 16) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}	      
				this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '3/4' || this.props.timeSignature === '6/8') {
				if (this.props.sixteenthNoteCount > 9 && this.props.sixteenthNoteCount < 12) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 12) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}	      
				this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '2/4') {
				if (this.props.sixteenthNoteCount > 5 && this.props.sixteenthNoteCount < 8) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 8) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
	    this.props.dispatch(addNote(noteToBeWritten));
	    notesToDisplay = this.props.writtenNotes.join('');
	    this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount + 3));
	  }

	  //if eighth note
	  else if (noteToBeWritten.includes('/2')) {
			if (this.props.timeSignature === '4/4') {
				if (this.props.sixteenthNoteCount > 14 && this.props.sixteenthNoteCount < 16) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 16) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '3/4' || this.props.timeSignature === '6/8') {
				if (this.props.sixteenthNoteCount > 10 && this.props.sixteenthNoteCount < 12) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 12) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '2/4') {
				if (this.props.sixteenthNoteCount > 6 && this.props.sixteenthNoteCount < 8) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 8) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
	    this.props.dispatch(addNote(noteToBeWritten));
	    notesToDisplay = this.props.writtenNotes.join('');
	    this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount + 2));
	  }

	  //if sixteenth note
	  else if (noteToBeWritten.includes('/4')) {
			if (this.props.timeSignature === '4/4') {
				if (this.props.sixteenthNoteCount > 15 && this.props.sixteenthNoteCount < 16) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 16) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '3/4' || this.props.timeSignature === '6/8') {
				if (this.props.sixteenthNoteCount > 11 && this.props.sixteenthNoteCount < 12) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 12) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '2/4') {
				if (this.props.sixteenthNoteCount > 7 && this.props.sixteenthNoteCount < 8) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 8) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
	    this.props.dispatch(addNote(noteToBeWritten));
	    notesToDisplay = this.props.writtenNotes.join('');
	    this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount + 1));
	  }

	  //if quarter note
	  else {
			if (this.props.timeSignature === '4/4') {
				if (this.props.sixteenthNoteCount > 12 && this.props.sixteenthNoteCount < 16) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 16) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '3/4' || this.props.timeSignature === '6/8') {
				if (this.props.sixteenthNoteCount > 8 && this.props.sixteenthNoteCount < 12) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 12) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
			else if (this.props.timeSignature === '2/4') {
				if (this.props.sixteenthNoteCount > 4 && this.props.sixteenthNoteCount < 8) { 
					return;
				}
				else if (this.props.sixteenthNoteCount === 8) {
					if (this.props.writtenNotes[this.props.writtenNotes.length - 1] !== '|') {
						this.props.writtenNotes.push('|');
					}
					this.props.dispatch(changeSixteenthNoteCount(0));
				}
			}
	    this.props.dispatch(addNote(noteToBeWritten));
	    notesToDisplay = this.props.writtenNotes.join('');
	    this.props.dispatch(changeSixteenthNoteCount(this.props.sixteenthNoteCount + 4));
	  }
    
	  let music = 
	  "T: Composition\n" +
	  `M: ${this.props.timeSignature}\n` +
	  `L: ${this.props.baseNoteValue}\n` +
	  `K: ${this.props.key} clef=${this.props.clef}\n` +
	  `${notesToDisplay}`;
	 
	 this.props.dispatch(changeSheetMusic(music));

	}

	releaseKey = (e) => {
		if (this.props.augmentationDotPressed === true) {
			this.props.dispatch(releaseAugmentationDot());
		}
	}

	render() {
		return (
			<div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	pitch: state.singer.pitch,
	sheetMusic: state.singer.sheetMusic,
	keyCode: state.singer.keyCode,
	augmentationDotPressed: state.singer.augmentationDotPressed,
	writtenNotes: state.singer.writtenNotes,
	sixteenthNoteCount: state.singer.sixteenthNoteCount,
	clef: state.singer.clef,
	timeSignature: state.singer.timeSignature,
	baseNoteValue: state.singer.baseNoteValue,
	key: state.singer.key
});

export default connect(mapStateToProps)(HandleNotes);


