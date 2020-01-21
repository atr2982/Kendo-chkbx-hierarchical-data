import { Component } from '@angular/core';
import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { of, Observable } from 'rxjs';

@Component({
    selector: 'my-app',
    styles: [`.right { margin-right: 5px }`],
    template: `
        <fieldset>
            <div  *ngIf="checkMode == 'multiple'">
                <label class="k-form-field right">
                    <input type="checkbox" id="enableCheck" class="k-checkbox" [(ngModel)]="enableCheck"/>
                    <label class="k-checkbox-label" for="enableCheck">Enable Checkboxes</label>
                </label>
                <label class="k-form-field right">
                    <input type="checkbox" id="checkChildren" class="k-checkbox" [(ngModel)]="checkChildren"/>
                    <label class="k-checkbox-label" for="checkChildren">Check all children when parent is checked</label>
                </label>
                <label class="k-form-field right">
                    <input type="checkbox" id="checkParents" class="k-checkbox" [(ngModel)]="checkParents"/>
                    <label class="k-checkbox-label" for="checkParents">Check parent when children are all checked</label>
                </label>
                <label class="k-form-field right">
                    <input type="checkbox" id="checkOnClick" class="k-checkbox" [(ngModel)]="checkOnClick"/>
                    <label class="k-checkbox-label" for="checkOnClick">Check the node on click</label>
                </label>
            </div>
        </fieldset>

        <hr>

        <input [(ngModel)]="searchTerm" id="filter" #filter (keyup)='onkeyup(filter.value)' placeholder="Filter" />
        <kendo-treeview
            [nodes]="parsedData"

            kendoTreeViewHierarchyBinding
            textField="text"
            childrenField="children"

            [kendoTreeViewCheckable]="checkableSettings"
            [(checkedKeys)]="checkedKeys"
            [checkBy]="'text'"
            
            kendoTreeViewExpandable
            [(expandedKeys)]="expandedKeys"
            [expandBy]="'text'"
        >
        </kendo-treeview>

        <hr>
        
        <div style="margin: 10px 0">
            <div class="example-config">
                Checked keys: {{checkedKeys.join(",")}}
            </div>
        </div>
  `
})
export class AppComponent {
    public checkedKeys: any[] = ['0xB0C0 - RRC OTA Packet', '0xB0C1 - RRC MIB Msg', '0xB0C2 - RRC Serving Cell Info'];
    public expandedKeys: any[] = ['All', 'LTE', 'RRC'];

    public enableCheck = true;
    public checkChildren = false;
    public checkParents = false;
    public checkOnClick = true;
    public checkMode: any = 'multiple';

    public get checkableSettings(): CheckableSettings {
        return {
            checkChildren: this.checkChildren,
            checkParents: this.checkParents,
            enabled: this.enableCheck,
            mode: this.checkMode,
            checkOnClick: this.checkOnClick
        };
    }

    public data: any[] = [
      { text: 'All', children: [
        { text: 'CDMA'},
        { text: 'GNSS'},
        { text: 'Common'},
        { text: 'LTE', children: [
          { text: 'Event'},
          { text: 'MAC'},
          { text: 'RLC'},
          { text: 'PDCP'},
          { text: 'RRC', children: [
            { text: '0xB0C0 - RRC OTA Packet', children: [
              { text: 'kpi 1'},
              { text: 'kpi 2'},
              { text: 'kpi 3'},
              { text: 'kpi 4'},
              { text: 'kpi 5'},
              { text: 'kpi 6'},
              { text: 'kpi 7'},
              { text: 'kpi 8'},
              ]
            },
            { text: '0xB0C1 - RRC MIB Msg'},
            { text: '0xB0C2 - RRC Serving Cell Info'}
            ]
          },
          { text: 'NAS'},
          { text: 'LL1'},
          { text: 'ML1'},
          { text: 'Reserved'},
          { text: 'VOLTE'}
          ]
        },
        { text: 'WCDMA'},
        { text: 'UMTS'},
        { text: 'VERIZON'}
      ]}
    ];

    public parsedData: any[] = this.data;
    public searchTerm = '';

    public onkeyup(value: string): void {
      this.parsedData = this.search(this.data, value);
    }

    public search(items: any[], term: string): any[] {
      return items.reduce((acc, item) => {
            if (this.contains(item.text, term)) {
              acc.push(item);
            } else if (item.children && item.children.length > 0) {
              const newItems = this.search(item.children, term);

              if (newItems.length > 0) {
                    acc.push({ text: item.text, children: newItems });
              }
          }
            return acc;
        }, []);
    }

    public contains(text: string, term: string): boolean {
      return text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    }
}

