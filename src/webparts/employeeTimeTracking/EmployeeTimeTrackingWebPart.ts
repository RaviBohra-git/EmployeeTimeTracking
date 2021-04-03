import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EmployeeTimeTrackingWebPartStrings';
import EmployeeTimeTracking from './components/EmployeeTimeTracking';
import { IEmployeeTimeTrackingProps } from './components/IEmployeeTimeTrackingProps';
import * as pnp from 'sp-pnp-js';
import commonUtility from '../employeeTimeTracking/components/DataUtility';
const util: commonUtility = new commonUtility();

export interface IEmployeeTimeTrackingWebPartProps {
  context: any;
  configuredListName: string;
}

export default class EmployeeTimeTrackingWebPart extends BaseClientSideWebPart<IEmployeeTimeTrackingWebPartProps> {
  private availableLists: IPropertyPaneDropdownOption[];
  private listsDropdownDisabled: boolean = true;

  public render(): void {
    const element: React.ReactElement<IEmployeeTimeTrackingProps> = React.createElement(
      EmployeeTimeTracking,
      {
        context: this.context,
        configuredListName: this.properties.configuredListName ? this.properties.configuredListName : '',
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    await util.SetupSP(this.context);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  private async loadLists(): Promise<IPropertyPaneDropdownOption[]> {
    return new Promise<IPropertyPaneDropdownOption[]>((resolve: (options: IPropertyPaneDropdownOption[]) => void, reject: (error: any) => void) => {
      util.getLists()
        .then((responseLists) => {
          let availableListsOptions = [];
          console.log(responseLists);
          if (responseLists.length > 0) {
            responseLists.map((list) => {
              if (list.BaseTemplate == 100)
                availableListsOptions.push({ key: list.Title, text: list.Title });
            });
            resolve(availableListsOptions);
          }
        });
    });
  }

  protected onPropertyPaneConfigurationStart(): void {
    this.listsDropdownDisabled = !this.availableLists;
    if (this.availableLists) {
      return;
    }
    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'lists');
    this.loadLists()
      .then((listOptions: IPropertyPaneDropdownOption[]): void => {
        this.availableLists = listOptions;
        this.listsDropdownDisabled = false;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.render();
      });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneDropdown('configuredListName', {
                  label: "Configuration List",
                  options: this.availableLists,
                  disabled: this.listsDropdownDisabled,
                  selectedKey: this.properties.configuredListName ? this.properties.configuredListName : ''
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
