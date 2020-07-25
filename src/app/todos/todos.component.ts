import { Component, OnInit } from '@angular/core';
import { TodosService } from '../todos.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

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
}
