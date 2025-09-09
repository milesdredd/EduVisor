export function useAuth() {
  const mockUser = {
    firstName: "John",
    email: "john.doe@example.com",
  };

  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
  };
}
