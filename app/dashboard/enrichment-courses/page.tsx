import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function EnrichmentCoursesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-[#FF4801] tracking-tight">
                Enrichment Courses
            </h1>
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-md text-center space-y-4 max-w-xl">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                    <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Enrichment & Skill Courses</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Explore special skill courses, coding for kids, creative arts, and extracurricular learning modules.
                </p>
            </div>
        </div>
    );
}
