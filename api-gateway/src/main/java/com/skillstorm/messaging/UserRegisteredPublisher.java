package com.skillstorm.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

/** Publishes user-registered events from api-gateway onto RabbitMQ. */
@Component
public class UserRegisteredPublisher {

    private static final Logger log = LoggerFactory.getLogger(UserRegisteredPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public UserRegisteredPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publish(UserRegisteredEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.USER_EXCHANGE,
                RabbitMQConfig.USER_REGISTERED_ROUTING_KEY,
                event);
        log.info("Published user.registered event for userId={} username={}", event.userId(), event.username());
    }
}
