import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
	constructor(@Inject('USER-SERVER') private userServer: ClientProxy) {}

	getUser(user) {
		try {
			return firstValueFrom(
				this.userServer.send('userCenter.user.profile', user)
			);
		} catch (error) {
			console.log(error);
		}
	}
}
