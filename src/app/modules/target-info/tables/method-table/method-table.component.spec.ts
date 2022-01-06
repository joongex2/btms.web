import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodTableComponent } from './method-table.component';

describe('MethodTableComponent', () => {
  let component: MethodTableComponent;
  let fixture: ComponentFixture<MethodTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
