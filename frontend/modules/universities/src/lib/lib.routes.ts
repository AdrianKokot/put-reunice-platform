import { Route } from "@angular/router";
import { UniversityListComponent } from "./features/university-list/university-list.component";
import { UniversityShellComponent } from "./features/university-shell/university-shell.component";
import { PageDetailsComponent } from "./features/page-details/page-details.component";

export const universitiesRoutes: Route[] = [
  {
    path: "",
    component: UniversityListComponent,
    title: "Uniwersytety"
  },
  {
    path: ":id",
    component: UniversityShellComponent,
    title: "Szczegóły uniwersytetu",
    children: [
      {
        path: "page/:pageId",
        component: PageDetailsComponent
      }
    ]
  }
];
