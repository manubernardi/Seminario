import{ IsString, IsEmail } from 'class-validator';
export class CreateProveedorDto {
    @IsString()
    razonSocial: string;
    @IsString()
    telefono: string;
    @IsEmail()
    mail: string;
}