package put.eunice.cms.email;

public enum EmailTemplate {
    NEW_USER_ACCOUNT("NewUserAccount"),
    EDIT_USER_ACCOUNT("EditUserAccount"),
    EDIT_USER_ACCOUNT_WITH_PASSWORD("EditUserAccountWithPwd"),
    CHANGE_TICKET_STATUS("ChangeTicketStatus"),
    CHANGE_TICKET_STATUS_CRH("ChangeTicketStatusCRH"),
    DELETE_USER_ACCOUNT("DeleteUserAccount"),
    DISABLE_USER_ACCOUNT("DisableUserAccount"),
    NEW_RESPONSE_TICKET("NewResponseTicket"),
    NEW_TICKET("NewTicket"),
    ENABLE_USER_ACCOUNT("EnableUserAccount");
    public final String templateName;

    EmailTemplate(String templateName) {
        this.templateName = templateName;
    }
}
