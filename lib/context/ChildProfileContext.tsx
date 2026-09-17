'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    schoolStructureApi,
    ChildProfile,
    CreateChildProfilePayload,
} from '@/lib/api/school-structure';

const ACTIVE_CHILD_STORAGE_KEY = 'lesson360_active_child';

function getChildId(child: ChildProfile | null | undefined): string {
    return (child?.id || child?._id || '') as string;
}

function normalizeChild(raw: any): ChildProfile {
    return {
        ...raw,
        id: raw?.id || raw?._id,
        _id: raw?._id || raw?.id,
        name: raw?.name || raw?.childName,
    };
}

function persistActiveChild(child: ChildProfile | null) {
    if (typeof window === 'undefined') return;
    try {
        if (child) {
            localStorage.setItem(ACTIVE_CHILD_STORAGE_KEY, JSON.stringify(child));
        } else {
            localStorage.removeItem(ACTIVE_CHILD_STORAGE_KEY);
        }
    } catch {
        // ignore storage failures (private browsing, quota, etc.)
    }
}

interface ChildProfileContextValue {
    /** All of the parent's child profiles. */
    children: ChildProfile[];
    /** The single child profile every dashboard page should scope its data to. */
    activeChild: ChildProfile | null;
    isLoading: boolean;
    /** Re-fetch the parent's child profiles from the backend. */
    refreshChildren: () => Promise<ChildProfile[]>;
    /** Switch the globally active child. Persists the selection and clears nothing itself —
     *  pages are expected to react to `activeChild` changing and reload their own child-scoped data. */
    selectChild: (child: ChildProfile) => void;
    /** Create a new child profile, add it to the list, and make it the active child. */
    addChild: (payload: CreateChildProfilePayload) => Promise<ChildProfile>;
}

const ChildProfileContext = createContext<ChildProfileContextValue | undefined>(undefined);

export function ChildProfileProvider({ children }: { children: React.ReactNode }) {
    const [childList, setChildList] = useState<ChildProfile[]>([]);
    const [activeChild, setActiveChildState] = useState<ChildProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const selectChild = useCallback((child: ChildProfile) => {
        const normalized = normalizeChild(child);
        setActiveChildState(normalized);
        persistActiveChild(normalized);
        // Best-effort sync with backend "active child" concept used elsewhere in the app.
        // Not authoritative — child-specific endpoints are always called with an explicit childProfileId.
        const id = getChildId(normalized);
        if (id) {
            schoolStructureApi.setActiveChild(id).catch(() => null);
        }
    }, []);

    const refreshChildren = useCallback(async (): Promise<ChildProfile[]> => {
        setIsLoading(true);
        try {
            const res = await schoolStructureApi.getChildProfiles().catch(() => null);
            const rawData = res?.data;
            const rawList: any[] = Array.isArray(rawData)
                ? rawData
                : (rawData as any)?.items || [];
            const list = rawList.map(normalizeChild);
            setChildList(list);

            if (list.length === 0) {
                setActiveChildState(null);
                persistActiveChild(null);
                return list;
            }

            let cachedId = '';
            if (typeof window !== 'undefined') {
                try {
                    const cachedStr = localStorage.getItem(ACTIVE_CHILD_STORAGE_KEY);
                    if (cachedStr) {
                        const cached = JSON.parse(cachedStr);
                        cachedId = cached.id || cached._id || cached.childProfileId || '';
                    }
                } catch {
                    // ignore malformed cache
                }
            }

            const matched = cachedId ? list.find((c) => getChildId(c) === cachedId) : undefined;
            const resolved = matched || list[0];
            setActiveChildState(resolved);
            persistActiveChild(resolved);
            return list;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addChild = useCallback(async (payload: CreateChildProfilePayload): Promise<ChildProfile> => {
        const createRes = await schoolStructureApi.createChildProfile(payload);
        const created =
            (createRes.data as any)?.childProfile ||
            (createRes.data as any)?.data?.childProfile ||
            createRes.data;
        const normalized = normalizeChild(created);

        setChildList((prev) => {
            const id = getChildId(normalized);
            if (id && prev.some((c) => getChildId(c) === id)) return prev;
            return [...prev, normalized];
        });

        selectChild(normalized);
        return normalized;
    }, [selectChild]);

    useEffect(() => {
        refreshChildren();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo<ChildProfileContextValue>(() => ({
        children: childList,
        activeChild,
        isLoading,
        refreshChildren,
        selectChild,
        addChild,
    }), [childList, activeChild, isLoading, refreshChildren, selectChild, addChild]);

    return (
        <ChildProfileContext.Provider value={value}>
            {children}
        </ChildProfileContext.Provider>
    );
}

export function useChildProfile(): ChildProfileContextValue {
    const ctx = useContext(ChildProfileContext);
    if (!ctx) {
        throw new Error('useChildProfile must be used within a ChildProfileProvider');
    }
    return ctx;
}
