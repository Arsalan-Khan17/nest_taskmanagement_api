import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import{Strategy,ExtractJwt}  from "passport-jwt";
import { Repository } from "typeorm";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

constructor(
@InjectRepository(User)
private userRepository:Repository<User>
){
    super({
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey : 'topsecret51'

    });
}


async validate(payload:JwtPayload) : Promise<User>{

    const {username} = payload;
    const user = await this.userRepository.findOneBy({
        username: username
        });

     if(!user){
        throw new UnauthorizedException();
     }   

     return user;
}
}