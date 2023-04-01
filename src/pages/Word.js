import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useWordSentence from '../hooks/use-wordSentence';

import { wordsSentenceActions, getText } from '../store/wordsSentenceSlice';
import { modalActions } from '../store/modalSlice';

import PopUpModal from '../components/UI/Modal/PopUpModal';
import SkeletonPage from '../components/Layout/pages/SkeletonPage'
import PageContent from '../components/Layout/pages/Page';

export default function Sentence() {
  const dispatch = useDispatch();
  const { sentenceArr, wordIndex, inputValue } = useSelector(state => state.wordsSentence);
  const { isOpen, title, message } = useSelector(state => state.modal);

  const wordSentence = useWordSentence(true);

  const onKeyPressHandler = function(e) {
    wordSentence.onKeyPressHandler(e);
  }

  const inputHandler = function(e) {
    wordSentence.inputHandler(e);
  }

  const checkTypedWord = function() {
    wordSentence.checkTypedWord();
  }

  const sentence = function(currWordRef) {
    return wordSentence.sentence(currWordRef)
  }

  return (
    <>
    {isOpen && <PopUpModal title={title} message={message} />}
    {sentenceArr.length === 0 && <SkeletonPage />}
    {sentenceArr.length !== 0 && <PageContent className={'word'} sentence={sentence} checkWord={checkTypedWord} inputHandler={inputHandler} changeWord={onKeyPressHandler} />}
    </>
  )
}