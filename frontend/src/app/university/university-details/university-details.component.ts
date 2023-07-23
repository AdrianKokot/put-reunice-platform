import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { University } from 'modules/shared/data-access/src/lib/models/university';
import { DialogService } from 'src/assets/service/dialog.service';
import { UniversityService } from 'modules/shared/data-access/src/lib/services/university.service';
import { PageCardConfig } from '../../page/page-card/page-card.component';
import { UserCardConfig } from '../../user/user-card/user-card.component';
import { UniversityCardConfig } from '../university-card/university-card.component';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { PageService } from '../../../../modules/shared/data-access/src/lib/services/page.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUniversityCreateComponent } from '../dialog-university-create/dialog-university-create.component';
import { TranslateService } from '@ngx-translate/core';
import { SecurityService } from '../../../../modules/shared/data-access/src/lib/services/security.service';

@Component({
  selector: 'reunice-university-details',
  templateUrl: './university-details.component.html',
  styleUrls: ['./university-details.component.scss'],
})
export class UniversityDetailsComponent implements OnInit {
  public university!: University;
  public id = 0;

  userCardConfig: UserCardConfig = {
    useSecondaryColor: true,
    showLink: true,
  };

  secondaryCardConfig: PageCardConfig = {
    useSecondaryColor: true,
    showLink: true,
    showDescription: true,
    showUniversity: false,
    showCreatedOn: true,
    showAuthor: true,
  };
  universityCardConfig: UniversityCardConfig = {
    useSecondaryColor: false,
    showLink: false,
    showDescription: true,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private universityService: UniversityService,
    private pageService: PageService,
    public securityService: SecurityService,
    private dialogService: DialogService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('universityId'));
    this.loadUniversity();
  }

  loadUniversity() {
    this.universityService.getUniversity(this.id).subscribe({
      next: (res) => {
        this.university = res;
      },
    });
  }

  hiddenUniversity() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: this.translate.instant('HIDING') + ': ' + this.university.name,
          description: this.translate.instant('HIDE_DESCRIPTION'),
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.universityService
            .modifyUniversityHiddenField(
              this.university.id,
              !this.university.hidden
            )
            .subscribe(() => {
              this.university.hidden = !this.university.hidden;
              this.dialogService.openSuccessDialog(
                this.translate.instant('HIDING_CONFIRMATION')
              );
            });
        }
      });
  }

  deleteUniversity() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title:
            this.translate.instant('DELETING') + ' ' + this.university.name,
          description: this.translate.instant('UNIVERSITY_DELETE_DESCRIPTION'),
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.universityService
            .deleteUniversity(this.university.id)
            .subscribe({
              next: () => {
                this.dialogService.openSuccessDialog(
                  this.translate.instant('DELETE_UNIVERSITY_CONFIRMATION')
                );
                this.router.navigateByUrl('/universities');
              },
            });
        }
      });
  }

  startEdit() {
    const dialogData = {
      data: {
        edit: true,
        university: this.university,
      },
    };
    const dialogRef = this.dialog.open(
      DialogUniversityCreateComponent,
      dialogData
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.university = res;
        this.dialogService.openSuccessDialog(
          this.translate.instant('EDIT_UNIVERSITY_SUCCESS')
        );
      }
    });
  }
}
