import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  stickyToasties: number[] = [];
  constructor(private toastr: ToastrService ){

   

  }
  ngOnInit(){
  }


  
}
