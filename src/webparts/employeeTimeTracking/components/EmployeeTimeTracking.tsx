import * as React from 'react';
import { IEmployeeTimeTrackingProps, IEmployeeTimeTrackingState } from './IEmployeeTimeTrackingProps';
import {
  CommandBar, ICommandBarItemProps,
  Modal,
  mergeStyleSets,
  FontWeights,
  getTheme,
  Dialog, DialogType, DialogFooter, PrimaryButton, DefaultButton
} from 'office-ui-fabric-react/lib/';
import TimeEntriesGrid from './TimeEntriesGrid';
import NewEntry from './NewEntry';
import commonUtility from '../components/DataUtility';
const util: commonUtility = new commonUtility();

export default class EmployeeTimeTracking extends React.Component<IEmployeeTimeTrackingProps, IEmployeeTimeTrackingState> {
  constructor(props: IEmployeeTimeTrackingProps) {
    super(props);
    //state declaration
    this.state = {
      isLoaded: false,
      items: [],
      isItemSelected: false,
      selectedItemID: '',
      isModalOpen: false,
      isDialogOpen: false,
      dialogTitle: '',
      dialogmessage: '',
      isWarning: false
    };
  }

  /**
   * Initial function of component
   */
  public async componentDidMount() {
    let items = await util.getAllItems(this.props.configuredListName);
    this.setState({ items: items });
  }

  /**
   * 
   * @param prevProps 
   * update on property change
   */
  public componentDidUpdate(prevProps) {
    if (prevProps["configuredListName"] != this.props.configuredListName) {
      this.componentDidMount();
    }
  }

  /**
   * 
   * @returns 
   * render Component
   */
  public render(): React.ReactElement<IEmployeeTimeTrackingProps> {
    return (
      <div>
        {this.renderCommandbar()}
        <br></br>
        <TimeEntriesGrid selectItem={(ItemID, selected) => { this.setState({ selectedItemID: ItemID, isItemSelected: selected }); }} items={this.state.items}></TimeEntriesGrid>
        {this.renderModal()}
        {this.renderDialog()}
      </div>
    );
  }

  /**
   * 
   * @returns 
   * render commandbar
   */
  private renderCommandbar() {
    const _items: ICommandBarItemProps[] = [
      {
        key: 'newItem',
        text: 'New',
        cacheKey: 'myCacheKey',
        iconProps: { iconName: 'Add' },
        disabled: this.state.isItemSelected,
        onClick: () => { this.setState({ isModalOpen: true }); },

      },
      {
        key: 'Edit Item',
        text: 'Edit',
        cacheKey: 'myCacheKey',
        iconProps: { iconName: 'Edit' },
        disabled: !this.state.isItemSelected,
        onClick: () => { this.setState({ isModalOpen: true }); },
      }
      ,
      {
        key: 'Delete Item',
        text: 'Delete',
        cacheKey: 'myCacheKey',
        iconProps: { iconName: 'Delete' },
        disabled: !this.state.isItemSelected,
        onClick: () => { this.setState({ isDialogOpen: true, dialogTitle: 'Delete Confirmation', dialogmessage: 'Item will be deleted permanently!' }); },
      }
    ];

    return (<CommandBar items={_items} />);
  }

  /**
   * 
   * @returns 
   * render dialogbox
   */
  private renderDialog() {
    return (
      <Dialog
        hidden={!this.state.isDialogOpen}
        onDismiss={() => { this.setState({ isDialogOpen: false }); }}
        dialogContentProps={{
          type: DialogType.normal,
          title: this.state.dialogTitle,
          subText: this.state.dialogmessage,
        }}
        modalProps={{
          isBlocking: true,
          styles: { main: { maxWidth: 450 } },
        }}
      >
        {this.state.isWarning ?
          <DialogFooter>
            <PrimaryButton onClick={() => { this.closeDialog(); }} text="Ok" />
          </DialogFooter>
          : <DialogFooter>
            <PrimaryButton onClick={() => this.deleteItem()} text="Confirm" />
            <DefaultButton onClick={() => this.closeDialog()} text="Cancel" />
          </DialogFooter>}
      </Dialog>
    );
  }

  /**
   * 
   * @returns 
   * render modal popup
   */
  private renderModal() {
    const theme = getTheme();
    const contentStyles = mergeStyleSets({
      container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        width: '500px'
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
    return (
      <Modal isBlocking={true} containerClassName={contentStyles.container} isModeless={false} isOpen={this.state.isModalOpen} onDismissed={() => { this.setState({ isModalOpen: false }); }}>
        <NewEntry configuredListName={this.props.configuredListName} closeModal={() => { this.closeModal(); }} itemID={this.state.selectedItemID}></NewEntry>
      </Modal>
    );
  }

  /**
   * close modal popup
   */
  private async closeModal() {
    await this.setState({ isModalOpen: false });
    this.componentDidMount();
  }

  /**
   * close dialog
   */
  private closeDialog() {
    this.setState({ isDialogOpen: false, dialogTitle: '', dialogmessage: '' });
    this.componentDidMount();
  }

  /**
   * delete item
   */
  private async deleteItem() {
    await util.DeleteSPItem(this.props.configuredListName, this.state.selectedItemID);
    this.setState({ isDialogOpen: false, isItemSelected: false, selectedItemID: null });
    this.componentDidMount();
  }
}

