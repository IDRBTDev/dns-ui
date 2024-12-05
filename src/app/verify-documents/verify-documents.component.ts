import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-verify-documents',
  templateUrl: './verify-documents.component.html',
  styleUrls: ['./verify-documents.component.css']
})
export class VerifyDocumentsComponent implements OnInit {

  documentsList: any[];
  documentsListDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  role: string = localStorage.getItem('userRole');
  userEmailId = localStorage.getItem('email');
  searchText:String='';

  displayedColumns: string[] = [
    // 'checkbox',
    'id',
    'document',
    'documentType',
    'approveOrReject',
    'comment',
  ];

  constructor(){
    this.documentsListDataSource = new MatTableDataSource<any>();
  }

  async ngOnInit(): Promise<void> {
    
  }

}
