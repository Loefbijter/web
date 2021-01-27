import { Component, OnInit } from '@angular/core';
import { ContentItem } from "../_modules/content/content-item.model";
import { ContentService } from "../_modules/content/content.service";
import {Router} from "@angular/router";

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./password-set.content.json');

@Component({
  selector: 'app-password-set',
  templateUrl: './password-set.component.html',
  styleUrls: ['./password-set.component.scss']
})
export class PasswordSetComponent implements OnInit {

  constructor(
    private readonly contentService: ContentService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.contentService.addContentItems(content);
  }

  async goHome(){
    await this.router.navigateByUrl("/");
  }
}
