import * as React from 'react';
import styles from './EmployeeTimeTracking.module.scss';
import { NewEntryProps, NewEntryState } from './IEmployeeTimeTrackingProps';
import { TextField, mergeStyleSets,  FontWeights, getTheme, IconButton,
  IIconProps,
  Dropdown,PrimaryButton,DefaultButton} from 'office-ui-fabric-react/lib/';
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
      Title: '',
      Description: '',
      Category: '',
      Hours: null,
      OverTime: false
    };
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
            onClick={()=>{this.props.closeModal();}}
          />
        </div>

        <div className={contentStyles.body}>
        <div>
          <div>Title</div>
          <div><TextField value={this.state.Title}></TextField></div>
        </div>

        <div>
          <div>Description</div>
          <div><TextField multiline value={this.state.Description}></TextField></div>
        </div>

        <div>
          <div>Category</div>
          <div><Dropdown options={this.props.CategoryChoices} selectedKey={this.state.Category}></Dropdown></div>
        </div>
        <br></br>

        <PrimaryButton value="Save">Save</PrimaryButton>{"  "}
        <DefaultButton value="Cancel">Cancel</DefaultButton>
        </div>
      </div>
    );
  }
}
