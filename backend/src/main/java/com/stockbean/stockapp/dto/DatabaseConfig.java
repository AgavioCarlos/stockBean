package com.stockbean.stockapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatabaseConfig {
    private String host;
    private String port;
    private String database;
    private String username;
    private String password;
    private String mode; // LOCAL or SERVER
}
