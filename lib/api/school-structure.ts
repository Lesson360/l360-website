import { apiClient } from './client';

export interface AgeRange {
    min: number;
    max: number;
}

export interface SchoolClass {
    id?: string;
    _id?: string;
    name: string;
    slug?: string;
    description?: string;
    levelId?: string;
    order?: number;
    status?: string;
}

export interface AcademicLevel {
    id?: string;
    _id?: string;
    name: string;
    slug?: string;
    description?: string;
    ageRange?: AgeRange;
    imageUrl?: string;
    imageAccessUrl?: string;
    imageKey?: string;
    order?: number;
    status?: string;
    classes?: SchoolClass[];
}

export interface CreateChildProfilePayload {
    name: string;
    currentLevelId?: string;
    currentClassId?: string;
    levelId?: string;
    classId?: string;
}

export interface ChildProfile {
    id?: string;
    _id?: string;
    name?: string;
    childName?: string;
    setupStatus?: string;
    nextScreen?: string;
    currentLevelId?: string;
    currentClassId?: string;
    levelName?: string;
    className?: string;
    currentClassName?: string;
}

export const schoolStructureApi = {
    // Fetch academic levels
    getLevels: () =>
        apiClient.get<{ message: string; data: AcademicLevel[] | { items: AcademicLevel[]; total: number } }>(
            '/school-structure'
        ),

    // Fetch classes for a given level
    getClassesByLevel: (levelId: string) =>
        apiClient.get<{ message: string; data: SchoolClass[] | { items: SchoolClass[] } }>(
            `/school-structure/levels/${levelId}/classes`
        ),

    // Create child profile
    createChildProfile: (data: CreateChildProfilePayload) =>
        apiClient.post<{ message: string; data: { id?: string; childProfile: ChildProfile } }>(
            '/child-profiles',
            data
        ),

    // Update child profile
    updateChildProfile: (childProfileId: string, data: Partial<CreateChildProfilePayload>) =>
        apiClient.patch<{ message: string; data: { childProfile: ChildProfile } }>(
            `/child-profiles/${childProfileId}`,
            data
        ),

    // Set active child profile
    setActiveChild: (childProfileId: string) =>
        apiClient.patch<{ message: string; data: any }>(
            '/auth/me/active-child',
            { childProfileId }
        ),

    // Fetch parent's child profiles
    getChildProfiles: () =>
        apiClient.get<{ message: string; data: ChildProfile[] | { items: ChildProfile[] } }>(
            '/child-profiles'
        ),
};

/**
 * Validates localStorage cached child profile against active backend child profiles.
 * Clears stale/invalid entries (like deleted MongoDB ObjectIDs) and syncs valid active profile to localStorage.
 */
export async function resolveAndSyncActiveChild(): Promise<ChildProfile | null> {
    try {
        const cpRes = await schoolStructureApi.getChildProfiles().catch(() => null);
        const rawData = cpRes?.data;
        const profiles: ChildProfile[] = Array.isArray(rawData)
            ? rawData
            : (rawData as any)?.items || [];

        if (profiles.length === 0) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('lesson360_active_child');
            }
            return null;
        }

        let cachedChildId = '';
        if (typeof window !== 'undefined') {
            const cachedStr = localStorage.getItem('lesson360_active_child');
            if (cachedStr) {
                try {
                    const cached = JSON.parse(cachedStr);
                    cachedChildId = cached.id || cached._id || cached.childProfileId || '';
                } catch { }
            }
        }

        // Validate cached child profile ID against server profiles
        const matched = cachedChildId ? profiles.find(p => p.id === cachedChildId || p._id === cachedChildId) : null;

        const activeChild = matched || profiles[0];

        if (typeof window !== 'undefined' && activeChild) {
            localStorage.setItem('lesson360_active_child', JSON.stringify(activeChild));
        }

        return activeChild;
    } catch {
        return null;
    }
}

