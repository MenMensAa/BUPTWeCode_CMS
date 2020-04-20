export const codes = {
    OK: 200,
    TOKEN_ERROR: 499,
    PARAMS_ERROR: 400,
    AUTH_ERROR: 401,
    REQ_REJECT: 403,
    SOURCE_ERROR: 404,
    SERVER_ERROR: 500,
}

export const permission = {
    VISITOR:     0b00000001,
    COMMENTER:   0b00000010,
    POSTER:      0b00000100,
    FRONTUSER:   0b00001000,
    BOADER:      0b00010000,
    CMSUSER:     0b00100000,
    ROOTER:      0b01000000
}

export const Role = {
    VISITOR: {
        perm: permission.VISITOR,
        name: "访问者"
    },
    OPERATOR: {
        perm: permission.VISITOR | permission.COMMENTER | permission.POSTER | permission.FRONTUSER,
        name: "运营"
    },
    ADMIN: {
        perm: permission.VISITOR | permission.COMMENTER | permission.POSTER | permission.FRONTUSER | permission.BOADER | permission.CMSUSER,
        name: "管理员"
    },
    DEVELOPER: {
        perm: 0b11111111,
        name: "开发者"
    }
}

