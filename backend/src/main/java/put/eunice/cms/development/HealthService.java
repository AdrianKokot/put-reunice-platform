package put.eunice.cms.development;

import org.springframework.stereotype.Service;

@Service
public class HealthService {
    public enum Status {
        HEALTHY,
        STARTING
    }

    private Status status = Status.STARTING;

    public void setStatus(Status status) {
        this.status = status;
    }

    public Status getStatus() {
        return this.status;
    }

    public String health() {
        return this.status.toString().toLowerCase();
    }
}
