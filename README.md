# Node JS app for the booking service with Kafka

#### Get topics list
```bash
sudo docker exec -it tanya-luna-booking-kafka-1 kafka-topics.sh --list --zookeeper zookeeper:2181
```

#### Get all messages from topic
```bash
sudo docker exec -it tanya-luna-booking-kafka-1 kafka-console-consumer.sh --topic booking-topic --from-beginning --bootstrap-server localhost:9092
```