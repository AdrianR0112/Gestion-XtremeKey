export type AuthUser = {
  id: string;
  authUserId?: string;
  name: string;
  email: string;
  role?: string;
  company?: string;
};

export type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};
