import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetujLozinkuComponent } from './resetuj-lozinku.component';

describe('ResetujLozinkuComponent', () => {
  let component: ResetujLozinkuComponent;
  let fixture: ComponentFixture<ResetujLozinkuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetujLozinkuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetujLozinkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
