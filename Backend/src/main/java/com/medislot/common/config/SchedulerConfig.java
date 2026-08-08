package com.medislot.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Enables Spring Framework background task execution & scheduled maintenance jobs.
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
}
