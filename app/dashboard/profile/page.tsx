import React from 'react';
import { User } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-[#FF4801] tracking-tight">
                Profile
            </h1>
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-md text-center space-y-4 max-w-xl">
                <div className="w-16 h-16 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center mx-auto">
                    <User className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Learner Profile Management</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    View and update child profile details, active learning level, and parent account contact settings.
                </p>
            </div>
        </div>
    );
}
