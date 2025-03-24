import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Play, Users } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  _count?: {
    enrollments: number;
  };
}

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  async function fetchCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          enrollments (
            count
          )
        `);
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEnrollments() {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id');
    setEnrolledCourses(enrollments?.map(e => e.course_id) || []);
  }

  async function handleEnroll(courseId: string) {
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([{ course_id: courseId }]);
      if (error) throw error;
      setEnrolledCourses([...enrolledCourses, courseId]);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <img
            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
            alt={course.title}
            className="h-48 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{course.description}</p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>{course._count?.enrollments || 0} enrolled</span>
            </div>
            {enrolledCourses.includes(course.id) ? (
              <Link
                to={`/course/${course.id}`}
                className="mt-4 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Play className="h-4 w-4 mr-1" />
                Continue Learning
              </Link>
            ) : (
              <button
                onClick={() => handleEnroll(course.id)}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}