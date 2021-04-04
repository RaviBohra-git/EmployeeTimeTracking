import * as React from 'react';
import styles from './EmployeeTimeTracking.module.scss';
import { TimeEntriesGridProps, TimeEntriesGridState } from './IEmployeeTimeTrackingProps';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
  Checkbox
} from 'office-ui-fabric-react/lib/';
import commonUtility from '../components/DataUtility';
const util: commonUtility = new commonUtility();

export default class TimeEntriesGrid extends React.Component<TimeEntriesGridProps, TimeEntriesGridState> {
  private _selection: Selection;
  constructor(props: TimeEntriesGridProps) {
    super(props);
    //state declaration
    this.state = {
      isLoaded: false,
      items: [],
      columns: []
    };
    //Detaillist selection
    this._selection = new Selection({
      onSelectionChanged: () => {
        let ItemID: any = this._selection.getSelection()[0];
        this.props.selectItem((ItemID ? ItemID.ID : null), (ItemID ? true : false));
      }
    });
  }

  /**
   * 
   * @param prevProps 
   * update on property change
   */
  public componentDidUpdate(prevProps) {
    if (prevProps["items"] != this.props.items) {
      this.componentDidMount();
    }
  }

  /**
   * Initial function of component
   */
  public componentDidMount() {
    this.setState({ items: this.props.items, columns: this.getColumns() });
  }

  /**
   * 
   * @returns 
   * render Component
   */
  public render(): React.ReactElement<TimeEntriesGridProps> {
    return (
      <div >
        <DetailsList
          items={this.state.items}
          columns={this.state.columns}
          selectionMode={SelectionMode.single}
          selection={this._selection}
          setKey="none"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
        />
      </div>
    );
  }

  /**
   * 
   * @returns 
   * get columns object
   */
  private getColumns() {
    return [
      {
        key: 'column1',
        name: 'Title',
        fieldName: 'Title',
        minWidth: 50,
        maxWidth: 50,
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
      {
        key: 'column7',
        name: 'OverTime',
        fieldName: 'OverTime',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: this._onColumnClick,
        onRender: (item) => {
          return <Checkbox checked={item.OverTime}>{item.Hours}</Checkbox>;

        },
      },
    ];
  }

  /**
   * 
   * @param ev 
   * @param column 
   * on Detail list column click function
   */
  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = this._copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  }

  /**
   * 
   * @param items 
   * @param columnKey 
   * @param isSortedDescending 
   * @returns 
   * sort items
   */
  private _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
  }
}


