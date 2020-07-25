import { Component, OnInit } from '@angular/core';
import { TodosService } from '../todos.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Todo } from '../todos';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todosState$ = this.todosService.findAll().pipe(
    map((result) => {
      return {
        todos: result,
        error: null,
      };
    }),
    catchError((e: Error) => {
      return of({
        todos: [],
        error: e.message,
      });
    })
  );

  constructor(private readonly todosService: TodosService) {}

  ngOnInit(): void {}

  done(todo: Todo): void {
    this.todosService
      .done(todo.id)
      .toPromise()
      .then(() => {
        console.log('completed', todo);
      });
  }

  remove(todo: Todo): void {
    this.todosService
      .remove(todo.id)
      .toPromise()
      .then(() => {
        console.log('removed', todo);
      });
  }
}
