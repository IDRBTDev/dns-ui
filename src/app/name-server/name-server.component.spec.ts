import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameServerComponent } from './name-server.component';

describe('NameServerComponent', () => {
  let component: NameServerComponent;
  let fixture: ComponentFixture<NameServerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NameServerComponent]
    });
    fixture = TestBed.createComponent(NameServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
