"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePessoaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_pessoa_dto_1 = require("./create-pessoa.dto");
class UpdatePessoaDto extends (0, mapped_types_1.PartialType)(create_pessoa_dto_1.CreatePessoaDto) {
}
exports.UpdatePessoaDto = UpdatePessoaDto;
//# sourceMappingURL=update-pessoa.dto.js.map