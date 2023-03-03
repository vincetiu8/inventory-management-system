/**
 * The interface for the server error response.
 */
export interface ServerError {
  response: {
    data: {
      message: string;
    };
  };
}
