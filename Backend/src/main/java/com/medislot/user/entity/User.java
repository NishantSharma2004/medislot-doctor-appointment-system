package com.medislot.user.entity;

import com.medislot.common.entity.AuditableEntity;
import com.medislot.common.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "users")
public class User extends AuditableEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "email", nullable = false, unique = true, columnDefinition = "citext")
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "country_code", length = 10)
    private String countryCode = "+1";

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "no_show_count")
    private int noShowCount = 0;

    @Column(name = "total_missed_visits")
    private int totalMissedVisits = 0;

    @Column(name = "is_cash_booking_suspended")
    private boolean isCashBookingSuspended = false;

    @Column(name = "total_accumulated_dues", precision = 10, scale = 2)
    private java.math.BigDecimal totalAccumulatedDues = java.math.BigDecimal.ZERO;

    public User() {
    }

    public User(UUID id, String email, String passwordHash, String fullName, String phone, Role role) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.enabled = true;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getNoShowCount() {
        return noShowCount;
    }

    public void setNoShowCount(int noShowCount) {
        this.noShowCount = noShowCount;
    }

    public int getTotalMissedVisits() {
        return totalMissedVisits;
    }

    public void setTotalMissedVisits(int totalMissedVisits) {
        this.totalMissedVisits = totalMissedVisits;
    }

    public boolean isCashBookingSuspended() {
        return isCashBookingSuspended;
    }

    public void setCashBookingSuspended(boolean cashBookingSuspended) {
        isCashBookingSuspended = cashBookingSuspended;
    }

    public java.math.BigDecimal getTotalAccumulatedDues() {
        return totalAccumulatedDues != null ? totalAccumulatedDues : java.math.BigDecimal.ZERO;
    }

    public void setTotalAccumulatedDues(java.math.BigDecimal totalAccumulatedDues) {
        this.totalAccumulatedDues = totalAccumulatedDues;
    }
}
