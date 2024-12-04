import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyDocumentsComponent } from './verify-documents.component';

describe('VerifyDocumentsComponent', () => {
  let component: VerifyDocumentsComponent;
  let fixture: ComponentFixture<VerifyDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyDocumentsComponent]
    });
    fixture = TestBed.createComponent(VerifyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
