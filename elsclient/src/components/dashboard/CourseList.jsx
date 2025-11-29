import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const CourseList = ({ courses = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Mock data if courses array is empty
    const displayCourses = courses.length > 0 ? courses : [
        { id: 1, name: 'Advanced Mathematics', category: 'Science', level: 12, progress: 45 },
        { id: 2, name: 'Physics Mechanics', category: 'Science', level: 11, progress: 30 },
        { id: 3, name: 'Organic Chemistry', category: 'Science', level: 12, progress: 15 },
        { id: 4, name: 'World History', category: 'Arts', level: 10, progress: 80 },
        { id: 5, name: 'English Literature', category: 'Arts', level: 11, progress: 60 },
        { id: 6, name: 'Computer Science Basics', category: 'Technology', level: 9, progress: 90 },
        { id: 7, name: 'Data Structures', category: 'Technology', level: 12, progress: 20 },
        { id: 8, name: 'Economics 101', category: 'Commerce', level: 11, progress: 10 },
    ];

    // Extract unique categories
    const categories = ['All', ...new Set(displayCourses.map(c => c.category).filter(Boolean))];

    // Configure Fuse.js
    const fuse = useMemo(() => new Fuse(displayCourses, {
        keys: ['name', 'category', 'level'],
        threshold: 0.3,
    }), [displayCourses]);

    // Filter and search logic
    const filteredCourses = useMemo(() => {
        let result = displayCourses;

        // Apply category filter
        if (selectedCategory !== 'All') {
            result = result.filter(course => course.category === selectedCategory);
        }

        // Apply fuzzy search
        if (searchQuery.trim()) {
            const searchResults = fuse.search(searchQuery);
            result = searchResults.map(r => r.item).filter(item =>
                selectedCategory === 'All' || item.category === selectedCategory
            );
        }

        return result;
    }, [displayCourses, searchQuery, selectedCategory, fuse]);

    return (
        <Card glass className="dashboard-section full-width">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3>📚 Course Library</h3>

                <div style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
                    <div style={{ width: '250px' }}>
                        <Input
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ height: '40px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="category-filters" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map(course => (
                        <div key={course.id} className="course-card-item" style={{
                            background: 'var(--color-bg-primary)',
                            borderRadius: '1rem',
                            padding: '1.25rem',
                            border: '1px solid var(--color-border)',
                            transition: 'all 0.2s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span className="badge" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                                    {course.category || 'General'}
                                </span>
                                <span className="badge">Level {course.level || 'N/A'}</span>
                            </div>

                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                {course.name}
                            </h4>

                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>
                                    <span>Progress</span>
                                    <span>{course.progress || 0}%</span>
                                </div>
                                <div className="progress-bar" style={{ height: '6px' }}>
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${course.progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Button variant="ghost" size="sm" fullWidth style={{ marginTop: '1rem' }}>
                                Continue Learning →
                            </Button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                        <p>No courses found matching your criteria</p>
                        <Button variant="ghost" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CourseList;
