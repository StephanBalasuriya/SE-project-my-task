const amqp = require('amqplib');

exports.publishNotification = async (message) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'notifications';

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log('Sent notification:', message);
};