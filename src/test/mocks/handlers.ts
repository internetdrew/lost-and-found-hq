import { http, HttpResponse } from 'msw';

export enum TestUser {
  EMAIL = 'test@test.com',
  PASSWORD = 'password123',
}

type LoginRequestBody = {
  email: string;
  password: string;
};

type LoginSuccessResponse = {
  message: string;
  redirectTo: string;
};

type LoginErrorResponse = {
  error: string;
};

export const handlers = [
  http.post<never, LoginRequestBody, LoginSuccessResponse | LoginErrorResponse>(
    '/auth/login',
    async ({ request }) => {
      const { email, password } = await request.json();

      if (email === TestUser.EMAIL && password === TestUser.PASSWORD) {
        return HttpResponse.json({
          message: 'Login successful',
          redirectTo: '/dashboard',
        });
      }

      return HttpResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }
  ),
  http.get('/auth/user', () => {
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    });
  }),
];
