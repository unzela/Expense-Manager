import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Type } from '../interfaces/Type';
import { EntryService } from '../entry.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.css']
})
export class NewEntryComponent {

  types: Type[] = [
    {value:true, display:'Expense'},
    {value:false, display:'Income'},
  ]

  constructor(private service:EntryService,private router: Router) { }

  entryForm = new FormGroup({
    description: new FormControl('', Validators.required),
    isExpense: new FormControl('', Validators.required),
    value: new FormControl('', Validators.required)
  })

  gotoEntries() {
    this.router.navigate(['/entries']);
  }

  onSubmit(){
    this.entryForm.value['value'] = parseFloat(this.entryForm.value['value']);
    this.service.createEntry(this.entryForm.value).subscribe((data) => {
      this.router.navigate(['/entries']);
      this.gotoEntries();
    })
  }

}
