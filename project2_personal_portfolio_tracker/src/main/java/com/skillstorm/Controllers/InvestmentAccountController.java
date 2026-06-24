package com.skillstorm.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.DTOs.InvestmentAccountDto;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Services.InvestmentAccountService;

import io.micrometer.core.ipc.http.HttpSender.Response;

@RestController
@RequestMapping("/v1/investments")
//@CrossOrigin(origins = "http://127.0.0.1:5500") // TODO: CHANGE THIS
public class InvestmentAccountController {

    private final InvestmentAccountService service;

    public InvestmentAccountController(InvestmentAccountService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Iterable<InvestmentAccount>> getAccounts(
        @RequestParam(required=false) Integer userId
    ) {
        return (userId == null) ? ResponseEntity.ok(service.getAll())
        : ResponseEntity.status(200).body(service.getUserAccounts(userId));
    }

    // POST (ADD ACCOUNT)
    @PostMapping
    public ResponseEntity<InvestmentAccount> addUserAccount(
            @RequestParam(required = true) int userId,
            @RequestBody InvestmentAccountDto dto) {

        InvestmentAccount investmentAccount = service.addUserAccount(userId, dto);

        return (investmentAccount == null) ? ResponseEntity.notFound().build()
        : ResponseEntity.status(201).body(investmentAccount);
        
    }

    // PUT (EDIT ACCOUNT)
    @PutMapping("/{id}")
    public ResponseEntity<InvestmentAccount> updateUserAccount(
            @PathVariable int id,
            @RequestBody InvestmentAccountDto dto) {
                
        InvestmentAccount investmentAccount = service.editUserAccount(id, dto);

        return (investmentAccount == null) ? ResponseEntity.notFound().build()
        : ResponseEntity.status(200).body(investmentAccount);
    }

    // DELETE (DELETE ACCOUNT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserAccount(
            @PathVariable int id) {
        
        return service.deleteUserAccount(id) ? ResponseEntity.noContent().build()
        : ResponseEntity.notFound().build();
    }

}
