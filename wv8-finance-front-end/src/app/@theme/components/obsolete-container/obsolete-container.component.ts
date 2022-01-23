import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wv8-obsolete-container',
  templateUrl: './obsolete-container.component.html',
  styleUrls: ['./obsolete-container.component.scss']
})
export class ObsoleteContainerComponent implements OnInit {

  @Input()
  text: string;

  @Input()
  data: { obsolete: boolean }

  @Input()
  tooltipPlacement: string = "right";

  constructor() { }

  ngOnInit() {
  }

}
