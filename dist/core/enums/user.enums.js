"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGender = exports.UserProvider = exports.UserPermission = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
    UserRole["MODERATOR"] = "moderator";
    UserRole["GUEST"] = "guest";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["PENDING"] = "pending";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["DELETED"] = "deleted";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserPermission;
(function (UserPermission) {
    UserPermission["READ"] = "read";
    UserPermission["WRITE"] = "write";
    UserPermission["DELETE"] = "delete";
    UserPermission["UPDATE"] = "update";
    UserPermission["ADMIN"] = "admin";
})(UserPermission || (exports.UserPermission = UserPermission = {}));
var UserProvider;
(function (UserProvider) {
    UserProvider["LOCAL"] = "local";
    UserProvider["GOOGLE"] = "google";
    UserProvider["FACEBOOK"] = "facebook";
    UserProvider["GITHUB"] = "github";
    UserProvider["APPLE"] = "apple";
})(UserProvider || (exports.UserProvider = UserProvider = {}));
var UserGender;
(function (UserGender) {
    UserGender["MALE"] = "male";
    UserGender["FEMALE"] = "female";
    UserGender["OTHER"] = "other";
    UserGender["PREFER_NOT_TO_SAY"] = "prefer_not_to_say";
})(UserGender || (exports.UserGender = UserGender = {}));
//# sourceMappingURL=user.enums.js.map