import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from './user.mysql.entity';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}
  profile(userId) {
    return this.userRepository.findOneBy(userId);
  }
}
