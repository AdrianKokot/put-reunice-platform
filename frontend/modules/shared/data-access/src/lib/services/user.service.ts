import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserForm } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userUrl = '/api/users';

  public loggedUser!: User | null;

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  searchUsers(text: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.userUrl}/search/${text}`);
  }

  createUser(user: UserForm): Observable<User> {
    return this.http.post<User>(this.userUrl, user);
  }

  editUser(id: number, user: UserForm): Observable<User> {
    return this.http.put<User>(`${this.userUrl}/${id}`, user);
  }

  login(user: { username: string; password: string }): Observable<unknown> {
    return this.http.post<unknown>('/api/login', user);
  }

  logout(): Observable<unknown> {
    return this.http.get<unknown>('/api/logout');
  }

  getLoggedUser(): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/logged`);
  }

  modifyUserEnabledField(id: number, enabled: boolean): Observable<void> {
    return this.http.patch<void>(`${this.userUrl}/${id}/enabled`, enabled);
  }

  updateUserEnrolledUniversities(
    id: number,
    universitiesId: number[]
  ): Observable<User> {
    return this.http.put<User>(
      `${this.userUrl}/${id}/universities`,
      universitiesId
    );
  }

  modifyUserPasswordField(
    id: number,
    passwords: { oldPassword: string; newPassword: string }
  ): Observable<void> {
    return this.http.patch<void>(`${this.userUrl}/${id}/password`, passwords);
  }

  modifyUserUsernameField(id: number, username: string): Observable<void> {
    return this.http.patch<void>(`${this.userUrl}/${id}/username`, username);
  }

  modifyUserAccountTypeField(
    id: number,
    accountType: string
  ): Observable<void> {
    return this.http.patch<void>(`${this.userUrl}/${id}/accountType`, {
      accountType: accountType,
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userUrl}/${id}`);
  }
}
