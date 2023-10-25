import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketService extends AbstractApiService<Ticket> {
  constructor() {
    super('/api/tickets');
  }
}
