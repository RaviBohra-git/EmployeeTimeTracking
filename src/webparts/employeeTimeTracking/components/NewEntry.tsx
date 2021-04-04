import * as React from 'react';
import styles from './EmployeeTimeTracking.module.scss';
import { NewEntryProps, NewEntryState } from './IEmployeeTimeTrackingProps';
import {
  TextField,
  mergeStyleSets,
  FontWeights,
  getTheme,
  IconButton,
  IIconProps,
  Dropdown,
  PrimaryButton,
  DefaultButton,
  ProgressIndicator
} from 'office-ui-fabric-react/lib/';
import ReactQuill from 'react-quill';
require('react-quill/dist/quill.snow.css');
import commonUtility from '../components/DataUtility';
const util: commonUtility = new commonUtility();

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});
const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };
export default class NewEntry extends React.Component<NewEntryProps, NewEntryState> {
  constructor(props: NewEntryProps) {
    super(props);
    //state declaration
    this.state = {
      isLoaded: false,
      CategoryChoices: [],
      Title: '',
      Description: '',
      Category: '',
      Hours: '',
      OverTime: false,
      isValidationLable: false,
      validationMessage: '',
      isProgress: false
    };
  }

  /**
   * 
   * @param prevProps 
   * update on property change
   */
  public componentDidUpdate(prevProps) {
    if (prevProps["itemID"] != this.props.itemID) {
      this.componentDidMount();
    }
  }

  /**
   * Initial function of component
   */
  public async componentDidMount() {
    let itemObj;
    if (this.props.itemID) {
      itemObj = await util.getItemById(this.props.configuredListName, this.props.itemID);
      console.log(itemObj);
    }
    let choiceObj = await util.getCategoryChoices(this.props.configuredListName);
    let categoryChoices = [];
    choiceObj.Choices.map((choiceOption) => { categoryChoices.push({ key: choiceOption, text: choiceOption }); });
    let state: any = this.state;
    state.CategoryChoices = categoryChoices;
    if (itemObj) {
      state.Title = itemObj.Title;
      state.Description = itemObj.Description;
      state.Category = itemObj.Category;
      state.Hours = itemObj.Hours;
    }
    this.setState(state);
  }

  /**
   * 
   * @returns 
   * render Component
   */
  public render(): React.ReactElement<NewEntryProps> {
    return (
      <div>

        <div className={contentStyles.header}>
          <span>Insert Worked Hours</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={() => { this.props.closeModal(); }}
          />
        </div>
        {this.state.isProgress ? <ProgressIndicator /> : ''}
        {this.state.isValidationLable ? <div className={styles.validationMessage}>{this.state.validationMessage}</div> : ""}
        <div className={contentStyles.body}>
          <div className={styles.FieldSection}>
            <div className={styles.FieldTitle}>Title <span>*</span></div>
            <div><TextField onChange={(event, newValue) => { this.setState({ Title: newValue }); }} value={this.state.Title}></TextField></div>
          </div>

          <div className={styles.FieldSection}>
            <div className={styles.FieldTitle}>Description</div>
            <ReactQuill value={this.state.Description} onChange={this.onTextChange} ></ReactQuill>
          </div>

          <div className={styles.FieldSection}>
            <div className={styles.FieldTitle}>Category</div>
            <div><Dropdown onChange={(event, newValue: any) => { this.setState({ Category: newValue.key }); }} options={this.state.CategoryChoices} selectedKey={this.state.Category}></Dropdown></div>
          </div>

          <div className={styles.FieldSection}>
            <div className={styles.FieldTitle}>Hours <span>*</span></div>
            <div><TextField onChange={(event, newValue) => { this.setState({ Hours: newValue }); }} type="number" value={this.state.Hours}></TextField></div>
          </div>
          <br></br>

          <PrimaryButton value="Save" onClick={() => { this.onSaveClick(); }}>Save</PrimaryButton>{"  "}
          <DefaultButton value="Cancel" onClick={() => { this.props.closeModal(); }}>Cancel</DefaultButton>
        </div>
      </div>
    );
  }

  /**
   * reset all fields after save or cancel
   */
  private resetFields() {
    this.setState({
      Title: '',
      Description: '',
      Category: '',
      Hours: '',
      OverTime: false,
      isProgress: false
    });
  }

  /**
   * 
   * @param newText 
   * @returns 
   * on chaneg of description column
   */
  private onTextChange = (newText: string) => {
    this.setState({ Description: newText });
    return newText;
  }

  /**
   * Validation and Save items(Update and New Item)
   */
  private async onSaveClick() {
    let state: NewEntryState = this.state;
    if (!this.state.Title && !this.state.Hours) {
      this.setState({ isValidationLable: true, validationMessage: "Title and Hours fields are required!" });
    }
    else if (!this.state.Title) {
      this.setState({ isValidationLable: true, validationMessage: "Title field is required!" });
    }
    else if (!this.state.Hours) {
      this.setState({ isValidationLable: true, validationMessage: "Hours field is required!" });
    }
    else {
      await this.setState({ isValidationLable: false, validationMessage: '', isProgress: true });
      if (this.props.itemID) {
        await util.UpdateSPItem(this.props.configuredListName, this.props.itemID, this.state);
        this.resetFields();
        this.props.closeModal();
      }
      else {
        await util.AddSPItem(this.props.configuredListName, state);
        this.resetFields();
        this.props.closeModal();
      }
    }
  }
}
