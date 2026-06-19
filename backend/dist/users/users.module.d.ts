export declare class UsersController {
    getMe(req: any): {
        user: any;
    };
    findAll(): {
        users: {
            username: string;
            displayName: string;
            department: string;
        }[];
    };
}
export declare class UsersModule {
}
