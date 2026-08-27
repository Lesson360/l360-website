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
    name: string;
    setupStatus?: string;
    nextScreen?: string;
    currentLevelId?: string;
    currentClassId?: string;
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
        apiClient.post<{ message: string; data: { childProfile: ChildProfile } }>(
            '/child-profiles',
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
