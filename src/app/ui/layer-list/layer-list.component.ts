import { Component, OnInit, Input, ViewChildren, ElementRef ,Renderer2} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNode} from '@angular/material/tree';
import { LayerRefreshService } from '../../services/layer-refresh.service';
import { DntLayer } from '../../abstract/DntLayer/dnt-layer';
import { GroupDntL } from '../../abstract/DntLayer/group-dnt-l';



/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface LayerNode {
  title: string;
  layers?: LayerNode[];
}

const TREE_DATA: DntLayer[] = [];

/** Flat node with expandable and level information */
interface LayerFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  dntLayer:DntLayer;
  checked:boolean
}


@Component({
  selector: 'dnt-layerlist',
  templateUrl: './layer-list.component.html',
  styleUrls: ['./layer-list.component.scss']
})

export class LayerListComponent implements OnInit {
  @Input() json1:DntLayer[]=[]
  
  //@ViewChildren(MatTreeNode,{read:ElementRef}) treeNodes:ElementRef[];
  oldSobresaliente:ElementRef;
  public currentDntLayer:DntLayer;

  private _transformer = (node: DntLayer, level: number):LayerFlatNode => {
    let expandable1=false
    if(node instanceof GroupDntL){
      if((node as GroupDntL).hijos.length>0){
        expandable1=true
      }
    }
    return {
      expandable: expandable1,
      name: node.title,
      level: level,
      dntLayer:node,
      checked:node.visible
    };
  }

  treeControl = new FlatTreeControl<LayerFlatNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => (node as GroupDntL).hijos );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<LayerFlatNode, LayerNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<LayerNode, LayerFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: LayerFlatNode | null = null;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<LayerFlatNode>(true /* multiple */);

  constructor(private _layerRefreshService:LayerRefreshService,private _renderer:Renderer2) {
    this.dataSource.data = TREE_DATA
    this._layerRefreshService.listen().subscribe((m:any)=>{
      console.log(m)
      setTimeout(()=>{
        this.dataSource.data=this.json1;
        this.dataSource._flattenedData.value.forEach(element=>{
          //console.log(element,"... for in datasource");
          if(element.checked){
            this.checklistSelection.select(element);
          }
          
        });
      },100)
    })
    //SI ES NECESARIO USAR ESTE EVENTO SUCEDE CUANDO CAMBIA CUALQUIER ELEMENTO DEL ARBOL..
    //this.checklistSelection.onChange.subscribe((node)=>{
    //  console.log(node)
    //})    
  }

  hasChild = (_: number, node: LayerFlatNode) => node.expandable;

  getLevel = (node: LayerFlatNode) => node.level;

  isExpandable = (node: LayerFlatNode) => node.expandable;

  getChildren = (node: LayerNode): LayerNode[] => (node as GroupDntL).hijos;

  hasNoContent = (_: number, _nodeData: LayerFlatNode) => _nodeData.name === '';

  ngOnInit() {
    console.log(this.json1)
    //this.dataSource.data = this.json1;
  }


    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: LayerFlatNode): boolean {
      
      const descendants = this.treeControl.getDescendants(node);
      //console.log(descendants.length)
      const descAllSelected = descendants.every(child =>
        this.checklistSelection.isSelected(child)
      );
      return descAllSelected;
    }
  
    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: LayerFlatNode): boolean {
      const descendants = this.treeControl.getDescendants(node);
      const result = descendants.some(child => this.checklistSelection.isSelected(child));
      return result && !this.descendantsAllSelected(node);
    }
  
    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: LayerFlatNode): void {
      //console.log("click en es papa: "+ node.name+"...")
      this.checklistSelection.toggle(node);
      const descendants = this.treeControl.getDescendants(node);

      //aqui se deseleccionan todos ...jajjajaaj
      if(this.checklistSelection.isSelected(node)){
        this.checklistSelection.select(...descendants)
        //a cada elemento hijo (descendants) se le prende
        descendants.forEach((thel)=>{
          thel.dntLayer.setVisible(true);
        });
      }else{
        this.checklistSelection.deselect(...descendants);
        //a cada elemento hijo (descendants) se le apaga
        descendants.forEach((thel)=>{
          thel.dntLayer.setVisible(false);
        });
      }
  
      // Force update for the parent
      let todo_EsSelected=descendants.every(child =>
        this.checklistSelection.isSelected(child)
      );
      //console.log(todo_EsSelected,node.name,node.expandable)
      this.checkAllParentsSelection(node);

      let checado=this.checklistSelection.isSelected(node);
      node.dntLayer.setVisible(checado);
      node.checked=checado
    }
  
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: LayerFlatNode): void {
      //console.log("click en "+ node.name+"...")
      this.checklistSelection.toggle(node);
      this.checkAllParentsSelection(node); //manda a check o indeterminate sus parents
      let checado=this.checklistSelection.isSelected(node);
      node.dntLayer.setVisible(checado);
      node.checked=checado;
    }
  
    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: LayerFlatNode): void {
      let parent: LayerFlatNode | null = this.getParentNode(node);
      while (parent) {
        this.checkRootNodeSelection(parent);
        parent = this.getParentNode(parent);
      }
    }
  
    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: LayerFlatNode): void {
      
      const nodeSelected = this.checklistSelection.isSelected(node);
      node.dntLayer.setVisible(nodeSelected);
      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected = descendants.every(child =>
        this.checklistSelection.isSelected(child)
      );
      console.log(nodeSelected,descAllSelected)
      if (nodeSelected && !descAllSelected) {
        console.log("deselect indeterminate")
        this.checklistSelection.deselect(node);
        node.dntLayer.setVisible(true);
      } else if (!nodeSelected && descAllSelected) {
        console.log("select")
        this.checklistSelection.select(node);
        node.dntLayer.setVisible(true);
      }else{
        console.log("deselect")
        node.dntLayer.setVisible(true);
      }
    }
  
    /* Get the parent node of a node */
    getParentNode(node: LayerFlatNode): LayerFlatNode | null {
      const currentLevel = this.getLevel(node);
  
      if (currentLevel < 1) {
        return null;
      }
  
      const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
  
      for (let i = startIndex; i >= 0; i--) {
        const currentNode = this.treeControl.dataNodes[i];
  
        if (this.getLevel(currentNode) < currentLevel) {
          return currentNode;
        }
      }
      return null;
    }

    private _checklistSelection_isSelected(node:LayerFlatNode){
      let is_sele=this.checklistSelection.isSelected(node);
      //console.log(is_sele,node.name,node.dntLayer.visible);
      //let rre=(!is_sele)? 
      return is_sele//node.checked
    }

    select_node(node:LayerFlatNode,event:any){
      //quitar la seleccion de los demas elementos
      if (this.oldSobresaliente !=undefined){
        this._renderer.removeClass(this.oldSobresaliente.nativeElement,"dnt-selected-node")
      }
      console.log(event);
      
      //let elemsRef:any[]=event.path
      let nodoHtml:ElementRef=new ElementRef( event.target.parentNode)
      this._renderer.addClass(nodoHtml.nativeElement,"dnt-selected-node")
      //console.log(nodoHtml);
      this.oldSobresaliente=nodoHtml;
      this.currentDntLayer=node.dntLayer;
      
    }

    toogleExpandThis(node:LayerFlatNode){
      console.log(node.name);
      //this.treeControl.expand(node)
      this.treeControl.toggle(node)
      
    }


  mensaje1(){
    
    console.log(this.json1)    
  }

  contextMenu1(){
    alert("wewe")
    return false
  }
}
