import { IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class AuthCredentials{

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username:string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{message : 'Password too week'})
    password:string;
}