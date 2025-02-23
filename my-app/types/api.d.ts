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
  