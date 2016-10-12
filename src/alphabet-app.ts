import {Component, NgModule} from '@angular/core'
import {BrowserModule}       from '@angular/platform-browser'
import {FormsModule}         from '@angular/forms'
import {DragDropModule, TreeModule, DataTableModule, DropdownModule, MultiSelectModule, ButtonModule}
  from 'primeng/primeng'

const ngAppModule =()=> ({
    imports:      [BrowserModule, FormsModule, DragDropModule, TreeModule, DataTableModule, DropdownModule, MultiSelectModule, ButtonModule],
    declarations: [AlphabetApp],
    bootstrap:    [AlphabetApp],
})

/** Common Data Item Model */
class Letter {
    label: string
    toString(){ return this.label }// enable sorting array of Letters and displaying dropdown options
    get value(){ return this.label }
    constructor( letter ){ this.label = letter }
}

@Component({
    selector: 'alphabet-app',
    template: `
    <div class="ui-grid">
        <p-tree       [value]="state.tree.items"
                [(selection)]="state.tree.selected"
                     (onDrop)="moveSelected({from:'table', to:'tree'})"
                   pDroppable="table"
                   pDraggable="tree"
                selectionMode="multiple"
                        class="ui-grid-col-4" scrollHeight="400px">
        </p-tree>
    
        <p-dataTable  [value]="state.table.items"
                [(selection)]="state.table.selected"
                     (onDrop)="moveSelected({from:'tree', to:'table'})"
                   pDroppable="tree" 
                   pDraggable="table"
                        class="ui-grid-col-8" scrollHeight="400px">

            <p-column 
                selectionMode="multiple"></p-column>
            <p-column   field="label" header="Letter"></p-column>
    
            <footer>
                <p-multiSelect 
                    [options]="state.available.items" 
                  [(ngModel)]="state.available.selected">
                </p-multiSelect>
                <button label="Add"    pButton type="button"
                      (click)="moveSelected({from:'available', to:'table'})"
                   [disabled]="state.available.selected.length === 0">
                </button>
                <button label="Delete" pButton type="button"
                      (click)="moveSelected({from:'table', to:'available'})"
                   [disabled]="state.table.selected.length === 0">
                </button>
            </footer>
        </p-dataTable>
    </div>`

}) export class AlphabetApp {

    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    /** default number of tree items, the rest goes to table */
    treeSize = 10

    state = {
        tree:      {items: [], selected: []},
        table:     {items: [], selected: []},
        available: {items: [], selected: []},
    }

    moveSelected({ from, to }){
        const removed = this.removeSelected( from )
        if( removed.length ){
            const toState = this.state[ to ]
            toState.items = toState.items.concat( removed )
                                         .sort()
        }
    }

    removeSelected( from ){
        const fromState = this.state[ from ]
        const selected  = fromState.selected
        const removed   = []
        if( selected.length ){
            const items = fromState.items
            selected.forEach( selectedItem => {
                const found = items.findIndex( item => item == selectedItem )
                if( found >= 0 ) removed.push( items.splice(found, 1)[0] )
                else console.error("Can't remove: inconsistent state")
            })
            fromState.selected = []
        }
        return removed
    }

    constructor(){
        const letters = this.alphabet.split('').map(letter => new Letter( letter ))
        this.state.tree.items  = letters.slice(0, this.treeSize )
        this.state.table.items = letters.slice( this.treeSize )
    }
}

@NgModule( ngAppModule() ) export class AppModule { }
