import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameServerFormComponent } from './name-server-form.component';

describe('NameServerFormComponent', () => {
  let component: NameServerFormComponent;
  let fixture: ComponentFixture<NameServerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NameServerFormComponent]
    });
    fixture = TestBed.createComponent(NameServerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
