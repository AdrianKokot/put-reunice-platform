import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    HostBinding,
    HostListener,
    Inject,
    Input,
    Optional,
    Self,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {
    TUI_TEXTFIELD_APPEARANCE_DIRECTIVE,
    TuiAppearance,
    tuiAsDataListHost,
    tuiAsOptionContent,
    TuiButtonComponent,
    TuiButtonModule,
    TuiDataListComponent,
    TuiDataListDirective,
    TuiDataListHost,
    TuiDataListModule,
    tuiDropdownOptionsProvider,
    TuiHostedDropdownComponent,
    TuiHostedDropdownModule,
    tuiIsEditingKey,
    TuiLoaderModule,
    TuiPrimitiveTextfieldModule,
    TuiTextfieldAppearanceDirective,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
    AbstractTuiNullableControl,
    TuiActiveZoneDirective,
    TuiActiveZoneModule,
    tuiAsControl,
    tuiAsFocusableItemAccessor,
    TuiContextWithImplicit,
    TuiElementModule,
    TuiFocusableElementAccessor,
    TuiLetModule,
    TuiNativeFocusableElement,
} from '@taiga-ui/cdk';
import {ResourceSearchWrapper} from '../../util/resource-search-wrapper';
import {TUI_SELECT_OPTION} from '@taiga-ui/kit';
import {BaseResource} from '@reunice/modules/shared/data-access';
import {NgControl} from '@angular/forms';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@Component({
    selector: 'reunice-table-filter',
    templateUrl: './table-filter.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    styleUrls: ['./table-filter.component.less'],
    imports: [
        CommonModule,
        TuiDataListModule,
        TuiLetModule,
        TuiElementModule,
        TuiPrimitiveTextfieldModule,
        TuiTextfieldControllerModule,
        TranslateModule,
        TuiActiveZoneModule,
        TuiButtonModule,
        TuiHostedDropdownModule,
        TuiLoaderModule,
    ],
    providers: [
        tuiAsFocusableItemAccessor(TableFilterComponent),
        tuiAsDataListHost(TableFilterComponent),
        tuiAsControl(TableFilterComponent),
        tuiAsOptionContent(TUI_SELECT_OPTION),
        {
            provide: TUI_TEXTFIELD_APPEARANCE_DIRECTIVE,
            useFactory: (): TuiTextfieldAppearanceDirective => {
                const directive = new TuiTextfieldAppearanceDirective();

                directive.appearance = TuiAppearance.Textfield;

                return directive;
            },
        },
    ],
    viewProviders: [
        tuiDropdownOptionsProvider({
            align: 'right',
            limitWidth: 'fixed',
            maxHeight: 203,
        }),
    ],
})
export class TableFilterComponent<T extends BaseResource = BaseResource>
    extends AbstractTuiNullableControl<T>
    implements TuiFocusableElementAccessor, TuiDataListHost<T> {
    @ViewChild(TuiHostedDropdownComponent)
    private readonly hostedDropdown?: TuiHostedDropdownComponent;

    @ViewChild(TuiButtonComponent)
    private readonly button?: TuiButtonComponent;

    @Input()
    searchWrapper: ResourceSearchWrapper<T> | null = null;

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        event.stopPropagation();
    }

    @ContentChild(TuiDataListDirective, {read: TemplateRef})
    readonly datalist: PolymorpheusContent<
        TuiContextWithImplicit<TuiActiveZoneDirective>
    >;

    @ViewChild(TuiDataListComponent)
    private readonly list?: TuiDataListComponent<T>;

    @HostBinding('class._open')
    open = false;

    @HostBinding('class._applied-filter')
    appliedFilter = false;

    focused = false;

    get nativeFocusableElement(): TuiNativeFocusableElement | null {
        return this.button?.nativeFocusableElement ?? null;
    }

    constructor(
        @Optional()
        @Self()
        @Inject(NgControl)
            control: NgControl | null,
        @Inject(ChangeDetectorRef) cdr: ChangeDetectorRef,
    ) {
        super(control, cdr);
    }

    onKeyDown(key: string, element: HTMLElement | null): void {
        if (element && tuiIsEditingKey(key)) {
            element.focus({preventScroll: true});
        }
    }

    onArrowDown(event: Event) {
        this.list?.onFocus(event, true);
    }

    onActiveZone(active: boolean): void {
        this.updateFocused(active);
    }

    handleOption(item: T): void {
        if (this.value == item) {
            this.value = null;
            this.appliedFilter = false;
        } else {
            this.value = item;
            this.appliedFilter = true;
        }
        this.hostedDropdown?.nativeFocusableElement?.focus();
        this.hostedDropdown?.nativeFocusableElement?.blur();
        this.hostedDropdown?.updateOpen(false);
        this.cdr.markForCheck();
    }
}
