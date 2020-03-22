import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-standard-dialog",
  templateUrl: "./standard-dialog.component.html",
  styleUrls: ["./standard-dialog.component.scss"]
})

export class StandardDialogComponent implements OnInit {

  htmlToAdd: any;

  constructor(
    public dialogRef: MatDialogRef<StandardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data) {
      this.htmlToAdd = this.data.message;
    }
  }

  dissmiss() {
    this.dialogRef.close();
  }

}
