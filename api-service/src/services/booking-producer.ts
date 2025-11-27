import { Partitioners } from 'kafkajs'
import { kafka } from '../config/kafka'

async function createProducer() {
  const prod = await kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  })
  await prod.connect()
  return prod
}

export const producer = createProducer()
