package com.skillstorm.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/** Subscribes to user-registered events in portfolio-service. */
@Component
public class UserRegisteredSubscriber {

    private static final Logger log = LoggerFactory.getLogger(UserRegisteredSubscriber.class);

    @RabbitListener(queues = RabbitMQConfig.USER_REGISTERED_QUEUE)
    public void onUserRegistered(UserRegisteredEvent event) {
        // Look for this line in the portfolio-service console / Run terminal.
        log.info("New user ready (from RabbitMQ): userId={} username={} email={}",
                event.userId(), event.username(), event.email());
    }
}
