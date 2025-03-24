import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Award, Download } from 'lucide-react';

interface CompletedCourse {
  course: {
    id: string;
    title: string;
    lessons: {
      id: string;
    }[];
  };
  completed_lessons: number;
}

export function Certificates() {
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  async function fetchCompletedCourses() {
    try {
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          course:courses (
            id,
            title,
            lessons:lessons (id)
          )
        `);

      if (enrollmentsError) throw enrollmentsError;

      const coursesWithProgress = await Promise.all(
        (enrollments || []).map(async (enrollment) => {
          const { count } = await supabase
            .from('progress_tracks')
            .select('*', { count: 'exact' })
            .eq('completed', true)
            .in(
              'lesson_id',
              enrollment.course.lessons.map((l) => l.id)
            );

          return {
            course: enrollment.course,
            completed_lessons: count || 0,
          };
        })
      );

      setCompletedCourses(
        coursesWithProgress.filter(
          (course) =>
            course.completed_lessons === course.course.lessons.length &&
            course.completed_lessons > 0
        )
      );
    } catch (error) {
      console.error('Error fetching completed courses:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateCertificate(courseTitle: string) {
    // In a real application, this would generate a PDF certificate
    alert(`Certificate for ${courseTitle} would be generated here`);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (completedCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Complete a course to earn your first certificate!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Certificates</h2>
        <p className="mt-2 text-gray-600">
          Congratulations on completing these courses!
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {completedCourses.map((item) => (
            <li key={item.course.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.course.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Completed all {item.course.lessons.length} lessons
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => generateCertificate(item.course.title)}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Certificate
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}