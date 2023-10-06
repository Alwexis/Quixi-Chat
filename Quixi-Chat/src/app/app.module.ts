import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { RegisterComponent } from './views/register/register.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { IconsComponent } from './components/icons/icons.component';
import { AlertComponent } from './components/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { CreateChatComponent } from './components/create-chat/create-chat.component';
import { ChatComponent } from './components/chat/chat.component';
import { MessageComponent } from './components/message/message.component';
import { AttachmentsComponent } from './components/attachments/attachments.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: { reconnection: true, extraHeaders: { 'authorization': '' } } };

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    IconsComponent,
    AlertComponent,
    CreateChatComponent,
    ChatComponent,
    MessageComponent,
    AttachmentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
