import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EntryService {
  baseURL: string = 'https://localhost:44391/api/entries';

  headers = new HttpHeaders({'Content-Type' : 'application/json'});
  //{headers : this.headers}
  constructor(private http: HttpClient) {}

  getEntry(id: any) {
    return this.http.get(this.baseURL + '/' + id);
  }
  getAll(pageNo: any, pageSize: any, sortDir:any, name:any) {
    return this.http.get(this.baseURL + "?PageNumber=" + pageNo + "&PageSize=" + pageSize +"&sortDir=" + sortDir+"&name=" + name);
  }
  
  createEntry(entry: any) {
    return this.http.post(this.baseURL, entry, {responseType: 'text'});
  }
  updateEntry(id: any, entry: any) {
    return this.http.put(this.baseURL + '/' + id, entry, {responseType: 'text'});
  }
  deleteEntry(id: any) {
    return this.http.delete(this.baseURL + '/' + id, {responseType: 'text'});
  }
  getPage() {
    return this.http.get(this.baseURL + '/page');
  }
  exportCSV() :Observable<ArrayBuffer>{
    return this.http.get(this.baseURL + '/csv', {responseType: 'arraybuffer'});
  }
}
