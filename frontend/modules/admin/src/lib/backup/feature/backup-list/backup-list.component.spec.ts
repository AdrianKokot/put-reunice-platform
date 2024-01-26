import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackupListComponent } from './backup-list.component';
import { TestingModule } from '@eunice/testing';

describe(BackupListComponent.name, () => {
  let component: BackupListComponent;
  let fixture: ComponentFixture<BackupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, BackupListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
