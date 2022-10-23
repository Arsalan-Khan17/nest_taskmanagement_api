import { ConflictException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {


    constructor(
        @InjectRepository(User)
         private userRepository:Repository<User>,
         private jwtService:JwtService
    ){}

    async signup(authcredntials:AuthCredentials) : Promise<void>{

        const {username,password} = authcredntials;

        
        let user  = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password,user.salt);
        try{
          await user.save();

        }catch(error){
          if(error.code === '23505'){
            throw new ConflictException('User already exists');
          }else{
            throw new InternalServerErrorException();
          }
        }

    }

    private  async hashPassword(password:string,salt:string) : Promise<string> {
      return  bcrypt.hash(password,salt);
    }
     
    
    async signIn(authcredntials:AuthCredentials):Promise<{accessToken:string}>{
      const {username,password} = authcredntials;
      const user  =  await this.userRepository.findOneBy({
        username: username 
        });

        if(user && await user.validatePassword(password)){
          const payload:JwtPayload = {username};
          const accessToken = await this.jwtService.sign(payload);
          return {accessToken}
        }else{
          throw new UnauthorizedException('Invalid Credentials');
        }

    }
}
