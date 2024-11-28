import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitService } from './submit.service';

describe('ServiceTsComponent', () => {
  let component: SubmitService;
  let fixture: ComponentFixture<SubmitService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitService]
    });
    fixture = TestBed.createComponent(SubmitService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
