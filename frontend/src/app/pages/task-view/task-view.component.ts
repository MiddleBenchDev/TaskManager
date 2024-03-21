import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: any;
  tasks: any;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): any {
    this.route.params.subscribe((params: Params) => {
      if (params['listId']) {
        this.taskService
          .getTasks(params['listId'])
          .subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          });
      } else {
        console.log('None');
      }
    });

    this.taskService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    });
  }

  onTaskClick(task: Task) {
    this.taskService.completeTask(task).subscribe(() => {
      task.completed = !task.completed;
    });
  }
}
