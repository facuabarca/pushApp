import { Injectable, EventEmitter} from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
	providedIn: 'root'
})
export class PushService {

	messages: OSNotificationPayload[] = [];

	pushListener = new EventEmitter<OSNotificationPayload>();

	constructor(private oneSignal: OneSignal, private storage: Storage) {
		this.loadMessages();
	 }

	initConfig() {
		this.oneSignal.startInit('9313de35-8aeb-4d23-ad45-fb0ef88e8341', '906565566123');

		this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

		this.oneSignal.handleNotificationReceived().subscribe((noti) => {
			// do something when notification is received
			console.log('notificación recibida:: ', noti);
			this.recievedNotification(noti);
		});

		this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
			// do something when a notification is opened
			console.log('notificación abierta:: ', noti);
			await this.recievedNotification(noti.notification);
		});

		this.oneSignal.endInit();
	}

	async recievedNotification(notification: OSNotification) {
		await this.loadMessages();
		const payload = notification.payload;
		const existsPush = this.messages.find(msg => {
			return msg.notificationID === payload.notificationID;
		});
		if (existsPush) {
			return;
		}
		this.messages.unshift(payload);

		this.pushListener.emit(payload);

		await this.saveMessages();

	}



	saveMessages() {
		this.storage.set('messages', this.messages);
	}

	async loadMessages() {
		// this.storage.clear()
		this.messages = await this.storage.get('messages') || [];

		return this.messages;
	}

	async getMessages() {
		await this.loadMessages();
		return  [...this.messages];
	}
}
