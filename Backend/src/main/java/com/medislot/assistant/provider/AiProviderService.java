package com.medislot.assistant.provider;

import com.medislot.assistant.model.AiGenerationRequest;
import com.medislot.assistant.model.AiGenerationResult;
import com.medislot.common.enums.AiProvider;

public interface AiProviderService {

    AiProvider getProvider();

    String getModelName();

    boolean isAvailable();

    AiGenerationResult generate(AiGenerationRequest request);
}
