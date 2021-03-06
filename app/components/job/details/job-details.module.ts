import { NgModule } from "@angular/core";

import { commonModules } from "app/common";
import { BaseModule } from "app/components/base";
import { FileBrowseModule } from "app/components/file/browse";
import { FileDetailsModule } from "app/components/file/details";
import { TaskBrowseModule } from "app/components/task/browse";
import { JobErrorDisplayComponent } from "./error-display";
import { JobConfigurationComponent } from "./job-configuration.component";
import { JobDefaultComponent } from "./job-default.component";
import { JobDetailsComponent } from "./job-details.component";
import { JobProgressStatusComponent } from "./job-progress-status";

const components = [
    JobConfigurationComponent,
    JobDefaultComponent,
    JobDetailsComponent,
    JobErrorDisplayComponent,
    JobProgressStatusComponent,
];

const modules = [
    BaseModule, FileBrowseModule, FileDetailsModule, TaskBrowseModule,
];

@NgModule({
    declarations: components,
    exports: components,
    imports: [
        ...commonModules,
        ...modules,
    ],
})
export class JobDetailsModule {
}
