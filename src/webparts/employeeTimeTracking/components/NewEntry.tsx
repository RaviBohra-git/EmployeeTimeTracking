import * as React from 'react';
import styles from './EmployeeTimeTracking.module.scss';
import { NewEntryProps, NewEntryState } from './IEmployeeTimeTrackingProps';
import {
  TextField, mergeStyleSets, FontWeights, getTheme, IconButton,
  IIconProps,
  Dropdown, PrimaryButton, DefaultButton
} from 'office-ui-fabric-react/lib/';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
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
    // eslint-disable-next-line deprecation/deprecation
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
      OverTime: false
    };
  }

  public componentDidUpdate(prevProps) {
    if (prevProps["itemID"] != this.props.itemID) {
      this.componentDidMount();
    }
  }

  public async componentDidMount() {
    let itemObj;
    if (this.props.itemID) {
      itemObj = await util.getItemById(this.props.configuredListName, this.props.itemID);
      console.log(itemObj);
    }
    let choiceObj = await util.getCategoryChoices(this.props.configuredListName);
    let categoryChoices = [];
    choiceObj.Choices.map((choiceOption) => { categoryChoices.push({ key: choiceOption, text: choiceOption }); });
    //console.log(choices);
    let state: any = this.state;
    state.CategoryChoices = categoryChoices;
    if (itemObj) {
      state.Title = itemObj.Title;
      state.Description = itemObj.Title;
      state.Category = itemObj.Category;
      state.Hours = itemObj.Hours;
    }
    this.setState(state);
  }

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

        <div className={contentStyles.body}>
          <div>
            <div>Title</div>
            <div><TextField onChange={(event, newValue) => { this.setState({ Title: newValue }); }} value={this.state.Title}></TextField></div>
          </div>

          <div>
            <div>Description</div>
            <div><TextField multiline value={this.state.Description}></TextField></div>
            {/* <div><RichText value={this.state.Description}  onChange={(text)=>{this.setState({Description:text});return text;}}/></div> */}
          </div>

          <div>
            <div>Category</div>
            <div><Dropdown onChange={(event, newValue: any) => { this.setState({ Category: newValue.key }); }} options={this.state.CategoryChoices} selectedKey={this.state.Category}></Dropdown></div>
          </div>

          <div>
            <div>Hours</div>
            <div><TextField onChange={(event, newValue) => { this.setState({ Hours: newValue }); }} type="number" value={this.state.Hours}></TextField></div>
          </div>
          <br></br>

          <PrimaryButton value="Save" onClick={() => { this.onSaveClick(); }}>Save</PrimaryButton>{"  "}
          <DefaultButton value="Cancel" onClick={() => { this.props.closeModal(); }}>Cancel</DefaultButton>
        </div>
      </div>
    );
  }

  private resetFields() {
    this.setState({
      Title: '',
      Description: '',
      Category: '',
      Hours: '',
      OverTime: false
    });
  }

  // private onFieldValueChange(stateName,value){
  //   let state:any = this.state;
  //   state[stateName] = value;
  //   this.setState(state);
  // }

  private async onSaveClick() {
    let state: NewEntryState = this.state;
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
