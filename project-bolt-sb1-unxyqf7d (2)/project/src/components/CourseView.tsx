import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Play, CheckCircle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  order_index: number;
  progress_tracks: {
    completed: boolean;
  }[];
}

interface Course {
  id: string;
  title: string;
  description: string;
}

export function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseAndLessons();
    }
  }, [courseId]);

  async function fetchCourseAndLessons() {
    try {
      const [courseResponse, lessonsResponse] = await Promise.all([
        supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single(),
        supabase
          .from('lessons')
          .select(`
            *,
            progress_tracks (completed)
          `)
          .eq('course_id', courseId)
          .order('order_index')
      ]);

      if (courseResponse.error) throw courseResponse.error;
      if (lessonsResponse.error) throw lessonsResponse.error;

      setCourse(courseResponse.data);
      setLessons(lessonsResponse.data || []);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <p className="mt-2 text-gray-600">{course.description}</p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {lessons.map((lesson) => {
            const isCompleted = lesson.progress_tracks?.[0]?.completed;
            return (
              <li key={lesson.id}>
                <Link
                  to={`/course/${courseId}/lesson/${lesson.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <Play className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        Lesson {lesson.order_index + 1}: {lesson.title}
                      </span>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}