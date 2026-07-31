package com.medislot.specialization.service;

import com.medislot.specialization.dto.SpecializationDto;
import com.medislot.specialization.entity.Specialization;
import com.medislot.specialization.repository.SpecializationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SpecializationService {

    private final SpecializationRepository specializationRepository;

    public SpecializationService(SpecializationRepository specializationRepository) {
        this.specializationRepository = specializationRepository;
    }

    @Transactional(readOnly = true)
    public List<SpecializationDto> getActiveSpecializations() {
        return specializationRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public SpecializationDto mapToDto(Specialization specialization) {
        return new SpecializationDto(
                specialization.getId().toString(),
                specialization.getName()
        );
    }
}
