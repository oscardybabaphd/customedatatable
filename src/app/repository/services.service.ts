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
}
