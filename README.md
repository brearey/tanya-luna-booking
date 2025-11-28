# Приложение NodeJS для бронирования свободных столиков в ресторанах

## Quick Start

```bash
git clone https://github.com/brearey/tanya-luna-booking.git

cd tanya-luna-booking

cp api-service/.env.example api-service/.env
cp booking-service/.env.example booking-service/.env
cp .env.example .env

sudo docker compose up --build

```

Для проверки работы приложения можно запустить тесты:
```bash
cd api-service
npm install
npm run test
```

## Стэк
- Node JS среда
- Express JS библиотека для развертывания серверов
- Kafka брокер сообщений для общения между сервисами `API service` и `Booking service`
- PostgreSQL база данных для хранения ресторанов, столиков и бронирований
- Jest для тестирования обеих сервисов

## Описание
> Приложение состоит из двух микросервисов.
> `API service` принимает три HTTP запроса для работы с бронированием.
> `Booking service` слушает брокер Kafka и при получении сообщения о создании брони
> начинает проверку столика на свободность. Если тру то меняет статус брони на CONFIRMED
> иначе REJECTED.

- `GET api/bookings` получение списка бронирований в формате JSON
```json
{
    "success": true,
    "message": "ok",
    "data": [
        {
            "id": 1,
            "restaurant_id": "1",
            "restaurant_table_id": "1",
            "guest_count": "6",
            "booking_status": "CONFIRMED"
        }
    ],
    "errors": []
}

```
- `GET api/bookings/:bookingId` получение конкретного бронирования по ID
```json
{
    "success": true,
    "message": "ok",
    "data": [
        {
            "id": 1,
            "restaurant_id": "1",
            "restaurant_table_id": "1",
            "guest_count": "6",
            "booking_status": "CONFIRMED"
        }
    ],
    "errors": []
}
```
- `POST api/bookings/` создание бронирования. Передаем
  - *restaurant_id* `number` ID ресторана где хотим забронировать столик
  - *restaurant_table_id* `number` ID столика который хотим забронировать
  - *guest_count* `number` кол-во гостей
  - *in_date* `Date` дата бронирования в формате `ГГГГ-ММ-ДД`
```json
{
    "success": true,
    "message": "ok",
    "data": [
        {
            "id": 1,
            "restaurant_id": "1",
            "restaurant_table_id": "1",
            "guest_count": "6",
            "booking_status": "CONFIRMED"
        }
    ],
    "errors": []
}
```