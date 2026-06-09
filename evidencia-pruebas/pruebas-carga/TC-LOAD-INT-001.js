import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 200,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8080';
const TEST_CODE = 'TEST01';

export function setup() {

  const login = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: 'student1@test.com',
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

  const res = http.post(
    `${BASE_URL}/api/tests/${TEST_CODE}/start`,
    null,
    {
      headers: {
        Authorization: `Bearer ${data.token}`
      }
    }
  );

  check(res, {
    'status válido': r =>
      r.status === 200 || r.status === 201
  });
}