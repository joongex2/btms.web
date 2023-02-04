import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanFlow } from 'app/modules/target-result/target-result.interface';
import { TargetResultService } from 'app/modules/target-result/target-result.service';
import { DocumentDetail, Plan } from 'app/shared/interfaces/document.interface';
import * as _ from 'lodash';

@Component({
  selector: 'app-plan-entry-table',
  templateUrl: './plan-entry-table.component.html',
  styleUrls: ['./plan-entry-table.component.scss']
})
export class PlanEntryTableComponent implements OnInit {
  @Input() plans: Plan[];
  @Input() documentId: number;
  @Input() targetId: number;
  @Input() subTargetId: number;
  @Input() document: Partial<DocumentDetail>;

  planHeader = ['planDescription', 'planYear', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'undertaker'];
  planRow1 = ['planDescription', 'planYear', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'undertaker'];
  planRow2 = ['jan2', 'feb2', 'mar2', 'apr2', 'may2', 'jun2', 'jul2', 'aug2', 'sep2', 'oct2', 'nov2', 'dec2'];
  months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  PlanFlow = PlanFlow;

  selection = new SelectionModel<{ month: number, plan: Plan }>(true, []);

  JSON = JSON;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _targetResultService: TargetResultService
  ) { }

  ngOnInit(): void { }

  saveTargetEntry(plan: Plan, month: string) {
    this._targetResultService.targetSaveData = {
      documentId: this.documentId,
      targetId: this.targetId,
      subTargetId: this.subTargetId,
      planId: plan.id,
      month
    }
    this._router.navigate([`plans/${plan.id}/month/${month}`], { relativeTo: this._activatedRoute });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  toggleElement(month: number, plan: Plan) {
    const findElement = this.isElementSelected(month, plan);
    if (findElement) {
      this.selection.toggle(findElement)
    } else {
      // create new
      this.selection.toggle({ month, plan });
    }
    this._targetResultService.planMonthToggle();
  }

  isElementSelected(month: number, plan: Plan) {
    return this.selection.selected.find(v => _.isEqual(v, { month, plan }));
  }

  checkAllAccept() {
    let allAccept = true;
    for (let select of this.selection.selected) {
      if (select.plan[`flowMonth${select.month}`] === PlanFlow.REJECT) {
        allAccept = false;
      }
    }
    return allAccept;
  }

  checkAllReject() {
    let allReject = true;
    for (let select of this.selection.selected) {
      if (select.plan[`flowMonth${select.month}`] === PlanFlow.ACCEPT) {
        allReject = false;
      }
    }
    return allReject;
  }
}
