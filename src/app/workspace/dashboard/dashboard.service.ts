import { BaseService } from '../../shared/services/base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DashboardService {
  private baseUrl = 'api/manual';
  constructor(public baseService: BaseService) {
    this.baseService.set(this.baseUrl, 'DashboardService');
  }
}
