import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Palestrante } from '../models/Palestrante';
import { map, take } from 'rxjs/operators';
import { environment } from '@enviroments/environment';
import { PaginatedResult } from '@app/models/Pagination';

//This class brings the contents from the http methods
@Injectable()
export class PalestranteService {
  baseURL: string = environment.apiURL + '/api/palestrante';

  constructor(private http: HttpClient) { }

  public getPalestrantes(
    page?: number,
    itemsPerPage?: number,
    term?: string
  ): Observable<PaginatedResult<Palestrante[]>> {
    const paginatedResult: PaginatedResult<Palestrante[]> = new PaginatedResult<Palestrante[]>();

    let params = new HttpParams();

    if(page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if(term != null && term != '') {
      params = params.append('term', term);
    }

    return this.http
      .get<Palestrante[]>(this.baseURL + '/all', {observe: 'response', params})
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body;
          if(response.headers.has('Pagination')) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
      }));
}

  public getPalestrante(): Observable<Palestrante> {
    return this.http
      .get<Palestrante>(`${this.baseURL}`)
      .pipe(take(1));
  }

  public post(): Observable<Palestrante> {
    return this.http
      .post<Palestrante>(this.baseURL, {} as Palestrante)
      .pipe(take(1));
  }

  public put(palestrante: Palestrante): Observable<Palestrante> {
    return this.http
      .put<Palestrante>(`${this.baseURL}`, palestrante)
      .pipe(take(1));
  }

  public postUpload(palestranteId: number, file: File): Observable<Palestrante> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
      .post<Palestrante>(`${this.baseURL}/upload-image/${palestranteId}`, formData)
      .pipe(take(1));
  }
}
