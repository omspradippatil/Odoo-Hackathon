package com.devflow.backend.notification;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Notification> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Notification add(@RequestBody Notification notif) {
        if (notif.getId() == null) {
            notif.setId("notif-" + UUID.randomUUID().toString().substring(0,8));
        }
        return repository.save(notif);
    }

    @PutMapping("/{id}/read")
    public Notification markRead(@PathVariable String id) {
        Notification n = repository.findById(id).orElse(null);
        if (n != null) {
            n.setIsRead(true);
            return repository.save(n);
        }
        return null;
    }
    
    @PutMapping("/read-all")
    public void markAllRead() {
        List<Notification> all = repository.findAll();
        all.forEach(n -> n.setIsRead(true));
        repository.saveAll(all);
    }
}
