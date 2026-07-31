# MediSlot REST API Documentation

All API endpoints are prefixed with `/api/v1`.

## Authentication APIs
- `POST /api/v1/auth/register` - Register a new patient
- `POST /api/v1/auth/login` - Authenticate & obtain tokens
- `POST /api/v1/auth/refresh` - Rotate refresh token & issue new access token
- `POST /api/v1/auth/logout` - Revoke active refresh token
- `GET /api/v1/auth/me` - Fetch authenticated user details
- `POST /api/v1/auth/forgot-password` - Generate password reset token
- `POST /api/v1/auth/reset-password` - Reset password using token
- `POST /api/v1/auth/change-password` - Change password (Authenticated)

## User Profile APIs
- `GET /api/v1/users/me` - Get profile details
- `PATCH /api/v1/users/me` - Update profile & address details
- `POST /api/v1/users/me/avatar` - Upload profile image (2MB max, JPG/PNG/WEBP)
- `DELETE /api/v1/users/me/avatar` - Remove profile image

## Specialization & Doctor Directory APIs
- `GET /api/v1/specializations` - List specializations
- `GET /api/v1/doctors` - Search active doctors (filter by search, city, specializationId, maxFee, minExperience)
- `GET /api/v1/doctors/{id}` - Get doctor details

## Availability APIs
- `GET /api/v1/doctors/{doctorId}/availability` - List doctor slots
- `POST /api/v1/doctors/availability` - Create single slot (Doctor)
- `POST /api/v1/doctors/availability/recurring` - Create recurring slots (Doctor)
- `PATCH /api/v1/doctors/availability/{slotId}` - Update slot status (Doctor)
- `DELETE /api/v1/doctors/availability/{slotId}` - Delete slot (Doctor)

## Appointment APIs
- `POST /api/v1/appointments` - Book slot (Patient)
- `GET /api/v1/appointments/my` - List patient appointments (Patient)
- `GET /api/v1/doctors/appointments` - List doctor appointments (Doctor)
- `GET /api/v1/appointments/{id}` - Get appointment details
- `PATCH /api/v1/appointments/{id}/status` - Update status (Doctor)
- `PATCH /api/v1/appointments/{id}/reschedule` - Reschedule appointment (Patient)
- `DELETE /api/v1/appointments/{id}` - Cancel appointment

## AI Assistant API
- `POST /api/v1/assistant/chat` - Query grounded clinic AI assistant

## Doctor Operations API
- `GET /api/v1/doctor/dashboard` - Fetch doctor dashboard statistics

## Admin Operations APIs
- `GET /api/v1/admin/dashboard` - Fetch system analytics dashboard
- `PATCH /api/v1/admin/doctors/{id}/status` - Activate/deactivate doctor profile
- `PATCH /api/v1/admin/patients/{id}/status` - Enable/disable patient account
- `POST /api/v1/admin/specializations` - Create specialization
- `PATCH /api/v1/admin/specializations/{id}` - Update specialization
- `GET /api/v1/admin/audit-logs` - Query paginated audit logs
- `GET /api/v1/admin/clinic-documents` - List knowledge documents
- `POST /api/v1/admin/clinic-documents` - Upload clinic document (TXT/PDF/DOCX)
- `PATCH /api/v1/admin/clinic-documents/{id}/status` - Activate/deactivate document
- `DELETE /api/v1/admin/clinic-documents/{id}` - Delete document
