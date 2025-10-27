"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArmaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_arma_dto_1 = require("./create-arma.dto");
class UpdateArmaDto extends (0, mapped_types_1.PartialType)(create_arma_dto_1.CreateArmaDto) {
}
exports.UpdateArmaDto = UpdateArmaDto;
//# sourceMappingURL=update-arma.dto.js.map