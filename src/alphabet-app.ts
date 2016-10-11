import {Component} from '@angular/core'
import {DragDropModule, TreeModule, DataTableModule, DropdownModule, ButtonModule}
  from 'primeng/primeng'

/** Common Data Item Model */
class Letter {
    letter: string
    toString(){ return this.letter }// enable sorting array of Letters and displaying dropdown options
    constructor( letter ){ this.letter = letter }
}

@Component({
    selector: 'app-root',
    template: `
    <div class="ui-grid">
        <p-tree       [value]="state.tree.items"
                [(selection)]="state.tree.selected"
                     (onDrop)="moveSelected({from:'table', to:'tree'})"
                   pDroppable="state.table.items"
                   pDraggable="state.tree.items"
                        class="ui-grid-col-4">
        </p-tree>
    
        <p-dataTable  [value]="state.table.items"
          	    [(selection)]="state.table.selected"
                     (onDrop)="moveSelected({from:'tree', to:'table'})"
                   pDroppable="state.tree.items"
                   pDraggable="state.table.items"
                        class="ui-grid-col-8">
    
            <p-column 
                selectionMode="multiple"></p-column>
            <p-column   field="letter" header="Letter"></p-column>
    
            <footer>
                <p-dropdown 
                    [options]="state.available.items" 
                  [(ngModel)]="state.available.selected">
                </p-dropdown>
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
        if( selected.length ){
            const items = fromState.items
            selected.forEach( selectedItem =>
                items.splice( items.indexOf( selectedItem ), 1) )
            fromState.selected = []
        }
        return selected
    }

    constructor(){
        const letters = this.alphabet.split('').map(letter => new Letter( letter ))
        this.state.tree.items  = letters.slice(0, this.treeSize )
        this.state.table.items = letters.slice( this.treeSize )
    }
}