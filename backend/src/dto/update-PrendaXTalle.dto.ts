import { PartialType } from "@nestjs/swagger";
import { CreatePrendaXTalleDto } from "./createPrendaXTalle.dto";
export class UpdatePrendaTalleDto extends PartialType(CreatePrendaXTalleDto){

}