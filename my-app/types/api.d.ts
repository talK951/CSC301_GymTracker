export interface ApiResponse<T> {
    status: string;
    data: T;
}

export interface JwtResponseType {
    token: string;
    tokenType: string;
    expiresIn: number;
  }
  