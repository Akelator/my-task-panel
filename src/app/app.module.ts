import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EditPanelIdComponent } from './components/edit-panel-id/edit-panel-id.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { PanelComponent } from './components/panel/panel.component';
import { SearchComponent } from './components/search/search.component';
import { BtnClearComponent } from './components/task/task-btn/btn-clear/btn-clear.component';
import { BtnCopyComponent } from './components/task/task-btn/btn-copy/btn-copy.component';
import { BtnEditComponent } from './components/task/task-btn/btn-edit/btn-edit.component';
import { BtnLinkComponent } from './components/task/task-btn/btn-link/btn-link.component';
import { BtnLoadComponent } from './components/task/task-btn/btn-load/btn-load.component';
import { BtnNextComponent } from './components/task/task-btn/btn-next/btn-next.component';
import { BtnPlusComponent } from './components/task/task-btn/btn-plus/btn-plus.component';
import { BtnRemoveComponent } from './components/task/task-btn/btn-remove/btn-remove.component';
import { BtnReviewComponent } from './components/task/task-btn/btn-review/btn-review.component';
import { BtnVisibleComponent } from './components/task/task-btn/btn-visible/btn-visible.component';
import { TaskComponent } from './components/task/task.component';

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    TaskComponent,
    NewTaskComponent,
    BtnRemoveComponent,
    BtnVisibleComponent,
    BtnLinkComponent,
    BtnCopyComponent,
    BtnPlusComponent,
    BtnLoadComponent,
    EditTaskComponent,
    EditPanelIdComponent,
    BtnEditComponent,
    SearchComponent,
    BtnClearComponent,
    BtnReviewComponent,
    BtnNextComponent,
  ],
  imports: [BrowserModule, CommonModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
