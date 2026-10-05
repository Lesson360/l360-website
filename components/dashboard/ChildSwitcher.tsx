'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, Plus, User } from 'lucide-react';
import { useChildProfile } from '@/lib/context/ChildProfileContext';
import { AddChildModal } from './AddChildModal';
import { schoolStructureApi } from '@/lib/api/school-structure';

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
    React.useEffect(() => {
        function listener(event: MouseEvent) {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler();
        }
        document.addEventListener('mousedown', listener);
        return () => document.removeEventListener('mousedown', listener);
    }, [ref, handler]);
}

export function ChildSwitcher() {
    const { children, activeChild, selectChild, isLoading } = useChildProfile();
    const [isOpen, setIsOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [classNames, setClassNames] = useState<Record<string, string>>({});
    const classMapCache = useRef<Record<string, string>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(containerRef, () => setIsOpen(false));

    useEffect(() => {
        const fetchClasses = async () => {
            const newNames: Record<string, string> = { ...classNames };
            let hasChanges = false;

            for (const child of children) {
                const classId = child.currentClassId;
                const levelId = child.currentLevelId;

                if (!classId || !levelId || newNames[classId] || classMapCache.current[classId]) {
                    if (classId && classMapCache.current[classId] && !newNames[classId]) {
                        newNames[classId] = classMapCache.current[classId];
                        hasChanges = true;
                    }
                    continue;
                }

                try {
                    const res = await schoolStructureApi.getClassesByLevel(levelId);
                    const raw = res.data;
                    const items: any[] = Array.isArray(raw) ? raw : (raw as any)?.items || [];
                    for (const cls of items) {
                        const id = cls.id || cls._id || '';
                        if (id) {
                            classMapCache.current[id] = cls.name;
                            newNames[id] = cls.name;
                            hasChanges = true;
                        }
                    }
                } catch {
                    // silently fail and try again later if needed
                }
            }

            if (hasChanges) {
                setClassNames(newNames);
            }
        };

        if (children.length > 0) {
            fetchClasses();
        }
    }, [children, classNames]);

    const activeName = activeChild?.name || activeChild?.childName || (isLoading ? 'Loading...' : 'Add a Child');
    const activeId = activeChild?.id || activeChild?._id;
    const activeClassNameStr = activeChild?.currentClassId ? classNames[activeChild.currentClassId] : null;

    console.log(activeChild)

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-800 cursor-pointer hover:text-brand-orange transition-colors text-left"
            >
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                    <span className="truncate max-w-[90px] sm:max-w-xs">{activeName}</span>
                    {activeClassNameStr && (
                        <span className="text-[10px] text-gray-500 font-medium truncate capitalize">
                            {activeClassNameStr}
                        </span>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40">
                    <p className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        Switch Child
                    </p>

                    {children.length === 0 && !isLoading && (
                        <p className="px-4 py-2 text-xs text-gray-500">No child profiles yet.</p>
                    )}

                    {children.map((child) => {
                        const id = child.id || child._id;
                        const isActive = id === activeId;
                        const childClassNameStr = child.currentClassId ? classNames[child.currentClassId] : null;

                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => {
                                    selectChild(child);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${isActive ? 'bg-orange-50 text-brand-orange' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex flex-col items-start leading-tight truncate">
                                    <span className="truncate">{child.name || child.childName}</span>
                                    {childClassNameStr && (
                                        <span className={`text-[10px] font-medium truncate capitalize ${isActive ? 'text-brand-orange/80' : 'text-gray-500'}`}>
                                            {childClassNameStr}
                                        </span>
                                    )}
                                </div>
                                {isActive && <span className="text-[10px] font-black uppercase shrink-0">Active</span>}
                            </button>
                        );
                    })}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                setIsAddModalOpen(true);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#FF4801] flex items-center gap-2 cursor-pointer hover:bg-orange-50"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Child</span>
                        </button>
                    </div>
                </div>
            )}

            {isAddModalOpen && <AddChildModal onClose={() => setIsAddModalOpen(false)} />}
        </div>
    );
}
