package com.interviewos.session_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JdUploadRequest {

    @NotBlank
    private String userId;

    private String title;

    private String company;

    @NotBlank
    private String rawText;

    public UUID getUserIdAsUUID(){
        return UUID.fromString(userId);
    }
}
