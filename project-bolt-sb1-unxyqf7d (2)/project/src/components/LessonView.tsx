import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ReactPlayer from 'react-player';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  order_index: number;
  course_id: string;
  progress_tracks: {
    id: string;
    completed: boolean;
  }[];
}

export function LessonView() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId && lessonId) {
      fetchLessonData();
    }
  }, [courseId, lessonId]);

  async function fetchLessonData() {
    try {
      const { data: currentLesson, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          *,
          progress_tracks (id, completed)
        `)
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      setLesson(currentLesson);

      // Fetch adjacent lessons
      const { data: adjacentLessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (adjacentLessons) {
        const currentIndex = adjacentLessons.findIndex(l => l.id === lessonId);
        setPrevLesson(adjacentLessons[currentIndex - 1] || null);
        setNextLesson(adjacentLessons[currentIndex + 1] || null);
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsCompleted() {
    if (!lesson) return;

    const progressTrack = lesson.progress_tracks[0];
    
    try {
      if (progressTrack) {
        await supabase
          .from('progress_tracks')
          .update({ completed: true })
          .eq('id', progressTrack.id);
      } else {
        await supabase
          .from('progress_tracks')
          .insert([{
            lesson_id: lesson.id,
            completed: true
          }]);
      }

      // Refresh lesson data
      fetchLessonData();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
        
        {lesson.video_url && (
          <div className="mt-6 aspect-video">
            <ReactPlayer
              url={lesson.video_url}
              width="100%"
              height="100%"
              controls
            />
          </div>
        )}

        <div className="mt-6 prose max-w-none">
          {lesson.content}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex space-x-4">
            {prevLesson && (
              <button
                onClick={() => navigate(`/course/${courseId}/lesson/${prevLesson.id}`)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Lesson
              </button>
            )}
            {nextLesson && (
              <button
                onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Next Lesson
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>

          <button
            onClick={markAsCompleted}
            disabled={lesson.progress_tracks?.[0]?.completed}
            className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              lesson.progress_tracks?.[0]?.completed
                ? 'bg-green-600 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {lesson.progress_tracks?.[0]?.completed ? 'Completed' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}