package com.medislot.appointment.event;

import com.medislot.appointment.entity.Appointment;

public record AppointmentCancelledEvent(Appointment appointment) {
}
