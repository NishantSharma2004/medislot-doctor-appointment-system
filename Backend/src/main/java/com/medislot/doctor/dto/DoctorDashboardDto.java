package com.medislot.doctor.dto;

public record DoctorDashboardDto(
    long todayAppointments,
    long upcomingAppointments,
    long pendingAppointments,
    long completedAppointments,
    long cancelledAppointments,
    long totalSlots,
    long bookedSlots
) {}
