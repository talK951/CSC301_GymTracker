export interface ApiResponse<T> {
    status: string;
    data: T;
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

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    profilePicture?: string;
    utorID: string;
    workouts?: Workout[];
}

export interface Post {
    id: number;
    content: string;
    sender: string;
    timestamp: string;
}

export type CreateExerciseDTO = Omit<Exercise, "id" | "createdAt">;

export type WorkoutDTO = {
    startTime: string;
    endTime: string;
    exercises: CreateExerciseDTO[];
};

export interface Group {
    id: number;
    name: string;
    users: UserSummary[];
    posts?: string[];
}
  
export interface GroupSummary {
    id: number;
    name: string;
}