import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
  listId!: string;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.listId = params['listId'];
    });
  }

  createTask(title: string) {
    return this.taskService.createTask(title, this.listId).subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
