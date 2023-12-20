package com.example.cms.user;

import com.example.cms.security.Role;
import com.example.cms.user.projections.UserDtoDetailed;
import com.example.cms.user.projections.UserDtoFormCreate;
import com.example.cms.user.projections.UserDtoFormUpdate;
import com.example.cms.user.projections.UserDtoSimple;
import com.example.cms.validation.FilterPathVariableValidator;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/users")
public class UserController {

    private final UserService service;

    @GetMapping(path = "/{id}")
    public UserDtoDetailed getUser(@PathVariable long id) {
        return service.getUser(id);
    }

    @GetMapping("/logged")
    public UserDtoDetailed getLoggedUser() {
        return service.getLoggedUser();
    }

    @GetMapping
    public ResponseEntity<List<UserDtoSimple>> getUsers(
            Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<User> responsePage =
                service.getUsers(pageable, FilterPathVariableValidator.validate(vars, User.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(UserDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<UserDtoDetailed> createUser(@RequestBody UserDtoFormCreate form) {
        UserDtoDetailed result = service.createUser(form);
        return ResponseEntity.created(URI.create("/" + result.getId())).body(result);
    }

    @PutMapping("/{id}")
    UserDtoDetailed updateUser(@PathVariable long id, @RequestBody UserDtoFormUpdate form) {
        return service.updateUser(id, form);
    }

    @PutMapping("/{userId}/universities")
    public UserDtoDetailed updateUserEnrolledUniversities(
            @PathVariable long userId, @RequestBody List<Long> universitiesId) {
        return service.updateEnrolledUniversities(userId, universitiesId);
    }

    @PatchMapping("/{id}/enabled")
    ResponseEntity<Void> modifyUserEnabledField(@PathVariable long id, @RequestBody boolean enabled) {
        service.modifyEnabledField(id, enabled);
        return ResponseEntity.noContent().build();
    }

    // TODO: remove? ale chyba nie lub zmieniamy że przy każdym update usera musi stare hasło podać
    @PatchMapping("/{id}/password")
    ResponseEntity<Void> modifyUserPasswordField(
            @PathVariable long id, @RequestBody Map<String, String> passwordMap) {
        service.modifyPasswordField(id, passwordMap);
        return ResponseEntity.noContent().build();
    }

    // TODO: remove?
    @PatchMapping("/{id}/username")
    ResponseEntity<Void> modifyUserUsernameField(
            @PathVariable long id, @RequestBody String username) {
        service.modifyUsernameField(id, username);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/accountType")
    ResponseEntity<Void> modifyUserAccountTypeField(
            @PathVariable long id, @RequestBody Map<String, Role> accountType) {
        service.modifyAccountTypeField(id, accountType);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteUser(@PathVariable long id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
