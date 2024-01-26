package put.eunice.cms.ticket.projections;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.ticket.Response;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDtoCreate {
    private String content;

    public static ResponseDtoCreate of(Response response) {
        if (response == null) {
            return null;
        }
        return new ResponseDtoCreate(response);
    }

    private ResponseDtoCreate(Response response) {
        content = response.getContent();
    }
}
