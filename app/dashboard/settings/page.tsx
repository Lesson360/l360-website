'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    User,
    SquarePen,
    Save,
    X,
    Loader2,
    CheckCircle2,
    Lock,
    KeyRound,
    AlertCircle,
    Eye,
    EyeOff,
} from 'lucide-react';
import { authApi } from '@/lib/api/auth';

export default function SettingsPage() {
    // Form & Profile Data State
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Profile Details with initial defaults
    const [firstName, setFirstName] = useState('Samuel');
    const [surname, setSurname] = useState('Adams');
    const [phoneNumber, setPhoneNumber] = useState('+234811614592');
    const [email, setEmail] = useState('samueladams@gmail.com');

    // Security & Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Fetch User Details
    const loadProfileData = useCallback(async () => {
        setLoading(true);
        try {
            const userRes = await authApi.getProfile();
            const user = userRes?.data?.user || userRes?.data;

            if (user) {
                const uFirst = user.firstName || user.name?.split(' ')[0];
                const uLast = user.lastName || user.surname || (user.name?.split(' ').slice(1).join(' '));
                const uPhone = user.phoneNumber || user.mobileNumber || user.phone;
                const uEmail = user.email;

                if (uFirst) setFirstName(uFirst);
                if (uLast) setSurname(uLast);
                if (uPhone) setPhoneNumber(uPhone);
                if (uEmail) setEmail(uEmail);
            }
        } catch (err) {
            console.error('Failed to load profile settings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    // Handle Edit Click - ensure state has fallback values
    const handleStartEdit = () => {
        if (!firstName) setFirstName('Samuel');
        if (!surname) setSurname('Adams');
        if (!phoneNumber) setPhoneNumber('+234811614592');
        if (!email) setEmail('samueladams@gmail.com');
        setIsEditing(true);
    };

    // Save Personal Details Updates
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setToastMessage(null);

        try {
            // Update Auth Profile
            await authApi.updateProfile({
                firstName,
                lastName: surname,
                phoneNumber,
            });

            setToastMessage({ type: 'success', text: 'Personal details updated successfully.' });
            setIsEditing(false);
        } catch (err: any) {
            console.error('Error saving profile settings:', err);
            setToastMessage({
                type: 'error',
                text: err?.response?.data?.message || 'Failed to update personal details. Please try again.',
            });
        } finally {
            setSavingProfile(false);
        }
    };

    // Save Password Change
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);

        if (!currentPassword) {
            setPasswordError('Please enter your current password.');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        setChangingPassword(true);

        try {
            await authApi.updateProfile({
                currentPassword,
                newPassword,
            });

            setToastMessage({ type: 'success', text: 'Password updated successfully.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordError(err?.response?.data?.message || 'Failed to change password. Verify your current password.');
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="space-y-8 pb-16 max-w-5xl mx-auto">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-extrabold text-[#FF4801] tracking-tight">
                    Settings
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                    Manage your personal account details and password security.
                </p>
            </div>

            {/* Notification Toast Alert */}
            {toastMessage && (
                <div
                    className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold shadow-xs animate-in fade-in duration-200 ${toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}
                >
                    <div className="flex items-center gap-2.5">
                        {toastMessage.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        )}
                        <span>{toastMessage.text}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setToastMessage(null)}
                        className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* SECTION 1: PERSONAL DETAILS CARD */}
            <div className="bg-white rounded-3xl border border-gray-300/80 p-6 sm:p-10 shadow-xs relative space-y-8">
                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                        <p className="text-sm font-bold text-gray-500">Loading personal details...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-8">
                        {/* Card Header: (1) Personal Details Badge & Edit Button */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center shrink-0">
                                    1
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                                    Personal Details
                                </h2>
                            </div>

                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={handleStartEdit}
                                    className="px-5 py-2.5 rounded-full bg-[#1F1935] hover:bg-[#2B1741] text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2"
                                >
                                    <span>Edit Information</span>
                                    <SquarePen className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingProfile}
                                        className="px-5 py-2.5 rounded-full bg-[#FF4801] hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {savingProfile ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Fields 2-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {/* First Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    First Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3.5 rounded-xl bg-[#F4F4F6] text-sm font-semibold text-gray-900 border border-gray-100">
                                        {firstName || 'Samuel'}
                                    </div>
                                )}
                            </div>

                            {/* Surname */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Surname
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        required
                                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3.5 rounded-xl bg-[#F4F4F6] text-sm font-semibold text-gray-900 border border-gray-100">
                                        {surname || 'Adams'}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Mobile Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3.5 rounded-xl bg-[#F4F4F6] text-sm font-semibold text-gray-900 border border-gray-100">
                                        {phoneNumber || '+234811614592'}
                                    </div>
                                )}
                            </div>

                            {/* Email Address (Non-editable) */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Email Address
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            readOnly
                                            className="w-full px-4 py-3.5 rounded-xl bg-gray-200/60 border border-gray-200 text-sm font-semibold text-gray-500 cursor-not-allowed select-none pr-10"
                                        />
                                        <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                ) : (
                                    <div className="w-full px-4 py-3.5 rounded-xl bg-[#F4F4F6] text-sm font-semibold text-gray-900 border border-gray-100">
                                        {email || 'samueladams@gmail.com'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* SECTION 2: PASSWORD & SECURITY CARD */}
            <div className="bg-white rounded-3xl border border-gray-300/80 p-6 sm:p-10 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                    <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center shrink-0">
                        2
                    </span>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">
                            Security & Password
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">
                            Update your account password to ensure secure access to your profile.
                        </p>
                    </div>
                </div>

                {passwordError && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs font-bold">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        <span>{passwordError}</span>
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password & Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={changingPassword}
                        className="px-6 py-3 rounded-2xl bg-[#1F1935] hover:bg-[#2B1741] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {changingPassword ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Updating Password...</span>
                            </>
                        ) : (
                            <>
                                <KeyRound className="w-4 h-4" />
                                <span>Update Password</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
