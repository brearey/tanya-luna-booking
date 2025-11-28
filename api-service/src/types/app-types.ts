export type ApiResponse = {
	success: boolean
	message: string | null
	data: unknown
	errors: Error[]
}

// CREATED — бронь только что создана через API.
// CHECKING_AVAILABILITY — система проверяет есть ли свободные столики.
// CONFIRMED — столик зарезервирован.
// REJECTED — бронь отклонена.
export enum BookingStatus {
	CREATED = 'CREATED',
	CHECKING_AVAILABILITY = 'CHECKING_AVAILABILITY',
	CONFIRMED = 'CONFIRMED',
	REJECTED = 'REJECTED',
}

export type BookingDTO = {
	id: number
	restaurantTableId: number
	inDate: Date
}
