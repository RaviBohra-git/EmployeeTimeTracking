import * as React from 'react';
import styles from './EmployeeTimeTracking.module.scss';
import { IEmployeeTimeTrackingProps, IEmployeeTimeTrackingState } from './IEmployeeTimeTrackingProps';
import {
  CommandBar, ICommandBarItemProps, DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react/lib/';
import TimeEntriesGrid from './TimeEntriesGrid';
import commonUtility from '../components/DataUtility';
const util: commonUtility = new commonUtility();

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
      isModalOpen: false
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
        // onRender: (item: IDocument) => {
        //   return <span>{item.fileSize}</span>;
        // },
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
        onClick: () => alert('New Item Clicked'),
      },
      {
        key: 'Edit Item',
        text: 'Edit',
        cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
        iconProps: { iconName: 'Edit' },
        onClick: () => alert('Edit Item Clicked'),
      }
      ,
      {
        key: 'Delete Item',
        text: 'Delete',
        cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
        iconProps: { iconName: 'Delete' },
        onClick: () => alert('Edit Item Clicked'),
      }
    ];

    //const columns: IColumn[] =

    return (
      <div>
        <CommandBar
          items={_items}
        />
        <br></br>
        <TimeEntriesGrid items={this.state.items}></TimeEntriesGrid>
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
      </div>
    );
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
    });
  }
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

