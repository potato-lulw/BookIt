export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  count?: number;
  errorCode?: string;
}