import { Injectable } from '@angular/core';
import { tbl_col, pager } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  base_url = "http://localhost:3000";
  constructor(private http: HttpClient) { }

  get_all_record = (page: number = 1, per_page: number = 10): Observable<pager> => {
    let url = this.base_url + `/getall/${page}/${per_page}`;
    return this.http.get<pager>(url);
  }

  get_record_by_daterange = (start_date: string, end_start: string, page: number = 1, per_page: number = 10): Observable<pager> => {
    let url = this.base_url + `/search/${start_date}/${end_start}/${page}/${per_page}`;
    return this.http.get<pager>(url);
  }

  update_record = (item: tbl_col): Observable<any> => {
    let url = this.base_url + "/update";
    return this.http.post(url, item);
  }

  add_record = (item: tbl_col): Observable<any> => {
    let url = this.base_url + "/add";
    return this.http.post(url, item);
  }

  delete_record = (id: number): Observable<any> => {
    let url = this.base_url + `/delete/${id}`;
    return this.http.get(url);
  }
}
