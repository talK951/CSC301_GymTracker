export interface ApiResponse<T> {
    status: string;
    data: T;
}

export interface User {
    id: number;
    name: string;
    email: string;
    profile_pic: string;
}

export interface JwtResponseType {
    token: string;
    tokenType: string;
    expiresIn: number;
}

export interface WorkoutsResponseData {
    workouts: Workout[];
}

export interface WorkoutResponseData {
    workout: Workout;
}

export interface Workout {
    id: number;
    startTime: string;
    endTime: string;
    createdAt: string;
    exercises: Exercise[];
}

export interface Exercise {
    id: number;
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
    createdAt: string;
}

export type CreateExerciseDTO = Omit<Exercise, "id" | "createdAt">;

export type WorkoutDTO = {
    startTime: string;
    endTime: string;
    exercises: CreateExerciseDTO[];
};