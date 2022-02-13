import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { EntryService } from '../entry.service';
import { EntryElement } from '../interfaces/EntryElement';
import { UpdateEntryComponent } from '../update-entry/update-entry.component';
//import 'rxjs/Rx';


 @Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
})
export class EntriesComponent implements OnInit {

  displayedColumns: string[] = ['Description', 'IsExpense', 'Value', 'Actions'];
  dataSource: any;

  id: any;
  route: any;
  pageNo: any;
  pagesize: any;
  sortDir: any;
  name: any;
  total: any;
  page: any;
  constructor(private service: EntryService, private dialog: MatDialog) { }

  ngOnInit(): void {

   this.pagesize=5;
    this.pageNo = 1;
    this.sortDir = true;
    this.name = "";
    this.service.getAll(this.pageNo, this.pagesize, this.sortDir, this.name).subscribe((data: any) => {
      this.total = data.data.length;
      this.dataSource = new MatTableDataSource<EntryElement>(
        data.data as EntryElement[]
      );
    });
    this.service.getPage().subscribe((data:any) =>{
      this.page = data;
    });
  }


  sortFunction(): void {
    this.sortDir = this.sortDir == false ? true : false;
    this.service.getAll(this.pageNo, this.pagesize, this.sortDir, this.name).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource<EntryElement>(
        data.data as EntryElement[]
      )
    });
  }

  onPaginate(pageEvent: PageEvent) {
    this.pagesize = +pageEvent.pageSize;
    this.pageNo = +pageEvent.pageIndex + 1;
    this.service.getAll(this.pageNo, this.pagesize, true, this.name).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource<EntryElement>(
        data.data as EntryElement[]
      );
    })
  }


  applyFilter(event: Event) {
    this.name = (event.target as HTMLInputElement).value;
    this.service.getAll(this.pageNo, this.pagesize, true, this.name).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource<EntryElement>(
        data.data as EntryElement[]
      );
    })

  }
  updateEntry(entry: any) {
    this.dialog.open(UpdateEntryComponent, {
      data: {
        id: entry.id,
        description: entry.description,
        isExpense: entry.isExpense,
        value: entry.value,
      },
    });
  }

  export(){
      this.service.exportCSV().subscribe((data) =>{
        console.log("hi");
    })
    //.catch
   
  }
}

