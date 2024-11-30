import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSigninDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignupDto: UserSignupDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(userSignupDto.email);
    if (userExists)
      throw new BadRequestException('User with this email already exists');
    userSignupDto.password = await hash(userSignupDto.password, 10);
    let user = this.usersRepository.create(userSignupDto);
    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(userSigninDto: UserSigninDto): Promise<UserEntity> {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', {
        email: userSigninDto.email,
      })
      .getOne();
    // const userExists = await this.findUserByEmail(userSigninDto.email);
    if (!userExists) throw new BadRequestException('Invalid Credentials');
    const matchPassword = await compare(
      userSigninDto.password,
      userExists.password,
    );
    if (!matchPassword) throw new BadRequestException('Invalid Credentials');
    delete userExists.password;
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id : ${id} not found`);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  generateAccessToken(user: UserEntity): string {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES },
    );
  }
}
