import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { autobind } from "core-decorators";
import { Observable } from "rxjs";

import { NotificationService } from "app/components/base/notifications";
import { SidebarRef } from "app/components/base/sidebar";
import { RangeValidatorDirective } from "app/components/base/validation";
import { DynamicForm } from "app/core";
import { Job, Pool } from "app/models";
import { JobCreateDto } from "app/models/dtos";
import { createJobFormToJsonData, jobToFormModel } from "app/models/forms";
import { JobService, PoolService } from "app/services";
import { RxListProxy } from "app/services/core";
import { Constants } from "app/utils";

@Component({
    selector: "bl-job-create-basic-dialog",
    templateUrl: "job-create-basic-dialog.html",
})
export class JobCreateBasicDialogComponent extends DynamicForm<Job, JobCreateDto> implements OnInit {
    public poolsData: RxListProxy<{}, Pool>;
    public constraintsGroup: FormGroup;
    public poolInfoGroup: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        public sidebarRef: SidebarRef<JobCreateBasicDialogComponent>,
        private jobService: JobService,
        private poolService: PoolService,
        private notificationService: NotificationService) {
        super(JobCreateDto);

        this.poolsData = this.poolService.list();
        const validation = Constants.forms.validation;
        this.constraintsGroup = this.formBuilder.group({
            maxTaskRetryCount: [
                0,
                new RangeValidatorDirective(validation.range.retry.min, validation.range.retry.max).validator,
            ],
        });

        this.poolInfoGroup = this.formBuilder.group({
            poolId: ["", Validators.required],
        });

        this.form = this.formBuilder.group({
            id: ["", [
                Validators.required,
                Validators.maxLength(validation.maxLength.id),
                Validators.pattern(validation.regex.id),
            ]],
            displayName: ["", Validators.maxLength(validation.maxLength.displayName)],
            priority: [
                0,
                new RangeValidatorDirective(validation.range.priority.min, validation.range.priority.max).validator,
            ],
            constraints: this.constraintsGroup,
            poolInfo: this.poolInfoGroup,
        });
    }

    public ngOnInit() {
        this.poolsData.fetchNext().subscribe((result) => {
            if (result.data && result.data.length > 0) {
                this.form.value.poolId = result.data[0].id;
            }
        });
    }

    public dtoToForm(job: JobCreateDto) {
        return jobToFormModel(job);
    }

    public formToDto(data: any): JobCreateDto {
        return createJobFormToJsonData(data);
    }

    @autobind()
    public submit(): Observable<any> {
        const job = this.getCurrentValue();
        const observable = this.jobService.add(job, {});
        observable.subscribe({
            next: () => {
                const id = job.id;
                this.jobService.onJobAdded.next(id);
                this.notificationService.success("Job added!", `Job '${id}' was created successfully!`);
            },
            error: () => null,
        });

        return observable;
    }

    public preSelectPool(poolId: string) {
        this.form.patchValue({ poolInfo: { poolId } });
    }
}
