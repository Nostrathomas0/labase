import React from 'react';
import MainLayout from '../../layout/MainLayout';
import PossessivesData from '../../../data/grammar/A1/5Possessives.json';
import PageTurner from '../../common/PageTurner';
import { useLessonPage } from '../../../hooks/useLessonPage';

const PossessivesPage = ({ progressManager }) => {
  const {
    currentPage,
    nextPage,
    previousPage,
    handleQuestionComplete,
    handleLessonComplete,
    totalPages
  } = useLessonPage(
    PossessivesData,
    progressManager,
    'A1',
    'possessives',
    '/A1/verbs'
  );

  return (
    <MainLayout
      lessonData={PossessivesData}
      currentPage={currentPage}
      layoutType="grammar"
      progressManager={progressManager}
      onQuestionComplete={handleQuestionComplete}
      onLessonComplete={handleLessonComplete}
    >
      <PageTurner
        totalPages={totalPages}
        currentPage={currentPage}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </MainLayout>
  );
};

export default PossessivesPage;