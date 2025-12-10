export const logger = {
  error: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.error(message, data);
    }
    // In production: send to monitoring service
  },
};
