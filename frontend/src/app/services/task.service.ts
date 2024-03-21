import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webReqService: WebRequestService) {}

  createList(title: string): Observable<any> {
    return this.webReqService.post('lists', { title });
  }

  createTask(title: string, listId: string): Observable<any> {
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  getLists(): Observable<any> {
    return this.webReqService.get('lists');
  }

  getTasks(listId: string): Observable<any> {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  completeTask(task: Task): Observable<any> {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed,
    });
  }
}
