import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseTableComponent } from './cause-table.component';

describe('CauseTableComponent', () => {
  let component: CauseTableComponent;
  let fixture: ComponentFixture<CauseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauseTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
