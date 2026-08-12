package com.medislot.doctor.sse;

import com.medislot.doctor.dto.OpdQueueResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class OpdQueueSseRegistry {

    private static final Logger log = LoggerFactory.getLogger(OpdQueueSseRegistry.class);
    private static final long SSE_TIMEOUT_MS = 30 * 60 * 1000L; // 30 minutes

    private final Map<UUID, List<SseEmitter>> emittersMap = new ConcurrentHashMap<>();

    public SseEmitter subscribe(UUID doctorId) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT_MS);
        emittersMap.computeIfAbsent(doctorId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(doctorId, emitter));
        emitter.onTimeout(() -> removeEmitter(doctorId, emitter));
        emitter.onError(e -> removeEmitter(doctorId, emitter));

        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("{\"status\":\"CONNECTED\",\"message\":\"Subscribed to live OPD queue updates\"}"));
        } catch (IOException e) {
            removeEmitter(doctorId, emitter);
        }

        log.info("Client subscribed to live SSE OPD queue for Doctor [{}]", doctorId);
        return emitter;
    }

    public void broadcastQueueUpdate(UUID doctorId, OpdQueueResponse queueResponse) {
        List<SseEmitter> emitters = emittersMap.get(doctorId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        log.info("Broadcasting live SSE OPD queue update to {} clients for Doctor [{}]", emitters.size(), doctorId);

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("opd-queue-update")
                        .data(queueResponse));
            } catch (Exception e) {
                removeEmitter(doctorId, emitter);
            }
        }
    }

    @Scheduled(fixedRate = 25000)
    public void sendHeartbeat() {
        emittersMap.forEach((doctorId, list) -> {
            for (SseEmitter emitter : list) {
                try {
                    emitter.send(SseEmitter.event().name("ping").data("{\"type\":\"HEARTBEAT\"}"));
                } catch (Exception e) {
                    removeEmitter(doctorId, emitter);
                }
            }
        });
    }

    private void removeEmitter(UUID doctorId, SseEmitter emitter) {
        List<SseEmitter> list = emittersMap.get(doctorId);
        if (list != null) {
            list.remove(emitter);
            if (list.isEmpty()) {
                emittersMap.remove(doctorId);
            }
        }
    }
}
