package com.medislot.common.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url}")
    private String rawUrl;

    @Value("${spring.datasource.username:postgres}")
    private String rawUsername;

    @Value("${spring.datasource.password:postgres}")
    private String rawPassword;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName(driverClassName);

        String cleanUrl = rawUrl != null ? rawUrl.trim() : "";
        String username = rawUsername;
        String password = rawPassword;

        // Strip "jdbc:" prefix temporarily to parse URI cleanly if user:pass@host format is used
        String uriString = cleanUrl.startsWith("jdbc:") ? cleanUrl.substring(5) : cleanUrl;

        if (uriString.contains("@")) {
            try {
                URI uri = URI.create(uriString);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }

                String host = uri.getHost();
                int port = uri.getPort();
                String path = uri.getPath();

                StringBuilder sb = new StringBuilder("jdbc:postgresql://").append(host);
                if (port > 0) {
                    sb.append(":").append(port);
                }
                if (path != null) {
                    sb.append(path);
                }
                cleanUrl = sb.toString();
                log.info("Parsed embedded credentials from database URL. Clean JDBC URL: {}", cleanUrl);
            } catch (Exception e) {
                log.warn("Could not parse URI from raw URL, using as-is: {}", e.getMessage());
            }
        } else if (!cleanUrl.startsWith("jdbc:")) {
            cleanUrl = "jdbc:" + cleanUrl;
        }

        config.setJdbcUrl(cleanUrl);
        config.setUsername(username);
        config.setPassword(password);

        return new HikariDataSource(config);
    }
}
