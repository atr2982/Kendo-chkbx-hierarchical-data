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
                    <input
                        type="checkbox"
                        id="enableCheck"
                        class="k-checkbox"
                        [(ngModel)]="enableCheck"
                    />
                    <label class="k-checkbox-label" for="enableCheck">Enable Checkboxes</label>
                </label>
                <label class="k-form-field right">
                    <input
                        type="checkbox"
                        id="checkChildren"
                        class="k-checkbox"
                        [(ngModel)]="checkChildren"
                    />
                    <label class="k-checkbox-label" for="checkChildren">Check all children when parent is checked</label>
                </label>
                <label class="k-form-field right">
                    <input
                        type="checkbox"
                        id="checkParents"
                        class="k-checkbox"
                        [(ngModel)]="checkParents"
                    />
                    <label class="k-checkbox-label" for="checkParents">Check parent when children are all checked</label>
                </label>
                <label class="k-form-field right">
                    <input
                        type="checkbox"
                        id="checkOnClick"
                        class="k-checkbox"
                        [(ngModel)]="checkOnClick"
                    />
                    <label class="k-checkbox-label" for="checkOnClick">Check the node on click</label>
                </label>
            </div>
        </fieldset>

        <hr>

        <input [(ngModel)]="searchTerm" id="filter" #filter (keyup)='onkeyup(filter.value)' placeholder="Filter" />
        <kendo-treeview
            [nodes]="parsedData"
            kendoTreeViewExpandable
            kendoTreeViewHierarchyBinding
            textField="category"
            childrenField="children"

            [kendoTreeViewCheckable]="checkableSettings"
            [(checkedKeys)]="checkedKeys"
            [(expandedKeys)]="expandedKeys"
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
    public checkedKeys: any[] = ['0_3_4_0', '0_3_4_1', '0_3_4_2'];
    public expandedKeys: any[] = ['0'];

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
      { category: 'All', children: [
        { category: 'CDMA'},
        { category: 'GNSS'},
        { category: 'Common'},
        { category: 'LTE', children: [
          { category: 'Event'},
          { category: 'MAC'},
          { category: 'RLC'},
          { category: 'PDCP'},
          { category: 'RRC', children: [
            { category: '0xB0C0 - RRC OTA Packet', children: [
              { category: 'kpi 1'},
              { category: 'kpi 2'},
              { category: 'kpi 3'},
              { category: 'kpi 4'},
              { category: 'kpi 5'},
              { category: 'kpi 6'},
              { category: 'kpi 7'},
              { category: 'kpi 8'},
              ]
            },
            { category: '0xB0C1 - RRC MIB Msg'},
            { category: '0xB0C2 - RRC Serving Cell Info'}
            ]
          },
          { category: 'NAS'},
          { category: 'LL1'},
          { category: 'ML1'},
          { category: 'Reserved'},
          { category: 'VOLTE'}
          ]
        },
        { category: 'WCDMA'},
        { category: 'UMTS'},
        { category: 'VERIZON'},

      ]}
    ];

    public parsedData: any[] = this.data;
    public searchTerm = '';

    public onkeyup(value: string): void {
      this.parsedData = this.search(this.data, value);
    }

    public search(items: any[], term: string): any[] {
      return items.reduce((acc, item) => {
            if (this.contains(item.category, term)) {
              acc.push(item);
            } else if (item.children && item.children.length > 0) {
              const newItems = this.search(item.children, term);

              if (newItems.length > 0) {
                    acc.push({ category: item.category, children: newItems });
              }
          }
            return acc;
        }, []);
    }

    public contains(text: string, term: string): boolean {
      return text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    }
}

