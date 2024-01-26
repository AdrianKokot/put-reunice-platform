package put.eunice.cms.development;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class HealthController {

    private final HealthService healthService;

    @GetMapping("health")
    public ResponseEntity<String> healthCheck() {
        var entity =
                ResponseEntity.status(
                        this.healthService.getStatus().equals(HealthService.Status.HEALTHY) ? 200 : 503);
        return entity.body(this.healthService.health());
    }
}
