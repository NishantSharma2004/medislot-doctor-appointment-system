package com.medislot.doctor.dto;

import com.medislot.appointment.dto.AppointmentDto;
import java.util.List;

public record OpdQueueResponse(
        String doctorId,
        String doctorName,
        String date,
        Integer currentlyServingToken,
        String currentlyServingPatientName,
        Integer totalTokensToday,
        Integer remainingPatients,
        List<AppointmentDto> queue
) {}
