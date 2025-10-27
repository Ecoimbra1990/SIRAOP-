"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFaccaoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_faccao_dto_1 = require("./create-faccao.dto");
class UpdateFaccaoDto extends (0, mapped_types_1.PartialType)(create_faccao_dto_1.CreateFaccaoDto) {
}
exports.UpdateFaccaoDto = UpdateFaccaoDto;
//# sourceMappingURL=update-faccao.dto.js.map