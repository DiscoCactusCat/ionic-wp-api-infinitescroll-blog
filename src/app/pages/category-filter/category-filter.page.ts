import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.page.html',
  styleUrls: ['./category-filter.page.scss'],
})
export class CategoryFilterPage implements OnInit {

  constructor(private api: ApiService, private popOver: PopoverController) { }

  categories = [];
  selected = null;
  iconStyle='';

  ngOnInit() {
    this.api.getCategories().subscribe(res => {
      console.log("Reception du filtre", res);
      this.categories = res;
      this.categories.unshift({id: null, name: 'All'});
    })
  }

  selectCategory(category){

    this.popOver.dismiss(category);
    this.iconStyle = this.getProperCategoryIcon(category);
  }

  private getProperCategoryIcon(category){
    switch(category){
      case "Informatique" :
        return "laptop-outline";
        case "Business" :
          return "cash-outline";
    }
  }
}
