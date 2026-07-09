package com.tripnest.service;

import com.tripnest.dto.TripDetailsDto;
import com.tripnest.dto.TripDto;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.mapper.ExpenseMapper;
import com.tripnest.mapper.ItineraryMapper;
import com.tripnest.mapper.TripMapper;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.ItineraryRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.security.SecurityUtils;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TripService {
    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final ExpenseRepository expenseRepository;
    private final UserService userService;
    private final BudgetService budgetService;

    public TripService(
            TripRepository tripRepository,
            ItineraryRepository itineraryRepository,
            ExpenseRepository expenseRepository,
            UserService userService,
            BudgetService budgetService
    ) {
        this.tripRepository = tripRepository;
        this.itineraryRepository = itineraryRepository;
        this.expenseRepository = expenseRepository;
        this.userService = userService;
        this.budgetService = budgetService;
    }

    public TripDto create(TripDto dto) {
        validateDates(dto);
        User user = userService.findEntity(dto.userId());
        Trip trip = new Trip();
        TripMapper.updateEntity(trip, dto);
        trip.setUser(user);
        return TripMapper.toDto(tripRepository.save(trip));
    }

    @Transactional(readOnly = true)
    public List<TripDto> list(Long userId) {
        if (userId == null) {
            String email = SecurityUtils.getCurrentUserEmail();
            if (email != null) {
                User user = userService.findEntityByEmail(email);
                if (user != null) {
                    userId = user.getId();
                }
            }
        }
        List<Trip> trips = userId == null
                ? tripRepository.findAll()
                : tripRepository.findByUserIdOrderByStartDateAsc(userId);
        return trips.stream().map(TripMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public TripDto get(Long id) {
        return TripMapper.toDto(findEntity(id));
    }

    @Transactional(readOnly = true)
    public TripDetailsDto getDetails(Long id) {
        Trip trip = findEntity(id);
        return new TripDetailsDto(
                TripMapper.toDto(trip),
                itineraryRepository.findByTripIdOrderByDayNumberAscIdAsc(id).stream().map(ItineraryMapper::toDto).toList(),
                expenseRepository.findByTripIdOrderByExpenseDateDescIdDesc(id).stream().map(ExpenseMapper::toDto).toList(),
                budgetService.getSummary(id)
        );
    }

    public TripDto update(Long id, TripDto dto) {
        validateDates(dto);
        Trip trip = findEntity(id);
        TripMapper.updateEntity(trip, dto);
        if (!trip.getUser().getId().equals(dto.userId())) {
            trip.setUser(userService.findEntity(dto.userId()));
        }
        return TripMapper.toDto(tripRepository.save(trip));
    }

    public void delete(Long id) {
        Trip trip = findEntity(id);
        tripRepository.delete(trip);
    }

    public Trip findEntity(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + id));
    }

    private void validateDates(TripDto dto) {
        if (dto.endDate().isBefore(dto.startDate())) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }
    }
}
