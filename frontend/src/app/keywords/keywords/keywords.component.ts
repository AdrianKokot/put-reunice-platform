import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Keyword } from 'modules/shared/data-access/src/lib/models/keyword';

import { KeyWordsService } from 'modules/shared/data-access/src/lib/services/key-words.service';

import { UserService } from 'modules/shared/data-access/src/lib/services/user.service';
import { DialogInputKeywordsComponent } from '../dialog-input-keywords/dialog-input-keywords.component';
import { DialogService } from '../../../assets/service/dialog.service';

@Component({
  selector: 'reunice-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss'],
})
export class KeywordsComponent implements OnInit {
  public selectedKeyword: Keyword = { id: -1, word: '' };
  public allKeyWords: Keyword[] = [];
  isEditMode = false;

  constructor(
    private dialogService: DialogService,
    private keyWordsService: KeyWordsService,
    public userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadKeyWords();
  }

  loadKeyWords() {
    this.keyWordsService.getAllKeyWords().subscribe({
      next: (res) => {
        this.allKeyWords = res;
      },
    });
  }

  onKeywordClicked(id: number) {
    this.selectedKeyword = this.allKeyWords.find(
      (keyword) => keyword.id == id
    ) ?? { id: -1, word: '' };
  }

  onAddKeyword() {
    const dialogRef = this.dialog.open(DialogInputKeywordsComponent);

    dialogRef.afterClosed().subscribe((next) => {
      if (next) {
        this.keyWordsService.addKeyWord(next.word).subscribe({
          next: () => {
            this.loadKeyWords();
          },
        });
        this.selectedKeyword = { id: -1, word: '' };
      }
    });
  }

  onEditKeyword() {
    if (this.selectedKeyword.id < 0) return;
    const dialogRef = this.dialog.open(DialogInputKeywordsComponent, {
      data: {
        keyword: JSON.parse(JSON.stringify(this.selectedKeyword)),
      },
    });

    dialogRef.afterClosed().subscribe((next) => {
      if (next) {
        this.keyWordsService
          .modifyKeyWordWordField(next.id, next.word)
          .subscribe({
            next: () => {
              this.loadKeyWords();
            },
          });
        this.selectedKeyword = { id: -1, word: '' };
      }
    });
  }

  onDeleteKeyword() {
    if (this.selectedKeyword.id < 0) return;

    this.dialogService
      .openConfirmationDialog()
      .afterClosed()
      .subscribe((value) => {
        if (value && this.selectedKeyword) {
          this.allKeyWords = this.allKeyWords.filter((keyword) => {
            return keyword.id !== this.selectedKeyword?.id;
          });
          this.keyWordsService
            .deleteKeyWord(this.selectedKeyword.id)
            .subscribe({});
          this.selectedKeyword = { id: -1, word: '' };
        }
      });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }
}
