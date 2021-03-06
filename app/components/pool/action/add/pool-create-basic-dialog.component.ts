import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { autobind } from "core-decorators";
import { Observable, Subscription } from "rxjs";

import { NotificationService } from "app/components/base/notifications";
import { SidebarRef } from "app/components/base/sidebar";
import { DynamicForm } from "app/core";
import { Pool } from "app/models";
import { PoolCreateDto } from "app/models/dtos";
import { PoolOsSources, createPoolToData, poolToFormModel } from "app/models/forms";
import { PoolService, VmSizeService } from "app/services";

@Component({
    selector: "bl-pool-create-basic-dialog",
    templateUrl: "pool-create-basic-dialog.html",
})
export class PoolCreateBasicDialogComponent extends DynamicForm<Pool, PoolCreateDto> implements OnDestroy {
    public createPoolForm: FormGroup;

    public osSource: PoolOsSources = PoolOsSources.IaaS;

    private _osControl: FormControl;
    private _sub: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        public sidebarRef: SidebarRef<PoolCreateBasicDialogComponent>,
        private poolService: PoolService,
        private vmSizeService: VmSizeService,
        private notificationService: NotificationService) {
        super(PoolCreateDto);

        this._osControl = this.formBuilder.control([{}, Validators.required]);

        this.form = this.formBuilder.group({
            id: ["", [
                Validators.required,
                Validators.maxLength(64),
                Validators.pattern("^[\\w\\_-]+$"),
            ]],
            displayName: "",
            targetDedicated: [0, Validators.required],
            os: this._osControl,
            vmSize: ["Standard_D1", Validators.required],
            maxTasksPerNode: 1,
            enableInterNodeCommunication: false,
        });
        this._sub = this._osControl.valueChanges.subscribe((value) => {
            this.osSource = value.source;
        });
    }

    public ngOnDestroy() {
        this._sub.unsubscribe();
    }

    @autobind()
    public submit(): Observable<any> {
        const id = this.form.value.id;
        const data = this.getCurrentValue();
        const obs = this.poolService.add(data);
        obs.do(() => {
            this.poolService.onPoolAdded.next(id);
            this.notificationService.success("Pool added!", `Pool '${id}' was created successfully!`);
        });

        return obs;
    }

    public dtoToForm(pool: PoolCreateDto) {
        return poolToFormModel(pool);
    }

    public formToDto(data: any): PoolCreateDto {
        return createPoolToData(data);
    }
}
