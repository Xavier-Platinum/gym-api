"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoleDto = exports.UpdateAuthDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_auth_dto_1 = require("./create-auth.dto");
class UpdateAuthDto extends (0, mapped_types_1.PartialType)(create_auth_dto_1.CreateAuthDto) {
}
exports.UpdateAuthDto = UpdateAuthDto;
class UpdateRoleDto extends (0, mapped_types_1.PartialType)(create_auth_dto_1.CreateRoleDto) {
}
exports.UpdateRoleDto = UpdateRoleDto;
