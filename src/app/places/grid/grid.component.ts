import { Component }                from '@angular/core'
import { MatTableDataSource }       from '@angular/material';
import { DataSource }               from '@angular/cdk/table';
import { SelectionModel }           from '@angular/cdk/collections';

import { InteractionService }       from '../../interaction/interaction.service';
import { ModalInteractionService }  from '../../interaction/modal.service';
import { RequestService }           from '../../shared/request.service';
import { ElementsService }          from '../../shared/elements.service';

@Component({
    selector:      'grid-place',
    templateUrl: './grid.component.html',
    styleUrls:  ['./grid.component.css']
})

export class GridPlaceComponent {
    link: string = '';                  // Название таблицы
    mainData:any[] = [];                 // Чистые данные с сервера
    mainTable:any[] = [];                 // Чистая таблица с сервера
    displayedColumns:any[];                      // Массив названий Столбцов
    columns:any[] = [];                 // Массив столбцов - name, label
    gridName:string = '';                // ССылка на таблицу а сервера
    dataSource = new MatTableDataSource();   // Данные для отображения
    showMainTable:boolean = true;
    questions:any[];                      // Элементы в редакторе
    modal_window_type:string = 'editor';          // Тип модального окна

    selectedArray:number[] = [];              // Массив выделенных строк
    lastSelectedId:any = null;                 // Последняя выделенная строка
    lastSelectShiftArray:any = [];                 // Последнее выделение с шифтом, нужно, чтобы отменить выделение
    dataId:any = null;                 // id открытого документа
    contexMenuItem:any = null;                 // Строка, на которой кликнули правой кнопкой
    sortColumn:any = null;                // колонка, по которой в данный момент идет сортировка {<name>: <asc|desc>}
    selection:any;

    constructor(private interactionService:InteractionService,
                private modalService:ModalInteractionService,
                private request:RequestService,
                private elements:ElementsService) {
        interactionService.runGetMainDataSubject['subscribe'](data => this.getData(data));
        interactionService.runCtrlASubject['subscribe'](() => this.selectAllRow());
        interactionService.runClearAllSubject['subscribe'](() => this.clearAll());
        interactionService.runCreateEditorSubject['subscribe']((a) => this.runCreateEditor(a));
        interactionService.runGridRightClickSubject['subscribe'](a => this.openContextMenu(a, null));
        interactionService.runServiceSubject['subscribe'](a => this.serviceAction(a));
        interactionService.runAfterSetFilterDataSubject['subscribe'](() => this.getMainData(null));
        modalService.runEditorGetValuesSubject['subscribe'](a => this.submitValues(a));
        modalService.runUnlockSubject['subscribe'](() => this.unlock());

        const initialSelection = [];
        const allowMultiSelect = true;
        this.selection = new SelectionModel(allowMultiSelect, initialSelection);
    }

    /*----- C L I C S -----*/

    /* Клик по ячейке или запуск редактора или выделение строки */
    onCellClick($event, data, name) {
        const isCtrlKey = $event.ctrlKey;
        const isShiftKey = $event.shiftKey;
        //const isAltKey   = $event.altKey;

        $event.stopPropagation();

        if (isCtrlKey || (name === 'row-checkbox')) {
            this.selectCtrlRow(data);
        } else if (isShiftKey) {
            this.onRowCheckboxClickShift($event, data)
        } else {
            this.getEditorData(data.id);
        }

    }

    /* Отслеживает нажатие ctrl-A на таблице */
    onKey($event) {
        if ($event && $event.code === 'KeyA' && $event.ctrlKey) {
            $event.stopPropagation();
            this.selectAllRow();
        }
    }

    /* Клик по строке с нажатым Shift - выделяет несколько строк */
    onRowCheckboxClickShift($event, data) {
        const id = data.id;
        const selectShiftArray = this.getBetweenIds(this.lastSelectedId, id);

        if (selectShiftArray && selectShiftArray.forEach) {

            this.lastSelectShiftArray.forEach(item => {
                this.deselectRow(null, item);
            });

            selectShiftArray.forEach(item => {
                this.selectRow(null, item, null);
            });

            this.lastSelectShiftArray = selectShiftArray;
        }

        this.selectedArray = this.selectedArray.concat(selectShiftArray)['unique']();
    }

    /* Клик по чекбоксу равен клику по ячейке */
    onRowCheckboxClick($event, rowData) {
        $event.stopPropagation();

        //this.selectRow($event, rowData);

        if ($event.shiftKey) {
            this.onRowCheckboxClickShift($event, rowData);
        } else {
            this.toggleRow($event, rowData)
        }
    }

    onHeaderCheckboxClick($event){
        $event.stopPropagation();

        this.toggleAllRow($event.target.checked);

    }

    openContextMenu($event, rowData) {
        //let target;
        const x = $event.clientX;
        const y = $event.clientY;

        $event.stopPropagation();
        $event.preventDefault();

        /*if(document.elementFromPoint(x, y).className.indexOf('modal') === -1){
            target = document.elementFromPoint(x, y);
        }

        const id = (rowData ? rowData.id : null);*/

        if(this.selection && this.selection.selected){
            if(this.selection.selected.length === 1){
                this.selection.toggle(this.selection.selected[0]);
            }

            if(this.selection.selected.length === 0){
                this.selection.toggle(rowData);
            }
        }

        //if (this.selectedArray.length === 1) this.deselectRow(null, this.selectedArray[0]);
        //if (!this.selectedArray.length) this.selectRow($event, id, target);

        if (rowData) this.contexMenuItem = rowData;

        this.interactionService.runServiceMenu({x, y});
    }

    onHeaderRowClick($event, name){
        if(name === 'row-checkbox') return;

        if(this.sortColumn && this.sortColumn[name]){
            this.sortColumn[name] = (this.sortColumn[name] === 'asc') ? 'desc' : 'asc';
        }else{
            this.sortColumn = {};
            this.sortColumn[name] = 'asc';
        }


        this.request.setSort((() => this.getMainData(null)), {name: name, direction: this.sortColumn[name]});
    }


    /*----- D A T A -----*/


    clearAll() {
        this.selectedArray = [];
        this.mainData = [];
        this.mainTable = [];
        this.displayedColumns = [];
        this.dataSource = new MatTableDataSource();
        this.sortColumn = {};
        this.request.setSort(null, {name: null, direction: null});

        GridPlaceComponent.clickEmulate();
    }

    getData(data) {
        this.gridName = data.link;
        this.clearAll();
        this.setMainTable(data.item);
    }

    setMainTable(item) {
        if (item && item['grids'] && item['grids'][0] && item['grids'][0].columns && item['grids'][0].columns instanceof Array) {
            this.mainTable = item['grids'][0].columns;

            this.columns = [{name: 'row-checkbox', label: ''}];
            this.displayedColumns = ['row-checkbox'];
            this.mainTable.forEach(item => {
                this.displayedColumns.push(item.name);

                this.columns.push(
                    {name: item.name, label: item.label}
                );

            });

            this.getMainData(item);
        }

    }

    static prepareForSetData(data) {
        //data = this.cutDate(data);
        return data;
    }

    getMainData(item) {
        let link;
        if(item){
            link = item.name;
            this.link = link;
        }else{
            link = this.link;
        }


        this.request.getMainData((data => this.setMainData(GridPlaceComponent.prepareForSetData(data))), link);
    }

    setMainData(data) {
        if (data && data instanceof Array) {
            this.mainData = data;
            this.dataSource = new MatTableDataSource(this.mainData);

            this.showMainTable = true;
        }
    }



    /*----- R O W -----*/

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected == numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    selectCtrlRow(data){
        this.selection.toggle(data);
    }

    selectAllRow() {
        this.selectedArray = [];
        this.lastSelectShiftArray = null;
        let headerChk = GridPlaceComponent.getHeaderCheckbox();

        if(headerChk) headerChk['checked'] = true;

        if (this.mainData && this.mainData.forEach) {
            this.mainData.forEach((item, num) => {
                this.selectRow(null, item.id, null);
            });

        }
    }

    deselectAllRow() {
        this.selectedArray = [];
        this.lastSelectShiftArray = null;
        let headerChk = GridPlaceComponent.getHeaderCheckbox();

        if(headerChk) headerChk['checked'] = false;

        if (this.mainData && this.mainData.forEach) {
            this.mainData.forEach((item, num) => {
                this.deselectRow(null, item.id);
            });

        }
    }

    toggleAllRow(selected){
        //const selected = this.mainData.length - this.selectedArray.length;

        if(!selected){
            this.deselectAllRow();
        }else{
            this.selectAllRow();
        }
    };

    selectRow($event, id, target) {
        let checkbox = this.getCheckboxElement($event, id, target);

        if (checkbox) checkbox['checked'] = true;

        if(!id) id = this.getIdByCheckBox(checkbox);

        if(id && id.id) id = id.id;
        this.selectedArray.push(id);
    }

    deselectRow($event, id) {
        let checkbox = this.getCheckboxElement($event, id, null);

        if(!id) id = this.getIdByCheckBox(checkbox);

        if (checkbox) checkbox['checked'] = false;

        this.selectedArray.splice(this.selectedArray.indexOf(id), 1);
    }

    toggleRow($event, rowData) {
        const id = rowData.id;
        this.lastSelectedId = id;

        let checkbox = this.getCheckboxElement($event, id, null);

        if (checkbox) checkbox['checked'] = (this.selectedArray.indexOf(id) === -1);

        if (this.selectedArray.indexOf(id) !== -1) {
            this.selectedArray.splice(this.selectedArray.indexOf(id), 1);
        } else {
            this.selectedArray.push(id);
        }
    }



    /*----- R E Q U E S T -----*/

    serviceAction(data) {
        /* {handler: "openLegend", name: "openLegend", label: "Легенда"}*/

        const selectedArray = this.createSelectedArray();
        if( !data ||
            !data['handler'] ||
            !selectedArray ||
            !selectedArray.length ||
            !this.link) return;

        this.request.postService({
            ids: selectedArray,
            handler: data['handler'],
            callback: function(a){console.log('arguments - ', arguments);},
            link: this.link
        });
    }

    submitValues(data) {
        this.request.postEditorData(null, this.dataId, data, this.gridName);
    }

    getEditorData(id) {
        this.dataId = id;
        this.request.getEditorData((data => {
            this.modalService.editWindow(this.modal_window_type, data);

            //this.setEditorData(data);
            //this.openWindow()
        }), id, this.gridName);
    }

    unlock(){
        this.request.unlock(this.dataId, this.gridName);
    }



    /*----- E D I T O R -----*/

    runCreateEditor(item) {
        let items = this.getFormItems(item);

        if (!items) return;

        this.questions = this.elements.generateQuestions(items, 'editor');
    }

    getFormItems(item) {
        let res = null,
            containers = null;

        if (item &&
            item['grids'] &&
            item['grids'][0] &&
            item['grids'][0]['editor'] &&
            item['grids'][0]['editor'][0] &&
            item['grids'][0]['editor'][0]['items'] &&
            item['grids'][0]['editor'][0]['items'][0] &&
            item['grids'][0]['editor'][0]['items'][0]['items']

        ) {

            containers = item['grids'][0]['editor'][0]['items'][0]['items'];
        }

        if (containers && containers instanceof Array) {
            res = this.getItemsFromContainers(containers);
        }

        return res;
    }

    getItemsFromContainers(containers) {
        let res = [];

        if (containers && containers.forEach) {
            containers.forEach(data => {
                if (data.items && data.items instanceof Array) {
                    res = res.concat(this.getItemsFromContainers(data.items));
                } else {
                    res.push(data);
                }
            })
        }

        return res;
    }

    openWindow() {
        this.modalService.openWindow(this.modal_window_type);
        //this.open_filter_modal_window = true;
    }



    /*----- C O M M O N -----*/

    createSelectedArray(){
        let result = [];

        if(this.selection && this.selection.selected && this.selection.selected.forEach){
            this.selection.selected.forEach((item) => {
                if(item && item.id) result.push(item.id);
            })
        }

        return result;
    }

    static getHeaderCheckbox(){
        let result = null;
        let hChk = document.getElementsByName('allonoffswitch')[0];

        if(hChk && hChk['forEach']){
            hChk['forEach'](val => {
                if(val && val['checked'] !== undefined) result = val;
            })
        }

        return result;
    }

    static clickEmulate(){
        try{
            document.getElementById('column-id-row-checkbox').click();
        }catch(err){}
    }

    getBetweenIds(first, last) {
        let firstNumber;
        let lastNumber;

        let res = [];

        this.mainData.forEach((item, num) => {
            if (item.id === first) firstNumber = num;
            if (item.id === last) lastNumber = num;
        });

        if (firstNumber === undefined || lastNumber === undefined) return;

        if (firstNumber > lastNumber) {
            let middle = firstNumber;
            firstNumber = lastNumber;
            lastNumber = middle;
        }

        for (let i = firstNumber; i < lastNumber + 1; i++) {
            res.push(this.mainData[i].id);
        }

        return res;
    }

    createCheckBoxArray() {
        let checkboxes = document.getElementsByName('onoffswitch');
        let chks = [];
        let res = [];

        if (checkboxes && checkboxes['forEach']) {
            checkboxes['forEach']((item) => {
                if (item && item.tagName && item.tagName.toLowerCase() === 'input') {
                    chks.push(item);
                }
            });

            chks['forEach']((item, num) => {
                if (item && item.tagName && item.tagName.toLowerCase() === 'input') {
                    res.push({
                        checkbox: item,
                        id: this.mainData[num].id
                    })
                }
            });
        }


        return res;
    }

    getCheckboxElement($event, id, target) {
        let checkbox = null;

        if ($event || target) {
            const elem = target || $event.target || $event.currentTarget;

            if (elem && elem.childNodes && elem.childNodes.forEach) {
                elem.childNodes.forEach((elem) => {
                    if (elem.nodeName.toLowerCase() === 'input') {
                        checkbox = elem;
                    }
                });
            }

            if (!checkbox) {
                let parent = elem.parentNode;

                if (parent['tagName'].toLowerCase() !== 'mat-row') {
                    parent = parent.parentNode;
                }

                if (parent['tagName'].toLowerCase() !== 'mat-row') return;

                parent.childNodes['forEach'](el => {
                    el.childNodes.forEach((ell) => {
                        if (ell.nodeName.toLowerCase() === 'input') {
                            checkbox = ell;
                        }
                    });
                })
            }
        }

        if (!checkbox) {
            checkbox = this.getCheckBoxById(id);
        }

        return checkbox;
    }

    getCheckBoxById(id) {
        const checkArray = this.createCheckBoxArray();
        let res = null;

        if (checkArray && checkArray.forEach) {
            checkArray.forEach(item => {
                if (item.id === id) res = item['checkbox'];
            })
        }

        return res;
    }

    getIdByCheckBox(checkbox) {
        const checkArray = this.createCheckBoxArray();
        let res = null;

        if (checkArray && checkArray.forEach) {
            checkArray.forEach(item => {
                if (item.checkbox === checkbox) res = item['id'];
            })
        }

        return res;
    }

    isRowSelected(id) {
        return (this.selectedArray.indexOf(id) !== -1);
    }

    isAscDirection(name) {
        return (this.sortColumn && this.sortColumn[name] && this.sortColumn[name] === 'asc');
    }

    isDescDirection(name) {
        return (this.sortColumn && this.sortColumn[name] && this.sortColumn[name] === 'desc');
    }
}