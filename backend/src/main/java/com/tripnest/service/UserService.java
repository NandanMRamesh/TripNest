package com.tripnest.service;

import com.tripnest.dto.UserDto;
import com.tripnest.entity.Role;
import com.tripnest.entity.User;
import com.tripnest.exception.DuplicateResourceException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.mapper.UserMapper;
import com.tripnest.repository.RoleRepository;
import com.tripnest.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public UserDto create(UserDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new DuplicateResourceException("A user with this email already exists");
        }
        User user = new User();
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public UserDto get(Long id) {
        return UserMapper.toDto(findEntity(id));
    }

    public UserDto update(Long id, UserDto dto) {
        User user = findEntity(id);
        userRepository.findByEmail(dto.email())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException("A user with this email already exists");
                });
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepository.save(user));
    }

    public void delete(Long id) {
        User user = findEntity(id);
        userRepository.delete(user);
    }

    public UserDto updateRole(Long id, String roleName) {
        User user = findEntity(id);
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
        user.setRole(role);
        return UserMapper.toDto(userRepository.save(user));
    }

    public User findEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    public User findEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
    }
}
