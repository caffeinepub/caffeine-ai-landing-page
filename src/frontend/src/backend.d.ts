import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SubjectStats {
    totalSeconds: bigint;
    subjectId: bigint;
}
export interface DailyStats {
    totalSeconds: bigint;
    dayIndex: bigint;
}
export interface Assignment {
    id: bigint;
    title: string;
    createdAt: bigint;
    completed: boolean;
    dueDate: bigint;
    description: string;
    subjectId: bigint;
}
export interface StudySession {
    id: bigint;
    date: bigint;
    createdAt: bigint;
    durationSeconds: bigint;
    subjectId: bigint;
}
export interface Subject {
    id: bigint;
    name: string;
    createdAt: bigint;
    colorHex: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAssignment(subjectId: bigint, title: string, description: string, dueDate: bigint): Promise<Assignment>;
    addSubject(name: string, colorHex: string): Promise<Subject>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAssignment(id: bigint): Promise<boolean>;
    deleteSubject(id: bigint): Promise<boolean>;
    getAssignments(): Promise<Array<Assignment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSessionsByDateRange(startDate: bigint, endDate: bigint): Promise<Array<StudySession>>;
    getStudySessions(): Promise<Array<StudySession>>;
    getSubjectStats(): Promise<Array<SubjectStats>>;
    getSubjects(): Promise<Array<Subject>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeeklyStats(weekStartDate: bigint): Promise<Array<DailyStats>>;
    isCallerAdmin(): Promise<boolean>;
    logStudySession(subjectId: bigint, durationSeconds: bigint, date: bigint): Promise<StudySession>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleAssignment(id: bigint): Promise<Assignment | null>;
    updateAssignment(id: bigint, title: string, description: string, dueDate: bigint): Promise<Assignment | null>;
    updateSubject(id: bigint, name: string, colorHex: string): Promise<Subject | null>;
}
