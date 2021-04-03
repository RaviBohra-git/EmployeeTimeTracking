export interface IEmployeeTimeTrackingProps {
  context: any;
  configuredListName: string;
}

export interface IEmployeeTimeTrackingState {
  isLoaded: boolean;
  columns: any[];
  items: any[];
  isItemSelected: boolean;
  selectedItemID: string;
  isModalOpen: boolean;
}

export interface TimeEntriesGridProps {
  items: any[];
  selectItem:(ItemID,selected)=>void;
}

export interface TimeEntriesGridState {
  isLoaded: boolean;
  columns: any[];
  items: any[];
}

export interface NewEntryProps {
  itemObj: any;
  CategoryChoices: any[];
  closeModal:()=>void;
}

export interface NewEntryState {
  isLoaded: boolean;
  Title: string;
  Description: string;
  Category: string;
  Hours: Number;
  OverTime: boolean;
  // columns: any[];
  // items: any[];
}