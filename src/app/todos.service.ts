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

  done(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.TODOS_ENDPOINT}/${id}`, {
      done: true,
    });
  }

  remove(id: number): Observable<Todo> {
    return this.http.delete<Todo>(`${this.TODOS_ENDPOINT}/${id}`);
  }

  create(data: { title: string }): Observable<Todo> {
    return this.http.post<Todo>(this.TODOS_ENDPOINT, {
      title: data.title,
      done: false,
    });
  }
}
