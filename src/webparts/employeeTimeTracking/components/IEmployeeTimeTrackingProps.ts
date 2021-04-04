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
  isDialogOpen: boolean;
  dialogTitle: string;
  dialogmessage: string;
  isWarning: boolean;

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
  configuredListName: string;
  itemID:string;
  closeModal:()=>void;
}

export interface NewEntryState {
  isLoaded: boolean;
  CategoryChoices: any[];
  Title: string;
  Description: string;
  Category: string;
  Hours: string;
  OverTime: boolean;
  isValidationLable: boolean;
  validationMessage:string;
  isProgress: boolean;
  // columns: any[];
  // items: any[];
}