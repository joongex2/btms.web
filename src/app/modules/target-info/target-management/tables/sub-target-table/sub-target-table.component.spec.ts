import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTargetTableComponent } from './sub-target-table.component';

describe('SubTargetTableComponent', () => {
  let component: SubTargetTableComponent;
  let fixture: ComponentFixture<SubTargetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubTargetTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTargetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
