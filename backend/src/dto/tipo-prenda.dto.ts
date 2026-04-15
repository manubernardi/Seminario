import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTipoPrendaDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    // IDs de los talles que corresponden a este tipo
    // Ej: para "Remera" → los IDs de S, M, L, XL en la tabla talles
    @IsArray()
    @IsNumber({}, { each: true })
    talleIds: number[];
}

export class UpdateTipoPrendaDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nombre?: string;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    talleIds?: number[];

    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}