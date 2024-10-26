package com.itsag3t1.crm.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

public class ClaimsUtil {
    private static final String AGENT_ID_CLAIM = "sub";

    public static String getAgentId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return (String) jwt.getClaims().get(AGENT_ID_CLAIM);
    }
}
