'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X, AlertCircle, Check } from 'lucide-react';
import { schoolStructureApi, AcademicLevel, SchoolClass } from '@/lib/api/school-structure';
import { useChildProfile } from '@/lib/context/ChildProfileContext';

interface AddChildModalProps {
    onClose: () => void;
}

export function AddChildModal({ onClose }: AddChildModalProps) {
    const router = useRouter();
    const { addChild } = useChildProfile();

    const [name, setName] = useState('');
    const [levels, setLevels] = useState<AcademicLevel[]>([]);
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [selectedLevelId, setSelectedLevelId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [isLoadingLevels, setIsLoadingLevels] = useState(true);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        schoolStructureApi.getLevels()
            .then((res) => {
                const raw = res.data;
                const items: AcademicLevel[] = Array.isArray(raw) ? raw : (raw as any)?.items || [];
                items.sort((a, b) => (a.order || 0) - (b.order || 0));
                setLevels(items);
            })
            .catch(() => setLevels([]))
            .finally(() => setIsLoadingLevels(false));
    }, []);

    useEffect(() => {
        if (!selectedLevelId) {
            setClasses([]);
            setSelectedClassId('');
            return;
        }

        const currentLevel = levels.find((l) => (l.id || l._id) === selectedLevelId);
        if (currentLevel?.classes && currentLevel.classes.length > 0) {
            setClasses([...currentLevel.classes].sort((a, b) => (a.order || 0) - (b.order || 0)));
            setSelectedClassId('');
            return;
        }

        setIsLoadingClasses(true);
        setSelectedClassId('');
        schoolStructureApi.getClassesByLevel(selectedLevelId)
            .then((res) => {
                const raw = res.data;
                const items: SchoolClass[] = Array.isArray(raw) ? raw : (raw as any)?.items || [];
                items.sort((a, b) => (a.order || 0) - (b.order || 0));
                setClasses(items);
            })
            .catch(() => setClasses([]))
            .finally(() => setIsLoadingClasses(false));
    }, [selectedLevelId, levels]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!name.trim()) {
            setErrorMessage("Please enter the child's name.");
            return;
        }
        if (!selectedLevelId) {
            setErrorMessage('Please select an academic level.');
            return;
        }
        if (classes.length > 0 && !selectedClassId) {
            setErrorMessage('Please select a class.');
            return;
        }

        setIsSubmitting(true);
        try {
            await addChild({
                name: name.trim(),
                currentLevelId: selectedLevelId,
                levelId: selectedLevelId,
                currentClassId: selectedClassId || undefined,
                classId: selectedClassId || undefined,
            });

            onClose();
            // New profiles always start at subscription selection per the multi-child profile flow.
            router.push('/onboarding/plans');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Could not create child profile. Please try again.';
            setErrorMessage(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Add a Child</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Create a new profile with its own subscription, courses and progress.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-800">
                            Child&apos;s Full Name <span className="text-[#FF4801]">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Chidinma"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#FF4801] focus:ring-2 focus:ring-[#FF4801]/20 text-sm font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-800">
                            Academic Level <span className="text-[#FF4801]">*</span>
                        </label>
                        {isLoadingLevels ? (
                            <div className="py-3 flex items-center gap-2 text-xs text-gray-500">
                                <Loader2 className="w-4 h-4 animate-spin" /> Loading levels...
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {levels.map((lvl) => {
                                    const lvlId = lvl.id || lvl._id || '';
                                    const isSelected = selectedLevelId === lvlId;
                                    return (
                                        <button
                                            key={lvlId}
                                            type="button"
                                            onClick={() => setSelectedLevelId(lvlId)}
                                            className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${isSelected
                                                ? 'border-[#FF4801] bg-orange-50 text-[#FF4801]'
                                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <span>{lvl.name}</span>
                                            {isSelected && <Check className="w-3.5 h-3.5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {selectedLevelId && (
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-800">
                                Class {classes.length > 0 && <span className="text-[#FF4801]">*</span>}
                            </label>
                            {isLoadingClasses ? (
                                <div className="py-3 flex items-center gap-2 text-xs text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading classes...
                                </div>
                            ) : classes.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                    {classes.map((cls) => {
                                        const clsId = cls.id || cls._id || '';
                                        const isSelected = selectedClassId === clsId;
                                        return (
                                            <button
                                                key={clsId}
                                                type="button"
                                                onClick={() => setSelectedClassId(clsId)}
                                                className={`px-2 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${isSelected
                                                    ? 'border-[#FF4801] bg-orange-50 text-[#FF4801]'
                                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                {cls.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-[11px] text-gray-500 italic">No sub-classes for this level — you can continue.</p>
                            )}
                        </div>
                    )}

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs cursor-pointer hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 rounded-xl bg-[#FF4801] hover:bg-orange-600 text-white font-black text-xs shadow-md cursor-pointer disabled:opacity-60 flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Create Profile</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
