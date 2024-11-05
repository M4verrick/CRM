package com.itsag3t1.crm.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProfileAccountsDTO {
    private Long profileId;
    private List<ClientAccount> accounts;
}