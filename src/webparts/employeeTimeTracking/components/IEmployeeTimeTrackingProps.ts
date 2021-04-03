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
}

export interface TimeEntriesGridState {
  isLoaded: boolean;
  columns: any[];
  items: any[];
}

export interface NewEntryProps {
  // context: any;
  // configuredListName: string;
}

export interface NewEntryState {
  isLoaded: boolean;
  // columns: any[];
  // items: any[];
}