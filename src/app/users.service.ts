import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly USERS_ENDPOINT = 'http://localhost:3000/users';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.USERS_ENDPOINT);
  }
}
