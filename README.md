# Приложение NodeJS для бронирования свободных столиков в ресторанах

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

## TODO
1. Сделать рефакторинг api service
2. Завернуть обе сервиса в докер
3. Написать инструкцию запуска в ридми

#### Default ports:
- API service `5000`
- Booking service `5001`

#### Get topics list
```bash
sudo docker exec -it tanya-loona-booking-kafka-1 kafka-topics.sh --list --zookeeper zookeeper:2181
```

#### Get all messages from topic
```bash
sudo docker exec -it tanya-loona-booking-kafka-1 kafka-console-consumer.sh --topic booking-topic --from-beginning --bootstrap-server localhost:9092
```

#### HTTP requests in shell
```bash
curl http://localhost:5000/api/bookings | python3 -m json.tool
```