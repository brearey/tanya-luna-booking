import axios, { AxiosResponse } from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

interface ApiErrorResponse {
	success: boolean
	message: string
	data: unknown
	errors: unknown[]
}

describe('Bookings API Tests', () => {
	test('GET /api/bookings - should work', async () => {
		const response: AxiosResponse<ApiErrorResponse> = await axios.get(`${API_BASE_URL}/bookings`)
		expect(response.status).toBe(200)
		expect(response.data.success).toBe(true)
		expect(Array.isArray(response.data.data)).toBe(true)
	})
})
