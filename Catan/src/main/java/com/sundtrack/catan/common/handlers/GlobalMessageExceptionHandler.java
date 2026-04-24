package com.sundtrack.catan.common.handlers;

import com.sundtrack.catan.common.exceptions.SnapshotAlreadyExistsException;
import com.sundtrack.catan.common.exceptions.SnapshotNotFoundException;
import com.sundtrack.catan.common.exceptions.SnapshotPersistenceException;
import com.sundtrack.catan.session.shared.dto.response.AckResponseDTO;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalMessageExceptionHandler {

    @MessageExceptionHandler(SnapshotNotFoundException.class)
    @SendToUser("/queue/errors")
    public AckResponseDTO handleNotFound(SnapshotNotFoundException e) {
        return new AckResponseDTO("not_found", e.getMessage());
    }

    @MessageExceptionHandler(SnapshotAlreadyExistsException.class)
    @SendToUser("/queue/errors")
    public AckResponseDTO handleAlreadyExists(SnapshotAlreadyExistsException e) {
        return new AckResponseDTO("conflict", e.getMessage());
    }

    @MessageExceptionHandler(SnapshotPersistenceException.class)
    @SendToUser("/queue/errors")
    public AckResponseDTO handlePersistence(SnapshotPersistenceException e) {
        return new AckResponseDTO("error", e.getMessage());
    }
}