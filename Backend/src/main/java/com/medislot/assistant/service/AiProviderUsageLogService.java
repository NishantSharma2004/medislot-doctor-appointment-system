package com.medislot.assistant.service;

import com.medislot.assistant.entity.AiProviderUsageLog;
import com.medislot.assistant.model.AiGenerationResult;
import com.medislot.assistant.repository.AiProviderUsageLogRepository;
import com.medislot.common.enums.AiProvider;
import com.medislot.common.enums.AiProviderOutcome;
import com.medislot.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AiProviderUsageLogService {

    private static final Logger log = LoggerFactory.getLogger(AiProviderUsageLogService.class);

    private final AiProviderUsageLogRepository usageLogRepository;

    public AiProviderUsageLogService(AiProviderUsageLogRepository usageLogRepository) {
        this.usageLogRepository = usageLogRepository;
    }

    /**
     * Records a provider attempt in a separate isolated transaction so logging failures
     * never break user responses.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordAttempt(UUID requestId, User user, AiProvider provider, AiGenerationResult result, boolean fallbackUsed) {
        try {
            AiProviderUsageLog usageLog = new AiProviderUsageLog();
            usageLog.setRequestId(requestId);
            usageLog.setUser(user);
            usageLog.setProvider(provider);
            usageLog.setModel(result.model());
            usageLog.setSuccess(result.success());
            usageLog.setFallbackUsed(fallbackUsed);
            usageLog.setStatusCode(result.statusCode());
            usageLog.setLatencyMs((int) result.latencyMs());
            usageLog.setInputTokens(result.inputTokens());
            usageLog.setOutputTokens(result.outputTokens());
            usageLog.setErrorCategory(result.errorCategory());

            if (result.success()) {
                usageLog.setOutcome(fallbackUsed ? AiProviderOutcome.FALLBACK : AiProviderOutcome.SUCCESS);
            } else {
                usageLog.setOutcome(AiProviderOutcome.FAILURE);
            }

            usageLogRepository.save(usageLog);
        } catch (Exception ex) {
            log.error("Failed to persist AI provider usage log for request {}: {}", requestId, ex.getMessage());
        }
    }
}
