# Node JS app for the booking service with Kafka

#### Default ports:
- API service `5000`
- Booking service `5001`

#### Get topics list
```bash
sudo docker exec -it tanya-luna-booking-kafka-1 kafka-topics.sh --list --zookeeper zookeeper:2181
```

#### Get all messages from topic
```bash
sudo docker exec -it tanya-luna-booking-kafka-1 kafka-console-consumer.sh --topic booking-topic --from-beginning --bootstrap-server localhost:9092
```

#### HTTP requests in shell
```bash
curl http://localhost:5000/api/bookings | python3 -m json.tool
```