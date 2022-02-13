import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Type } from '../interfaces/Type';
import { EntryService } from '../entry.service';

@Component({
  selector: 'app-update-entry',
  templateUrl: './update-entry.component.html',
  styleUrls: ['./update-entry.component.css'],
})
export class UpdateEntryComponent implements OnInit {
  form: FormGroup;
  id: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service:EntryService,
    private dialogRef: MatDialogRef<UpdateEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
    this.form = fb.group({
      description: [data.description, Validators.required],
      isExpense: [data.isExpense, Validators.required],
      value: [data.value, Validators.required],
    });
  }

  types: Type[] = [
    { value: true, display: 'Expense' },
    { value: false, display: 'Income' },
  ];

  close(){
    this.dialogRef.close();
  }
  save(){
    this.form.value.id = this.id;
    this.form.value['value'] =  Number(this.form.value['value']);
    this.service.updateEntry(this.id, this.form.value).subscribe((data) => {
      this.dialogRef.close();
      this.router.navigate(['/entries']);
      window.location.reload();
    })
  }

  ngOnInit() {
    
  }
}
