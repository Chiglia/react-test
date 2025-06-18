import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Modal from "../../components/Modal/Modal";
import SkillPageComponent, {
  SkillPageComponentProps,
} from "../../components/SkillPageComponent/SkillPageComponent";
import { Record } from "../../lib/core/record";
import { getModalWidth } from "../../lib/core/utils";
import { getFormData } from "../../lib/form/form";
import { _formMode } from "../../lib/form/utils";
import { JOBS_PAGE_PROCESSI } from "../../lib/jobs/pages";
import { t } from "../../lib/translates/translate";
import * as ApplicationActions from "../../redux/application";
import * as ProcessiActions from "../../redux/processi";
import * as SkillFormActions from "../../redux/skillForm";
import { ProcessService } from "../../services";
import Form, { FORM_NAME as FORM_NAME_EDIT, ProcessiForm as ProcessiFormClass } from "./Form";
import Grid, { Grid as GridClass } from "./Grid";

export interface ProcessiPageProps extends SkillPageComponentProps {
  processi: any;
  actions: any;
  application: ApplicationActions.StateProps;
  applicationActions: ApplicationActions.Actions;
  skillForm: SkillFormActions.StateProps;
  skillFormActions: SkillFormActions.Actions;
}
export interface ProcessiPageState {}

class ProcessiPage extends SkillPageComponent<ProcessiPageProps, ProcessiPageState> {
  gridInstance: any;
  formEditWrapper: any;

  constructor(props: any) {
    super(props, { menuKey: JOBS_PAGE_PROCESSI });
    this.triggerFormEditWrapper = this.triggerFormEditWrapper.bind(this);
  }
  _componentDidMount() {
    this.props.actions.initPage();
  }

  // Form
  addRecord() {
    this.props.skillFormActions.newRecord(FORM_NAME_EDIT, new Record({}));
  }

  handleSubmitForm(data: any) {
    var data = getFormData(data, FORM_NAME_EDIT);
    const promise =
      _formMode(this.formInstance()) === "new"
        ? ProcessService.create(data)
        : ProcessService.update(data.processCode, data);
    this.props.skillFormActions.formSave(FORM_NAME_EDIT, promise).then(() => {
      this.props.applicationActions.toggleSection(FORM_NAME_EDIT, false);
      (this.gridInstance.wrappedInstance as GridClass)._loadDataAndInitGrid();
    });
  }

  triggerFormEditWrapper() {
    let formEditWrapper = this.formEditWrapper.wrappedInstance.wrappedInstance as ProcessiFormClass;
    formEditWrapper.undoHandle();
  }

  formInstance() {
    return this.props.skillForm.forms[FORM_NAME_EDIT] || {};
  }

  // Render
  renderContent() {
    return (
      <>
        <Grid
          ref={(instance: any) => (this.gridInstance = instance)}
          functionLoadData={this.props.actions.loadListItems}
        />
        <Modal
          width={getModalWidth(1000, 95)}
          title={t("pages.processi." + _formMode(this.formInstance()))}
          visible={this.props.application.toggle_section[FORM_NAME_EDIT]}
          footer={null}
          onCancel={this.triggerFormEditWrapper}>
          <Form
            ref={(instance: any) => (this.formEditWrapper = instance)}
            onSubmit={(data: any) => this.handleSubmitForm(data)}
          />
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    processi: state.processi,
    application: state.application,
    skillForm: state.skillForm,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(ProcessiActions.e as any, dispatch),
    applicationActions: bindActionCreators(ApplicationActions as any, dispatch),
    skillFormActions: bindActionCreators(SkillFormActions as any, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessiPage);
