import { Component, OnInit, ApplicationRef } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

	messages: OSNotificationPayload[] = [];

	constructor(private pushService: PushService, private applicationRef: ApplicationRef) { }

	ngOnInit() {
		this.pushService.pushListener.subscribe((noti) => {
			this.messages.unshift(noti);
			console.log('notificacion: ', noti);
			this.applicationRef.tick();
		});
	}

	async ionViewWillEnter() {
		this.messages = await this.pushService.getMessages();
		console.log(this.messages);
	}



}
