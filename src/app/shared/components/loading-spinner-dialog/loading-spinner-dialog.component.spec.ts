import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerDialogComponent } from './loading-spinner-dialog.component';

describe('LoadingSpinnerDialogComponent', () => {
  let component: LoadingSpinnerDialogComponent;
  let fixture: ComponentFixture<LoadingSpinnerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingSpinnerDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSpinnerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
