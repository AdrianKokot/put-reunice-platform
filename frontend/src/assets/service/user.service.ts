import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserForm } from '../models/user';
import { University } from '../models/university';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = `${environment.backendAPIRootUrl}/users`;

  public loggedUser!: User | null;

  httpOptions = {
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getUser(id: number, defaultErrorHandling = true): Observable<User> {
    return this.http
      .get<User>(`${this.userUrl}/${id}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  getUsers(defaultErrorHandling = true): Observable<User[]> {
    return this.http
      .get<User[]>(this.userUrl, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  searchUsers(text: string, defaultErrorHandling = true): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.userUrl}/search/${text}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  createUser(user: UserForm, defaultErrorHandling = true): Observable<User> {
    return this.http
      .post<User>(this.userUrl, user, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  editUser(
    id: number,
    user: UserForm,
    defaultErrorHandling = true
  ): Observable<User> {
    return this.http
      .put<User>(`${this.userUrl}/${id}`, user, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  login(
    user: { username: string; password: string },
    defaultErrorHandling = true
  ): Observable<any> {
    console.log(`address: ${environment.backendAPIRootUrl}/login`); //MSz
    return this.http
      .post<any>(
        `${environment.backendAPIRootUrl}/login`,
        user,
        this.httpOptions
      )
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  logout(defaultErrorHandling = true): Observable<any> {
    return this.http
      .get<any>(`${environment.backendAPIRootUrl}/logout`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  getLoggedUser(defaultErrorHandling = true): Observable<any> {
    return this.http
      .get<any>(`${this.userUrl}/logged`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  modifyUserEnabledField(
    id: number,
    enabled: boolean,
    defaultErrorHandling = true
  ): Observable<void> {
    return this.http
      .patch<void>(`${this.userUrl}/${id}/enabled`, enabled, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  updateUserEnrolledUniversities(
    id: number,
    universitiesId: number[],
    defaultErrorHandling = true
  ): Observable<User> {
    return this.http
      .put<User>(
        `${this.userUrl}/${id}/universities`,
        universitiesId,
        this.httpOptions
      )
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  modifyUserPasswordField(
    id: number,
    passwords: { oldPassword: string; newPassword: string },
    defaultErrorHandling = true
  ): Observable<void> {
    return this.http
      .patch<void>(
        `${this.userUrl}/${id}/password`,
        passwords,
        this.httpOptions
      )
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  modifyUserUsernameField(
    id: number,
    username: string,
    defaultErrorHandling = true
  ): Observable<void> {
    return this.http
      .patch<void>(`${this.userUrl}/${id}/username`, username, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  modifyUserAccountTypeField(
    id: number,
    accountType: string,
    defaultErrorHandling = true
  ): Observable<void> {
    return this.http
      .patch<void>(
        `${this.userUrl}/${id}/accountType`,
        { accountType: accountType },
        this.httpOptions
      )
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  deleteUser(id: number, defaultErrorHandling = true): Observable<void> {
    return this.http
      .delete<void>(`${this.userUrl}/${id}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }
}
