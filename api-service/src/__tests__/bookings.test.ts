import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface ApiErrorResponse {
  success: boolean;
  message: string;
  data: unknown;
  errors: unknown[];
}

describe('Bookings API Tests', () => {
  test('GET /api/bookings - should return list of bookings', async () => {
    const response: AxiosResponse<ApiErrorResponse> = await axios.get(`${API_BASE_URL}/bookings`);
    
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  test('POST /api/bookings - should create a booking', async () => {
    const newBooking = {
      restaurant_id: 1,
      booking_date: '2025-11-29',
      guest_count: 5,
    };

    let response: AxiosResponse<ApiErrorResponse>;

    try {
      response = await axios.post(`${API_BASE_URL}/bookings`, newBooking, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        response = error.response as AxiosResponse<ApiErrorResponse>;
      } else {
        throw error;
      }
    }

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.message).toBe('ok');
    expect(Array.isArray(response.data.data)).toBe(true);
    expect(Array.isArray(response.data.errors)).toBe(true);
    expect(response.data.errors.length).toBe(0);
  });
});
