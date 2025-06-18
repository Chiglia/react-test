import * as React from "react";
import { reduxForm, InjectedFormProps, change } from "redux-form";
import { FieldDomain, FieldSelectMultiple, FieldSwitch, FieldText } from "../../lib/form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RouteComponentProps } from "react-router";
import * as ProcessiActions from "../../redux/processi";
import { Row, Col } from "../../components/Ui";
import FormBase, { FormBaseState } from "../../components/FormBase";
import { validate } from "../../lib/form/validations";
import * as _ from "underscore";
import * as SkillFormActions from "../../redux/skillForm";
import { _isAuthorized } from "../../components/Authorize";
import { t } from "../../lib/translates/translate";
import FieldProcess from "../../fields/Process";
import { store } from "../../core";
import { isSwitchChecked } from "../../lib/form/fields/switch";
import UtilityService from "../../services/utility";
import { isBatchKeepAliveDelaySetted } from "../../lib/core/utils";

export interface ProcessiFormProps extends RouteComponentProps<void> {
  processi: any;
  actions: any;
  skillForm: SkillFormActions.StateProps;
  skillFormActions: SkillFormActions.Actions;
}
export interface ProcessiFormState extends FormBaseState {}

export const FORM_NAME = "processiForm";

export class ProcessiForm extends FormBase<
  InjectedFormProps & ProcessiFormProps,
  ProcessiFormState
> {
  schedulingType: string = "";

  constructor(props: any) {
    super(props, FORM_NAME);
  }

  isEditable() {
    return _isAuthorized("ProcessEditService", this.isNew() ? "I" : "U");
  }

  showProcessEMailUnplannable() {
    return (
      this.getFormValues().applicationScope === "P" &&
      isSwitchChecked(this.getFormValues().scheduler_YN)
    );
  }

  public renderForm() {
    return (
      <form id={FORM_NAME} onSubmit={this.props.handleSubmit}>
        <div className="FormLegend" style={{ marginTop: 0 }}>
          {t("pages.processi.form.general_data")}
        </div>
        <Row gutter={16}>
          <Col xs={12}>
            <FieldText
              name="processCode"
              label={t("models.process.processCode")}
              cols={[10, 14]}
              maxLength={20}
              readOnly={this.isEdit()}
              required
            />
          </Col>
          <Col xs={12}>
            <FieldText
              name="processName"
              label={t("models.process.processName")}
              cols={[10, 14]}
              maxLength={255}
              required
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={12}>
            <FieldDomain
              name="processStatus"
              domainKey="ProcessStatus"
              label={t("models.process.processStatus")}
              cols={[10, 14]}
              required
            />
          </Col>
          <Col xs={12}>
            <FieldSwitch
              name="authorization_YN"
              valueOnChecked="Y"
              valueOffChecked="N"
              label={t("models.process.authorization_YN")}
              cols={[10, 14]}
            />
          </Col>
        </Row>
        <FieldProcess
          name="processAliasCode"
          label={t("models.process.processAliasCode")}
          cols={[5, 19]}
        />
        <div className="FormLegend">{t("pages.processi.form.process_attributes")}</div>
        <Row gutter={16}>
          <Col xs={12}>
            <FieldText
              name="scriptName"
              label={t("models.process.scriptName")}
              cols={[10, 14]}
              maxLength={50}
              required
            />
          </Col>
          <Col xs={12}>
            <FieldDomain
              name="processLaunchMode"
              domainKey="ProcessLaunchMode"
              label={t("models.process.processLaunchMode")}
              cols={[10, 14]}
              required
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={12}>
            <FieldText
              name="jobChainParam"
              label={t("models.process.jobChainParam")}
              cols={[10, 14]}
              maxLength={128}
            />
          </Col>
          <Col xs={12}>
            <FieldSwitch
              name="applicationModule"
              valueOnChecked="S"
              valueOffChecked=""
              label={t("models.process.applicationModule")}
              cols={[10, 14]}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={12}>
            <FieldDomain
              name="applicationScope"
              domainKey="BatchApplicationScope"
              label={t("models.process.applicationScope")}
              cols={[10, 14]}
              onChange={(e: any) => {
                // Forzo Schedulatore in applicationTrigger
                store().dispatch(change(this.props.form, "scheduler_YN", "Y"));
                if (e.target.value === "W") {
                  store().dispatch(change(this.props.form, "scheduler_YN", "N"));
                  store().dispatch(change(this.props.form, "processEMailNoSchedulingFlg", "N"));
                }
                this.forceUpdate();
              }}
              required
            />
          </Col>
          <Col xs={12}>
            <FieldSwitch
              name="scheduler_YN"
              valueOnChecked="Y"
              valueOffChecked="N"
              label={t("models.process.scheduler_YN")}
              cols={[10, 14]}
              onChangeFunction={(e: any) => {
                if (!e) {
                  store().dispatch(change(this.props.form, "processEMailNoSchedulingFlg", "N"));
                }
                this.forceUpdate();
              }}
              disabled={
                this.getFormValues().applicationScope &&
                this.getFormValues().applicationScope === "W"
              }
            />
          </Col>
        </Row>
        {isBatchKeepAliveDelaySetted() ? (
          <Row gutter={16}>
            <Col xs={12}>
              <FieldSwitch
                name="processExeMonitor_YN"
                valueOnChecked="Y"
                valueOffChecked="N"
                label={t("models.process.processExeMonitor_YN")}
                cols={[10, 14]}
              />
            </Col>
          </Row>
        ) : (
          <></>
        )}
        <div className="FormLegend">{t("pages.processi.form.process_email")}</div>
        <Row gutter={16}>
          <Col xs={12}>
            <FieldSwitch
              name="processEMailStart_YN"
              valueOnChecked="Y"
              valueOffChecked="N"
              label={t("models.process.processEMailStart_YN")}
              cols={[10, 14]}
            />
          </Col>
          <Col xs={12}>
            <FieldDomain
              name="processEMailEndFlg"
              domainKey="EmailErrorSend"
              label={t("models.process.processEMailEndFlg")}
              cols={[10, 14]}
              required
            />
          </Col>
          <Col xs={12}>
            <FieldSwitch
              name="processEMailNoSchedulingFlg"
              valueOnChecked="Y"
              valueOffChecked="N"
              label={t("models.process.processEMailNoSchedulingFlg")}
              cols={[10, 14]}
              disabled={!this.showProcessEMailUnplannable()}
            />
          </Col>
        </Row>
        <div className="FormLegend">{t("pages.processi.form.semafori")}</div>
        <FieldSelectMultiple
          name="locksListObj"
          label={t("models.process.semafori")}
          searchFunction={() => {
            return new Promise((resolve, reject) => {
              UtilityService.listLocks().then((response: any) => {
                resolve(response);
              });
            });
          }}
          optionKey="lockCode"
          optionLabel="lockCode"
          cols={[5, 19]}
        />
        {this.renderFormActions()}
      </form>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    processi: state.processi,
    skillForm: state.skillForm,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(ProcessiActions.e as any, dispatch),
    skillFormActions: bindActionCreators(SkillFormActions as any, dispatch),
  };
}

export default reduxForm({
  form: FORM_NAME,
  validate,
})(
  connect<any, any, any>(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ProcessiForm)
);
