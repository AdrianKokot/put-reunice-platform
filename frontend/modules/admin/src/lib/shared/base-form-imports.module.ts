import {NgModule} from "@angular/core";
import {TuiFieldErrorPipeModule, TuiInputModule, TuiSelectModule, TuiTextAreaModule} from "@taiga-ui/kit";
import {ReactiveFormsModule} from "@angular/forms";
import {
    TuiButtonModule,
    TuiDataListModule,
    TuiErrorModule,
    TuiLabelModule,
    TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";

const modules = [CommonModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiLabelModule,
    TranslateModule,
    RouterLink,
    TuiButtonModule,
    TuiDataListModule,
    TuiSelectModule,
    TuiTextAreaModule
];

@NgModule({
    imports: modules,
    exports: modules
})
export class BaseFormImportsModule {

}