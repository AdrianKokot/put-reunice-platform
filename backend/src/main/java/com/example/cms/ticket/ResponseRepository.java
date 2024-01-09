package com.example.cms.ticket;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long>, JpaSpecificationExecutor<Response> {

    List<Response> findAllByTicket(Pageable pageable, Ticket ticket);
}
