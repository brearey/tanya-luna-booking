export type ApiError = {
	name: string
	message: string
}

export type ApiResponse = {
	success: boolean
	message: string | null
	data: unknown
	errors: ApiError[]
}

// CREATED — бронь только что создана через API.
// CHECKING_AVAILABILITY — система проверяет есть ли свободные столики.
// CONFIRMED — столик зарезервирован.
// REJECTED — бронь отклонена.
export enum BookingStatus {
  'CREATED',
  'CHECKING_AVAILABILITY',
  'CONFIRMED',
  'REJECTED'
}