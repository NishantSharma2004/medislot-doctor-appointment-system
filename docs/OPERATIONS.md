# MediSlot Operations Guide

## Health Monitoring
- Public Liveness Probe: `/actuator/health/liveness`
- Public Readiness Probe: `/actuator/health/readiness`
- Full Health Endpoint: `/actuator/health`

## Operational Metrics & Diagnostics
- Check database connectivity status via `/actuator/health`.
- Check Railway console logs for application startup, Flyway migration output, and HTTP 5xx error traces.
