package put.eunice.cms.ticket.projections;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LastChangedBy {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}
