import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgRoleTreeComponent } from './org-role-tree.component';


describe('OrgRoleTreeComponent', () => {
  let component: OrgRoleTreeComponent;
  let fixture: ComponentFixture<OrgRoleTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrgRoleTreeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgRoleTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
