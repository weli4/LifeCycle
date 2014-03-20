package service;

import entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class TenantHelper {
    public long getCurrentUserTenant() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null){
            return -1;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User){
            return ((User)principal).getTenant();
        } else {
            return -1;
        }
    }
}
