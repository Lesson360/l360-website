import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-[#FF4801] tracking-tight">
                Settings
            </h1>
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-md text-center space-y-4 max-w-xl">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
                    <Settings className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Account & Security Settings</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Update password, parent notification preferences, sound effects, and display themes.
                </p>
            </div>
        </div>
    );
}
