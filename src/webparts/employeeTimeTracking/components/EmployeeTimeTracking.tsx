import * as React from 'react';
import styles from './EmployeeTimeTracking.module.scss';
import { IEmployeeTimeTrackingProps, IEmployeeTimeTrackingState } from './IEmployeeTimeTrackingProps';
import {
  CommandBar, ICommandBarItemProps, DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
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
const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    width: '500px'
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

export default class EmployeeTimeTracking extends React.Component<IEmployeeTimeTrackingProps, IEmployeeTimeTrackingState> {
  constructor(props: IEmployeeTimeTrackingProps) {
    super(props);
    //state declaration
    this.state = {
      isLoaded: false,
      items: [],
      columns: [],
      isItemSelected: false,
      selectedItemID: '',
      isModalOpen: false,
      isDialogOpen: false,
      dialogTitle: '',
      dialogmessage: '',
      isWarning: false
    };
  }

  public async componentDidMount() {
    let items = await util.getAllItems(this.props.configuredListName);
    this.setState({ items: items, columns: this.getColumns() });
    console.log(items);
  }

  public componentDidUpdate(prevProps) {
    if (prevProps["configuredListName"] != this.props.configuredListName) {
      this.componentDidMount();
    }
  }

  private getColumns() {
    return [
      {
        key: 'column1',
        name: 'Title',
        fieldName: 'Title',
        minWidth: 100,
        maxWidth: 100,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'column2',
        name: 'Description',
        fieldName: 'Description',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: 'string',
        onRender: (item: any) => {
          return <div dangerouslySetInnerHTML={{ __html: item.Description }}></div>;
        },
        isPadded: true,
      },
      {
        key: 'column3',
        name: 'Created By',
        fieldName: 'Author',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: this._onColumnClick,
        onRender: (item: any) => {
          return <span>{item.Author.Title}</span>;
        },
        isPadded: true,
      },
      {
        key: 'column4',
        name: 'Created Date',
        fieldName: 'Created',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: this._onColumnClick,
        onRender: (item: any) => {
          return <span>{util.setStandardDateFormat(new Date(item.Created))}</span>;
        },
      },
      {
        key: 'column5',
        name: 'Category',
        fieldName: 'Category',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: this._onColumnClick,

      },
      {
        key: 'column6',
        name: 'Hours',
        fieldName: 'Hours',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: this._onColumnClick,
        onRender: (item) => {
          if (item.OverTime)
            return <span className={styles.overTimeHours}>{item.Hours}</span>;
          else
            return <span>{item.Hours}</span>;
        },
      },
    ];
  }

  public render(): React.ReactElement<IEmployeeTimeTrackingProps> {
    const _items: ICommandBarItemProps[] = [
      {
        key: 'newItem',
        text: 'New',
        cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
        iconProps: { iconName: 'Add' },
        disabled: this.state.isItemSelected,
        onClick: () => { this.setState({ isModalOpen: true }); },

      },
      {
        key: 'Edit Item',
        text: 'Edit',
        cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
        iconProps: { iconName: 'Edit' },
        disabled: !this.state.isItemSelected,
        onClick: () => { this.setState({ isModalOpen: true }); },
      }
      ,
      {
        key: 'Delete Item',
        text: 'Delete',
        cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
        iconProps: { iconName: 'Delete' },
        disabled: !this.state.isItemSelected,
        onClick: () => { this.setState({isDialogOpen:true, dialogTitle:'Delete Confirmation',dialogmessage:'Item will be deleted permanently!'}); },
      }
    ];

    //const columns: IColumn[] =

    return (
      <div>
        <CommandBar
          items={_items}
        />
        <br></br>
        <TimeEntriesGrid selectItem={(ItemID, selected) => { this.setState({ selectedItemID: ItemID, isItemSelected: selected }); }} items={this.state.items}></TimeEntriesGrid>
        {/* <DetailsList
          items={this.state.items}
          // compact={isCompactMode}
          columns={this.state.columns}
          selectionMode={SelectionMode.none}
          // getKey={this._getKey}
          setKey="none"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
        // onItemInvoked={this._onItemInvoked}
        /> */}
        <Modal isBlocking={true} containerClassName={contentStyles.container} isModeless={false} isOpen={this.state.isModalOpen} onDismissed={() => { this.setState({ isModalOpen: false }); }}>
          <NewEntry configuredListName={this.props.configuredListName} closeModal={() => { this.closeModal(); }} itemID={this.state.selectedItemID}></NewEntry>
        </Modal>
        {this.renderDialog()}
      </div>
    );
  }

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
            <PrimaryButton onClick={()=>{this.closeDialog();}} text="Ok" />
          </DialogFooter>
          : <DialogFooter>
            <PrimaryButton onClick={()=>this.deleteItem()} text="Confirm" />
            <DefaultButton onClick={()=>this.closeDialog()} text="Cancel" />
          </DialogFooter>}
      </Dialog>
    );
  }

  private closeModal() {
    this.setState({ isModalOpen: false });
    this.componentDidMount();
  }

  private closeDialog() {
    this.setState({ isDialogOpen: false,dialogTitle:'',dialogmessage:'' });
    //this.componentDidMount();
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        // this.setState({
        //   announcedMessage: `${currColumn.name} is sorted ${
        //     currColumn.isSortedDescending ? 'descending' : 'ascending'
        //   }`,
        // });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
      isItemSelected: false,
      selectedItemID: null
    });
  }

  private async deleteItem() {
    await util.DeleteSPItem(this.props.configuredListName, this.state.selectedItemID);
    this.setState({ isDialogOpen:false, isItemSelected: false, selectedItemID: null });
    this.componentDidMount();
  }
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

