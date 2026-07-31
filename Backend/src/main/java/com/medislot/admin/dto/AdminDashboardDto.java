package com.medislot.admin.dto;

import java.util.Map;

public record AdminDashboardDto(
    long totalPatients,
    long totalDoctors,
    long activeDoctors,
    long totalAppointments,
    long pendingAppointments,
    long confirmedAppointments,
    long completedAppointments,
    long cancelledAppointments,
    long appointmentsToday,
    long appointmentsThisMonth,
    Map<String, Long> appointmentsBySpecialization,
    Map<String, Long> aiProviderUsageSummary,
    Map<String, Long> notificationSummary
) {}
