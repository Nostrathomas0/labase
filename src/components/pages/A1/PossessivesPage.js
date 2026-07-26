// src/components/pages/PossessivesPage.js
import React from 'react';
import MainLayout from '../../layout/MainLayout';
import PossessivesData from '../../../data/grammar/A1/5Possessives.json';
import PageTurner from '../../common/PageTurner';
import { useLessonPage } from '../../../hooks/useLessonPage';

const PossessivesPage = () => {
  const { currentPage, handlePageChange } = useLessonPage();

  return (
    <MainLayout
      lessonData={PossessivesData}
      currentPage={currentPage}
      layoutType="lesson"
    >
      <PageTurner
        totalPages={PossessivesData.pages.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </MainLayout>
  );
};

export default PossessivesPage;