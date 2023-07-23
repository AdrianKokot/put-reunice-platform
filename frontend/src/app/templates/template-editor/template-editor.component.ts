import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Template } from '../../../../modules/shared/data-access/src/lib/models/template';
import { TemplateService } from '../../../../modules/shared/data-access/src/lib/services/template.service';

@Component({
  selector: 'reunice-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
})
export class TemplateEditorComponent implements OnInit {
  public template?: Template;

  constructor(
    private templateService: TemplateService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('templateId'));
    if (id) {
      this.loadPage(id.valueOf());
    }
  }

  private loadPage(id: number) {
    this.templateService.getTemplate(id).subscribe((res) => {
      this.template = res;
    });
  }

  onSaved(content?: string) {
    if (content && this.template) {
      this.templateService
        .modifyTemplateContentField(this.template.id, content)
        .subscribe(() => {
          this.snackBar.open(
            'Szablon zapisany',
            this.translate.instant('CLOSE'),
            {
              duration: 2000,
            }
          );
        });
    }
  }
}
