/*
  # Add sample courses and lessons

  1. New Data
    - Add 3 sample courses with different topics
    - Add multiple lessons for each course
    - Set up proper ordering and content

  2. Course Details
    - Web Development Fundamentals
    - Data Science Basics
    - Digital Marketing Essentials

  3. Content Structure
    - Each course has 4-5 lessons
    - Lessons include video URLs and content
*/

-- Insert sample courses
INSERT INTO courses (id, title, description, thumbnail_url) VALUES
  (
    'c001', 
    'Web Development Fundamentals',
    'Learn the basics of web development, including HTML, CSS, and JavaScript.',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
  ),
  (
    'c002',
    'Data Science Basics',
    'Introduction to data science concepts, Python programming, and data analysis.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
  ),
  (
    'c003',
    'Digital Marketing Essentials',
    'Master the fundamentals of digital marketing, SEO, and social media strategy.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
  );

-- Insert lessons for Web Development course
INSERT INTO lessons (id, course_id, title, content, video_url, order_index) VALUES
  (
    'l001',
    'c001',
    'HTML Basics',
    'Learn the fundamental building blocks of web pages with HTML5.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    0
  ),
  (
    'l002',
    'c001',
    'CSS Styling',
    'Master CSS styling techniques to make your websites beautiful.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    1
  ),
  (
    'l003',
    'c001',
    'JavaScript Fundamentals',
    'Introduction to JavaScript programming and DOM manipulation.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    2
  ),
  (
    'l004',
    'c001',
    'Responsive Design',
    'Create websites that work perfectly on all devices.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    3
  );

-- Insert lessons for Data Science course
INSERT INTO lessons (id, course_id, title, content, video_url, order_index) VALUES
  (
    'l005',
    'c002',
    'Introduction to Python',
    'Get started with Python programming for data science.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    0
  ),
  (
    'l006',
    'c002',
    'Data Analysis with Pandas',
    'Learn to analyze data using Python Pandas library.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    1
  ),
  (
    'l007',
    'c002',
    'Data Visualization',
    'Create compelling visualizations with Python libraries.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    2
  ),
  (
    'l008',
    'c002',
    'Basic Statistics',
    'Understanding statistical concepts for data analysis.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    3
  );

-- Insert lessons for Digital Marketing course
INSERT INTO lessons (id, course_id, title, content, video_url, order_index) VALUES
  (
    'l009',
    'c003',
    'SEO Fundamentals',
    'Learn the basics of Search Engine Optimization.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    0
  ),
  (
    'l010',
    'c003',
    'Social Media Marketing',
    'Master social media marketing strategies.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    1
  ),
  (
    'l011',
    'c003',
    'Content Marketing',
    'Create effective content marketing strategies.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    2
  ),
  (
    'l012',
    'c003',
    'Email Marketing',
    'Learn email marketing best practices and automation.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    3
  ),
  (
    'l013',
    'c003',
    'Analytics and Reporting',
    'Measure and analyze marketing performance.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    4
  );