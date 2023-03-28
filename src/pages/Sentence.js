import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { wordsSentenceActions, getText } from '../store/wordsSentenceSlice';
import { modalActions } from '../store/modalSlice';


import PopUpModal from '../components/UI/Modal/PopUpModal';
import SkeletonPage from '../components/Layout/pages/SkeletonPage';
import PageContent from '../components/Layout/pages/Page';

export default function Sentence() {
  const dispatch = useDispatch();
  const { sentenceArr, wordIndex, inputValue } = useSelector(state => state.wordsSentence);
  const { isOpen, title, message } = useSelector(state => state.modal);

  useEffect(() => {
    let interval;

    dispatch(getText());

    interval = setInterval(() => {
      dispatch(wordsSentenceActions.calculateWPM());
    }, 6000 * 10);

    window.addEventListener('offline', e => {
      dispatch(modalActions.setMessage({ title: 'Device is offline', message: "App won't work as expected, it is recommanded to use app with internet on.", isOpen: true }))
    });

    //clear function
    return () => {
      window.removeEventListener('offline', e => {
        dispatch(modalActions.setMessage({ title: 'Device is offline', message: "App won't work as expected, it is recommanded to use app with internet on.", isOpen: true }))
      });

      clearInterval(interval);
    }
  }, [dispatch]);

  const onKeyPressHandler = function(e) {

    if (e.code !== 'Space') return
    if (!e.target.value.trim().length) return

    e.preventDefault();
    dispatch(wordsSentenceActions.increaseWordIndex(e.target.value));
    dispatch(wordsSentenceActions.calculateAccuracy())
    e.target.value = ''
  }

  const inputHandler = function(e) {
    if ((sentenceArr.length - wordIndex) === 10) dispatch(getText());
    dispatch(wordsSentenceActions.getTypedLetters(e.target.value));
  }

  const checkTypedWord = function() {
    const currentWord = sentenceArr[wordIndex];
    //we are looping over the current word in the word array and checking if typed letter is same as current word letter and adding class respectively.
    return currentWord.split('').map((l, i) => {
      let className;

      if (inputValue.length === 0 || inputValue[i] === undefined) className = '';
      else className = `${inputValue[i] === l ? 'correct-word' : 'wrong-word'}`

      return <span key={i} className={className}>{l}</span>
    })
  }

  const sentence = function(currWordRef) {
    return sentenceArr.map((word, index) => {
      if (index === wordIndex) {
        return (
          <span ref={currWordRef} key={Date.now()} className='current-word'>{checkTypedWord()}</span>
        )
      }
      return ` ${word} `
    })
  }


  return (
    <>
    {isOpen && <PopUpModal title={title} message={message} />}
      {sentenceArr.length === 0 && <SkeletonPage />}
      
      {sentenceArr.length !== 0 && <PageContent sentence={sentence} checkWord={checkTypedWord} inputHandler={inputHandler} changeWord={onKeyPressHandler} className={'sentence'} />}
      
    </>
  )
}