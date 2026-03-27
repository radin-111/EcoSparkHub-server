export interface TErrorSources {
  path: string | number;
  message: string;
}

export interface TErrorResponse {
  success: boolean;
  message: string;
  errorSources: TErrorSources[];
  statusCode?: number;
  stack?: string;
  error?: unknown;
}
