package com.medislot.appointment.event;

import com.medislot.appointment.entity.Appointment;
import com.medislot.availability.entity.AvailabilitySlot;

public record AppointmentRescheduledEvent(Appointment appointment, AvailabilitySlot oldSlot, AvailabilitySlot newSlot) {
}
