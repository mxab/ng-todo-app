import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todos';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private readonly TODOS_ENDPOINT = 'http://localhost:3000/todos';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.TODOS_ENDPOINT);
  }
}
