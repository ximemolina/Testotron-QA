import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 200,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8080';

export function setup() {

  const login = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: 'teacher@test.com',
      password: 'pass'
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    token: login.json('token')
  };
}

export default function (data) {

  const res = http.get(
    `${BASE_URL}/api/tests`,
    {
      headers: {
        Authorization: `Bearer ${data.token}`
      }
    }
  );

  check(res, {
    'status 200': r =>
      r.status === 200
  });
}