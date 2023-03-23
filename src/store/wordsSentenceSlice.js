import { createSlice } from '@reduxjs/toolkit';

const initialScoreState = {
  generatedText: [],
  correctWords: [],
  incorrectWords: [],
  totalWords: [],
  sentenceArr: [],
  inputValue: [],
  wordIndex: 0,
}

const wordsSentence = createSlice({
  name: 'wordsSentence',
  initialState: initialScoreState,
  reducers: {

    resetValues(state) {
      state.generatedText = [];
      state.sentenceArr = [];
      state.correctWords = [];
      state.incorrectWords = [];
      state.totalWords = [];
      state.inputValue = [];
      state.wordIndex = 0;
    },

    clearSpanArr(state) {
      state.inputValue = [];
    },

    filterWords(state) {
      state.sentenceArr = state.sentenceArr.filter(word => word.length >= 4);
    },

    getGeneratedText(state, action) {
      const data = action.payload;

      state.generatedText = [state.generatedText, data[0].content] || [];

      //create one single array for text
      state.generatedText = [state.generatedText.reduce((accu, curr) => {
        return accu + ' ' + curr
      }, '').trim()];

      //fill the words arr once the we get the data from the server so we don't do it on every re render/evaluate.
      state.sentenceArr = state.generatedText[0].split(' ');
    },

    //it will check letter on every key stroke
    getTypedLetters(state, action) {
      const currLetterArr = action.payload.split('');
      state.inputValue = [];
      state.inputValue = [...currLetterArr];
    },

    //before increasing word index check if typed word is correct or not then push into the array respectively and also push into totalWords array
    increaseWordIndex(state, action) {
      const currWord = action.payload;

      if (state.sentenceArr[state.wordIndex] === currWord) {
        state.totalWords.push(currWord);
        state.correctWords.push(currWord);
      }
      else {
        state.totalWords.push(currWord);
        state.incorrectWords.push(currWord);
      }

      //increase the wordIndex whether typed word is correct or wrong and clear the input letters
      state.wordIndex++;
      state.inputValue = []
    },
  }
});

export const getText = function(action = 'sentence') {
  return async (dispatch) => {
    try {

      const res = await fetch('https://api.quotable.io/quotes/random?minLength=100');
      const data = await res.json();
      dispatch(wordsSentence.actions.getGeneratedText(data));

      if (action === 'words') {
        dispatch(wordsSentence.actions.filterWords())
      }

    } catch (err) {
      console.log(err);
    }
  }
}

export const wordsSentenceActions = wordsSentence.actions;
export default wordsSentence.reducer;