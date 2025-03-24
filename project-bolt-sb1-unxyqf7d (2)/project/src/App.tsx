import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './components/Auth';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { CourseList } from './components/CourseList';
import { CourseView } from './components/CourseView';
import { LessonView } from './components/LessonView';
import { Certificates } from './components/Certificates';

function App() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CourseList />} />
          <Route path="course/:courseId" element={<CourseView />} />
          <Route path="course/:courseId/lesson/:lessonId" element={<LessonView />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;