import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { PlanFlow } from 'app/modules/target-result/target-result.interface';
import { TargetResultService } from 'app/modules/target-result/target-result.service';
import { Actual, DocumentDetail, Plan, SubTarget } from 'app/shared/interfaces/document.interface';
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
  @Input() user: User;
  subTarget: SubTarget;

  isFilter: boolean;

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

  ngOnInit() {
    this.subTarget = this.document.targets.find(v => v.id === this.targetId)?.details.find(v => v.id === this.subTargetId);
  }

  ngOnChange() {

  }

  saveTargetEntry(plan: Plan, month: string) {
    if (!this.isDisplay(plan, parseInt(month)) || this.isFilter) return;

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

  checkAllSameStatus() {
    let allSameStatus = true;
    let status = '';
    for (let select of this.selection.selected) {
      const actual = select.plan.actuals.find(v => v.targetMonth === select.month);
      if (status === '') {
        status = actual.targetActualStatus;
      } else {
        if (status !== actual.targetActualStatus) {
          allSameStatus = false;
        }
      }
    }
    return allSameStatus;
  }

  checkAllCanReject() {
    for (let select of this.selection.selected) {
      const actual = select.plan.actuals.find(v => v.targetMonth === select.month);
      if (actual.targetActualStatus === 'TARGET_REPORTING') return false;
    }
    return true;
  }

  checkAllAcceptAndSameStatus() {
    let allAccept = true;
    let allSameStatus = true;
    let status = '';
    for (let select of this.selection.selected) {
      if (select.plan[`flowMonth${select.month}`] === PlanFlow.REJECT) {
        allAccept = false;
      }
      const actual = select.plan.actuals.find(v => v.targetMonth === select.month);
      if (status === '') {
        status = actual.targetActualStatus;
      } else {
        if (status !== actual.targetActualStatus) {
          allSameStatus = false;
        }
      }
    }
    return allAccept && allSameStatus;
  }

  checkAllRejectAndSameStatus() {
    let allReject = true;
    let allSameStatus = true;
    let status = '';
    for (let select of this.selection.selected) {
      if (select.plan[`flowMonth${select.month}`] === PlanFlow.ACCEPT) {
        allReject = false;
      }
      const actual = select.plan.actuals.find(v => v.targetMonth === select.month);
      if (status === '') {
        status = actual.targetActualStatus;
      } else {
        if (status !== actual.targetActualStatus) {
          allSameStatus = false;
        }
      }
    }
    return allReject && allSameStatus;
  }

  getActual(plan: Plan, month: number) {
    return plan.actuals.find(v => v.targetMonth === month);
  }

  checkPrivillege(actual: Actual) {
    if (!actual) return false;
    let canSubmit = false;
    let canReject = false;
    if (this.user && this.user.organizes && this.document) {
      let haveT01 = false;
      let haveT02 = false;
      let haveT03 = false;
      let haveT04 = false;
      const organize = this.user.organizes.find((v) => v.organizeCode === this.document.organizeCode);
      for (let role of organize.roles) {
        if (role.roleCode === 'T01') haveT01 = true;
        if (role.roleCode === 'T02') haveT02 = true;
        if (role.roleCode === 'T03') haveT03 = true;
        if (role.roleCode === 'T04') haveT04 = true;
      }

      if (actual.targetActualStatus === 'TARGET_REPORTING' && haveT01) {
        canSubmit = true;
      }
      if (actual.targetActualStatus === 'TARGET_WAIT_FOR_VERIFY' && haveT02) {
        canSubmit = true;
        canReject = true;
      }
      if (actual.targetActualStatus === 'TARGET_WAIT_FOR_APPROVE' && haveT03) {
        canSubmit = true;
        canReject = true;
      }
      if (actual.targetActualStatus === 'TARGET_WAIT_FOR_RELEASE' && haveT04) {
        canSubmit = true;
        canReject = true;
      }
    } else {
      canSubmit = false;
      canReject = false;
    }
    return canSubmit || canReject;
  }

  filter() {
    this.isFilter = true;
    return this.AtleastOneSelected();
  }

  cancelFilter() {
    this.isFilter = false;
  }

  isPlanIdSelected(plan: Plan) {
    return this.selection.selected.findIndex(v => v.plan.id === plan.id) !== -1;
  }

  isDisplay(plan: Plan, month: number) {
    return !this.isFilter || (this.isFilter && this.isElementSelected(month, plan));
  }

  AtleastOneSelected() {
    return this.plans.findIndex(v => this.selection.selected.findIndex(s => s.plan.id === v.id) !== -1) !== -1;
  }
}
