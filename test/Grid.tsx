import * as ProcessCheckActions from "../../redux/wrapperProcessCheck";
import * as ApplicationActions from "../../redux/application";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { t } from "../../lib/translates/translate";
import { FORM_NAME } from "./Form";
import { _isAuthorized } from "../../components/Authorize";
import ManageList, { ManageListProps } from "../../components/ManageList/ManageList";
import * as AgGridColumn from "../../lib/aggrid/ag_grid_column";
import * as SkillFormActions from "../../redux/skillForm";
import { confirmDelete } from "../../components/GridActions/GridActions";
import { Record } from "../../lib/core/record";

export interface GridProps extends ManageListProps {
  actions: any;
  applicationActions: ApplicationActions.Actions;
  skillForm: SkillFormActions.StateProps;
  skillFormActions: SkillFormActions.Actions;
  forceProcess?: string;
  serviceImplementation: any;
}

export interface GridState {}

const ID_GRID = "processChecksGrid";
const TEST_FIELD_KEY = "objectToCheck";

export class Grid extends ManageList<GridProps, GridState> {
  state = {};

  constructor(props: GridProps) {
    super(props, ID_GRID, "ProcessCheck", {
      listTitle: t("pages.process_checks.grid_title"),
      exportData: {
        downloadList: props.serviceImplementation.downloadList,
      },
    });
  }

  allowEditDelete(record: any) {
    if (this.props.forceProcess) {
      return record.processCode === this.props.forceProcess;
    } else {
      return true;
    }
  }

  gridCustomColumns() {
    return [
      AgGridColumn.actionEdit(
        {
          isColumnVisible: () => {
            const [serviceName, funOpt] = this.props.serviceImplementation.findAuthorization;
            return _isAuthorized(serviceName, funOpt);
          },
          isIconRenderable: (record: any) => {
            return this.allowEditDelete(record);
          },
          _onCellClicked: (args: any) => {
            return this.editAction(args.data);
          },
        },
        TEST_FIELD_KEY
      ),
      AgGridColumn.actionDelete(
        {
          isColumnVisible: () => {
            const [serviceName, funOpt] = this.props.serviceImplementation.deleteAuthorization;
            return _isAuthorized(serviceName, funOpt);
          },
          isIconRenderable: (record: any) => {
            return this.allowEditDelete(record);
          },
          _onCellClicked: (args: any) => {
            this.deleteAction(args.data);
          },
        },
        TEST_FIELD_KEY
      ),
    ];
  }

  editAction(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.props.serviceImplementation.find(data).then((response: any) => {
        resolve(response);
      });
    });
    return this.props.skillFormActions.editRecord(FORM_NAME, data, promise);
  }

  deleteAction(data: any) {
    confirmDelete({
      onOk: () => {
        return this.props.serviceImplementation.delete(data).then(() => {
          this._loadDataAndInitGrid();
        });
      },
    });
  }

  addRecord() {
    this.props.skillFormActions.newRecord(
      FORM_NAME,
      new Record({
        processCheckDelayToEnd: 0,
        processCode: this.props.forceProcess,
        checkType: "F",
      })
    );
  }

  isAddActionVisible() {
    const [serviceName, funOpt] = this.props.serviceImplementation.createAuthorization;
    return _isAuthorized(serviceName, funOpt);
  }

  getDataKey() {
    const prefix = this.props.functionAddParams.prefix;
    return `data.${prefix}.list`;
  }
}

function mapStateToProps(state: any) {
  return {
    data: state.wrapperProcessCheck,
    skillForm: state.skillForm,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(ProcessCheckActions.e as any, dispatch),
    applicationActions: bindActionCreators(ApplicationActions as any, dispatch),
    skillFormActions: bindActionCreators(SkillFormActions as any, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Grid);
