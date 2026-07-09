package com.tripnest.service;

import com.tripnest.dto.DashboardDto;
import com.tripnest.dto.TripDto;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.mapper.TripMapper;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import com.tripnest.security.SecurityUtils;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {
    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public DashboardService(
            TripRepository tripRepository,
            ExpenseRepository expenseRepository,
            UserRepository userRepository
    ) {
        this.tripRepository = tripRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public DashboardDto getDashboard() {
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null) {
            return new DashboardDto(0L, List.of(), BigDecimal.ZERO, BigDecimal.ZERO);
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return new DashboardDto(0L, List.of(), BigDecimal.ZERO, BigDecimal.ZERO);
        }

        Long userId = user.getId();
        List<Trip> userTrips = tripRepository.findByUserIdOrderByStartDateAsc(userId);

        BigDecimal totalBudget = userTrips.stream()
                .map(trip -> trip.getBudget() == null ? BigDecimal.ZERO : trip.getBudget())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = userTrips.stream()
                .flatMap(trip -> expenseRepository.findByTripIdOrderByExpenseDateDescIdDesc(trip.getId()).stream())
                .map(expense -> expense.getAmount() == null ? BigDecimal.ZERO : expense.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<TripDto> upcomingTrips = userTrips.stream()
                .filter(trip -> trip.getStartDate() != null && !trip.getStartDate().isBefore(LocalDate.now()))
                .sorted(java.util.Comparator.comparing(Trip::getStartDate))
                .limit(5)
                .map(TripMapper::toDto)
                .toList();

        return new DashboardDto(
                (long) userTrips.size(),
                upcomingTrips,
                totalExpenses,
                totalBudget.subtract(totalExpenses)
        );
    }
}
