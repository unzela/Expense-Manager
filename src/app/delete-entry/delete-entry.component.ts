import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryService } from '../entry.service';

@Component({
  selector: 'app-delete-entry',
  templateUrl: './delete-entry.component.html',
  styleUrls: ['./delete-entry.component.css'],
})
export class DeleteEntryComponent implements OnInit {
  entry = {
    description: '',
    value: 0,
    isExpense: false,
  };
  id: any;

  constructor(
    private route: ActivatedRoute,
    private service: EntryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.service.getEntry(this.id).subscribe((data: any) => {
      this.entry.description = data.description;
      this.entry.isExpense = data.isExpense;
      this.entry.value = data.value;
    });
  }

  cancel() {
    this.router.navigate(['/entries']);
  }

  confirm() {
    this.service.deleteEntry(this.id).subscribe((data) => {
      this.router.navigate(['/entries']);
    });
  }
}
