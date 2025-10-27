"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOcorrenciaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ocorrencia_dto_1 = require("./create-ocorrencia.dto");
class UpdateOcorrenciaDto extends (0, mapped_types_1.PartialType)(create_ocorrencia_dto_1.CreateOcorrenciaDto) {
}
exports.UpdateOcorrenciaDto = UpdateOcorrenciaDto;
//# sourceMappingURL=update-ocorrencia.dto.js.map