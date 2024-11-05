import { UsersService } from './users.service';
import { CreateUserDto, UpdateStatusDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(payload: CreateUserDto): Promise<any>;
    registerSuperAdmin(payload: CreateUserDto): Promise<any>;
    registerAdmin(payload: {
        email: string;
        password: string;
        fullName: string;
        phoneNumber: string;
        state: string;
        address: string;
    }): Promise<any>;
    register(payload: CreateUserDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data: {
            deviceToken: string;
            state: string;
            address: string;
            ProfilePicture: string;
            profilePictureMetaData: any;
            googleId: string;
            confirmed: boolean;
            secretToken: string;
            fullName: string;
            username: string;
            email: string;
            phoneNumber: string;
            password: string;
            authToken: string;
            roles: import("./interfaces").IUserRole[];
            activityLogs: import("./interfaces").IActivityLog[];
            status: string;
            aboutMe: Map<string, string>;
            statusReason: string;
            isDeleted: boolean;
            isSuperAdmin: boolean;
            deletedAt: Date | (Date & string);
            createdAt: import("mongoose").Schema.Types.Date & (string | Date);
            updatedAt: import("mongoose").Schema.Types.Date & (string | Date);
            _id: string;
            $assertPopulated: <Paths = {}>(path: string | string[], values?: Partial<Paths>) => Omit<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, keyof Paths> & Paths;
            $clearModifiedPaths: () => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $clone: () => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $createModifiedPathsSnapshot: () => import("mongoose").ModifiedPathsSnapshot;
            $getAllSubdocs: () => import("mongoose").Document[];
            $ignore: (path: string) => void;
            $isDefault: (path: string) => boolean;
            $isDeleted: (val?: boolean) => boolean;
            $getPopulatedDocs: () => import("mongoose").Document[];
            $inc: (path: string | string[], val?: number) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $isEmpty: (path: string) => boolean;
            $isValid: (path: string) => boolean;
            $locals: Record<string, unknown>;
            $markValid: (path: string) => void;
            $model: {
                <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                    _id: unknown;
                }> & {
                    __v: number;
                }, any>>(name: string): ModelType;
                <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
            };
            $op: "save" | "validate" | "remove" | null;
            $restoreModifiedPathsSnapshot: (snapshot: import("mongoose").ModifiedPathsSnapshot) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $session: (session?: import("mongoose").ClientSession | null) => import("mongoose").ClientSession | null;
            $set: {
                (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (value: string | Record<string, any>): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
            };
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            deleteOne: (options?: import("mongoose").QueryOptions) => any;
            depopulate: <Paths = {}>(path?: string | string[]) => import("mongoose").MergeType<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, Paths>;
            directModifiedPaths: () => Array<string>;
            equals: (doc: import("mongoose").Document<unknown, any, any>) => boolean;
            errors?: import("mongoose").Error.ValidationError;
            get: {
                <T extends string | number | symbol>(path: T, type?: any, options?: any): any;
                (path: string, type?: any, options?: any): any;
            };
            getChanges: () => import("mongoose").UpdateQuery<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }>;
            id?: any;
            increment: () => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            init: (obj: import("mongoose").AnyObject, opts?: import("mongoose").AnyObject) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            invalidate: {
                <T extends string | number | symbol>(path: T, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
                (path: string, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
            };
            isDirectModified: {
                <T extends string | number | symbol>(path: T | T[]): boolean;
                (path: string | Array<string>): boolean;
            };
            isDirectSelected: {
                <T extends string | number | symbol>(path: T): boolean;
                (path: string): boolean;
            };
            isInit: {
                <T extends string | number | symbol>(path: T): boolean;
                (path: string): boolean;
            };
            isModified: {
                <T extends string | number | symbol>(path?: T | T[], options?: {
                    ignoreAtomics?: boolean;
                } | null): boolean;
                (path?: string | Array<string>, options?: {
                    ignoreAtomics?: boolean;
                } | null): boolean;
            };
            isNew: boolean;
            isSelected: {
                <T extends string | number | symbol>(path: T): boolean;
                (path: string): boolean;
            };
            markModified: {
                <T extends string | number | symbol>(path: T, scope?: any): void;
                (path: string, scope?: any): void;
            };
            model: {
                <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                    _id: unknown;
                }> & {
                    __v: number;
                }, any>>(name: string): ModelType;
                <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
            };
            modifiedPaths: (options?: {
                includeChildren?: boolean;
            }) => Array<string>;
            overwrite: (obj: import("mongoose").AnyObject) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $parent: () => import("mongoose").Document | undefined;
            populate: {
                <Paths = {}>(path: string | import("mongoose").PopulateOptions | (string | import("mongoose").PopulateOptions)[]): Promise<import("mongoose").MergeType<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                }, Paths>>;
                <Paths = {}>(path: string, select?: string | import("mongoose").AnyObject, model?: import("mongoose").Model<any>, match?: import("mongoose").AnyObject, options?: import("mongoose").PopulateOptions): Promise<import("mongoose").MergeType<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                }, Paths>>;
            };
            populated: (path: string) => any;
            replaceOne: (replacement?: import("mongoose").AnyObject, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, {}, unknown, "find", Record<string, never>>;
            save: (options?: import("mongoose").SaveOptions) => Promise<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }>;
            schema: import("mongoose").Schema;
            set: {
                <T extends string | number | symbol>(path: T, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (value: string | Record<string, any>): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
            };
            toJSON: {
                (options?: import("mongoose").ToObjectOptions & {
                    flattenMaps?: true;
                    flattenObjectIds?: false;
                }): import("mongoose").FlattenMaps<any>;
                (options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: false;
                }): import("mongoose").FlattenMaps<any>;
                (options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: true;
                }): {
                    [x: string]: any;
                };
                (options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                }): any;
                (options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                    flattenObjectIds: true;
                }): any;
                <T = any>(options?: import("mongoose").ToObjectOptions & {
                    flattenMaps?: true;
                    flattenObjectIds?: false;
                }): import("mongoose").FlattenMaps<T>;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: false;
                }): import("mongoose").FlattenMaps<T>;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: true;
                }): import("mongoose").ObjectIdToString<import("mongoose").FlattenMaps<T>>;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                }): T;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                    flattenObjectIds: true;
                }): import("mongoose").ObjectIdToString<T>;
            };
            toObject: {
                (options?: import("mongoose").ToObjectOptions): any;
                <T>(options?: import("mongoose").ToObjectOptions): import("mongoose").Require_id<T>;
            };
            unmarkModified: {
                <T extends string | number | symbol>(path: T): void;
                (path: string): void;
            };
            updateOne: (update?: import("mongoose").UpdateWithAggregationPipeline | import("mongoose").UpdateQuery<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }>, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, {}, unknown, "find", Record<string, never>>;
            validate: {
                <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): Promise<void>;
                (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): Promise<void>;
                (options: {
                    pathsToSkip?: import("mongoose").pathsToSkip;
                }): Promise<void>;
            };
            validateSync: {
                (options: {
                    pathsToSkip?: import("mongoose").pathsToSkip;
                    [k: string]: any;
                }): import("mongoose").Error.ValidationError | null;
                <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
                (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
            };
        };
    }>;
    profile(req: Request): Promise<any>;
    updateUserStatus(param: UpdateStatusDto, payload: {
        status: string;
        reason?: string;
    }): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
    }>;
    uploadProfilePicture(file: Express.Multer.File, req: {
        user: any;
    }): Promise<{
        message: string;
        url: any;
    }>;
    findAll(payload: any): Promise<any>;
    findAllAdmins(payload: any): Promise<any>;
    findOne(id: any): Promise<any>;
    update(id: any, payload: UpdateUserDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data: import("mongoose").Document<unknown, {}, {
            deviceToken: string;
            state: string;
            address: string;
            ProfilePicture: string;
            profilePictureMetaData: any;
            googleId: string;
            confirmed: boolean;
            secretToken: string;
            fullName: string;
            username: string;
            email: string;
            phoneNumber: string;
            password: string;
            authToken: string;
            roles: import("./interfaces").IUserRole[];
            activityLogs: import("./interfaces").IActivityLog[];
            status: string;
            aboutMe: Map<string, string>;
            statusReason: string;
            isDeleted: boolean;
            isSuperAdmin: boolean;
            deletedAt: Date | (Date & string);
            createdAt: import("mongoose").Schema.Types.Date & (string | Date);
            updatedAt: import("mongoose").Schema.Types.Date & (string | Date);
            _id: string;
            $assertPopulated: <Paths = {}>(path: string | string[], values?: Partial<Paths>) => Omit<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, keyof Paths> & Paths;
            $clearModifiedPaths: () => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $clone: () => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $createModifiedPathsSnapshot: () => import("mongoose").ModifiedPathsSnapshot;
            $getAllSubdocs: () => import("mongoose").Document[];
            $ignore: (path: string) => void;
            $isDefault: (path: string) => boolean;
            $isDeleted: (val?: boolean) => boolean;
            $getPopulatedDocs: () => import("mongoose").Document[];
            $inc: (path: string | string[], val?: number) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $isEmpty: (path: string) => boolean;
            $isValid: (path: string) => boolean;
            $locals: Record<string, unknown>;
            $markValid: (path: string) => void;
            $model: {
                <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                    _id: unknown;
                }> & {
                    __v: number;
                }, any>>(name: string): ModelType;
                <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
            };
            $op: "save" | "validate" | "remove" | null;
            $restoreModifiedPathsSnapshot: (snapshot: import("mongoose").ModifiedPathsSnapshot) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $session: (session?: import("mongoose").ClientSession | null) => import("mongoose").ClientSession | null;
            $set: {
                (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (value: string | Record<string, any>): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
            };
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            deleteOne: (options?: import("mongoose").QueryOptions) => any;
            depopulate: <Paths = {}>(path?: string | string[]) => import("mongoose").MergeType<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, Paths>;
            directModifiedPaths: () => Array<string>;
            equals: (doc: import("mongoose").Document<unknown, any, any>) => boolean;
            errors?: import("mongoose").Error.ValidationError;
            get: {
                <T extends string | number | symbol>(path: T, type?: any, options?: any): any;
                (path: string, type?: any, options?: any): any;
            };
            getChanges: () => import("mongoose").UpdateQuery<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }>;
            id?: any;
            increment: () => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            init: (obj: import("mongoose").AnyObject, opts?: import("mongoose").AnyObject) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            invalidate: {
                <T extends string | number | symbol>(path: T, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
                (path: string, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
            };
            isDirectModified: {
                <T extends string | number | symbol>(path: T | T[]): boolean;
                (path: string | Array<string>): boolean;
            };
            isDirectSelected: {
                <T extends string | number | symbol>(path: T): boolean;
                (path: string): boolean;
            };
            isInit: {
                <T extends string | number | symbol>(path: T): boolean;
                (path: string): boolean;
            };
            isModified: {
                <T extends string | number | symbol>(path?: T | T[], options?: {
                    ignoreAtomics?: boolean;
                } | null): boolean;
                (path?: string | Array<string>, options?: {
                    ignoreAtomics?: boolean;
                } | null): boolean;
            };
            isNew: boolean;
            isSelected: {
                <T extends string | number | symbol>(path: T): boolean;
                (path: string): boolean;
            };
            markModified: {
                <T extends string | number | symbol>(path: T, scope?: any): void;
                (path: string, scope?: any): void;
            };
            model: {
                <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                    _id: unknown;
                }> & {
                    __v: number;
                }, any>>(name: string): ModelType;
                <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
            };
            modifiedPaths: (options?: {
                includeChildren?: boolean;
            }) => Array<string>;
            overwrite: (obj: import("mongoose").AnyObject) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $parent: () => import("mongoose").Document | undefined;
            populate: {
                <Paths = {}>(path: string | import("mongoose").PopulateOptions | (string | import("mongoose").PopulateOptions)[]): Promise<import("mongoose").MergeType<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                }, Paths>>;
                <Paths = {}>(path: string, select?: string | import("mongoose").AnyObject, model?: import("mongoose").Model<any>, match?: import("mongoose").AnyObject, options?: import("mongoose").PopulateOptions): Promise<import("mongoose").MergeType<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                }, Paths>>;
            };
            populated: (path: string) => any;
            replaceOne: (replacement?: import("mongoose").AnyObject, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, {}, unknown, "find", Record<string, never>>;
            save: (options?: import("mongoose").SaveOptions) => Promise<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }>;
            schema: import("mongoose").Schema;
            set: {
                <T extends string | number | symbol>(path: T, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (value: string | Record<string, any>): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
            };
            toJSON: {
                (options?: import("mongoose").ToObjectOptions & {
                    flattenMaps?: true;
                    flattenObjectIds?: false;
                }): import("mongoose").FlattenMaps<any>;
                (options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: false;
                }): import("mongoose").FlattenMaps<any>;
                (options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: true;
                }): {
                    [x: string]: any;
                };
                (options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                }): any;
                (options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                    flattenObjectIds: true;
                }): any;
                <T = any>(options?: import("mongoose").ToObjectOptions & {
                    flattenMaps?: true;
                    flattenObjectIds?: false;
                }): import("mongoose").FlattenMaps<T>;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: false;
                }): import("mongoose").FlattenMaps<T>;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: true;
                }): import("mongoose").ObjectIdToString<import("mongoose").FlattenMaps<T>>;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                }): T;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                    flattenObjectIds: true;
                }): import("mongoose").ObjectIdToString<T>;
            };
            toObject: {
                (options?: import("mongoose").ToObjectOptions): any;
                <T>(options?: import("mongoose").ToObjectOptions): import("mongoose").Require_id<T>;
            };
            unmarkModified: {
                <T extends string | number | symbol>(path: T): void;
                (path: string): void;
            };
            updateOne: (update?: import("mongoose").UpdateWithAggregationPipeline | import("mongoose").UpdateQuery<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }>, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, {}, unknown, "find", Record<string, never>>;
            validate: {
                <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): Promise<void>;
                (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): Promise<void>;
                (options: {
                    pathsToSkip?: import("mongoose").pathsToSkip;
                }): Promise<void>;
            };
            validateSync: {
                (options: {
                    pathsToSkip?: import("mongoose").pathsToSkip;
                    [k: string]: any;
                }): import("mongoose").Error.ValidationError | null;
                <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
                (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
            };
        }> & {
            deviceToken: string;
            state: string;
            address: string;
            ProfilePicture: string;
            profilePictureMetaData: any;
            googleId: string;
            confirmed: boolean;
            secretToken: string;
            fullName: string;
            username: string;
            email: string;
            phoneNumber: string;
            password: string;
            authToken: string;
            roles: import("./interfaces").IUserRole[];
            activityLogs: import("./interfaces").IActivityLog[];
            status: string;
            aboutMe: Map<string, string>;
            statusReason: string;
            isDeleted: boolean;
            isSuperAdmin: boolean;
            deletedAt: Date | (Date & string);
            createdAt: import("mongoose").Schema.Types.Date & (string | Date);
            updatedAt: import("mongoose").Schema.Types.Date & (string | Date);
            _id: string;
            $assertPopulated: <Paths = {}>(path: string | string[], values?: Partial<Paths>) => Omit<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, keyof Paths> & Paths;
            $clearModifiedPaths: () => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $clone: () => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $createModifiedPathsSnapshot: () => import("mongoose").ModifiedPathsSnapshot;
            $getAllSubdocs: () => import("mongoose").Document[];
            $ignore: (path: string) => void;
            $isDefault: (path: string) => boolean;
            $isDeleted: (val?: boolean) => boolean;
            $getPopulatedDocs: () => import("mongoose").Document[];
            $inc: (path: string | string[], val?: number) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $isEmpty: (path: string) => boolean;
            $isValid: (path: string) => boolean;
            $locals: Record<string, unknown>;
            $markValid: (path: string) => void;
            $model: {
                <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                    _id: unknown;
                }> & {
                    __v: number;
                }, any>>(name: string): ModelType;
                <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
            };
            $op: "save" | "validate" | "remove" | null;
            $restoreModifiedPathsSnapshot: (snapshot: import("mongoose").ModifiedPathsSnapshot) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $session: (session?: import("mongoose").ClientSession | null) => import("mongoose").ClientSession | null;
            $set: {
                (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (value: string | Record<string, any>): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
            };
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            deleteOne: (options?: import("mongoose").QueryOptions) => any;
            depopulate: <Paths = {}>(path?: string | string[]) => import("mongoose").MergeType<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, Paths>;
            directModifiedPaths: () => Array<string>;
            equals: (doc: import("mongoose").Document<unknown, any, any>) => boolean;
            errors?: import("mongoose").Error.ValidationError;
            get: {
                <T extends string | number | symbol>(path: T, type?: any, options?: any): any;
                (path: string, type?: any, options?: any): any;
            };
            getChanges: () => import("mongoose").UpdateQuery<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }>;
            id?: any;
            increment: () => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            init: (obj: import("mongoose").AnyObject, opts?: import("mongoose").AnyObject) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            invalidate: {
                <T extends string | number | symbol>(path: T, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
                (path: string, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
            };
            isDirectModified: {
                <T extends string | number | symbol>(path: T | T[]): boolean;
                (path: string | Array<string>): boolean;
            };
            isDirectSelected: {
                <T extends string | number | symbol>(path: T): boolean;
                (path: string): boolean;
            };
            isInit: {
                <T extends string | number | symbol>(path: T): boolean;
                (path: string): boolean;
            };
            isModified: {
                <T extends string | number | symbol>(path?: T | T[], options?: {
                    ignoreAtomics?: boolean;
                } | null): boolean;
                (path?: string | Array<string>, options?: {
                    ignoreAtomics?: boolean;
                } | null): boolean;
            };
            isNew: boolean;
            isSelected: {
                <T extends string | number | symbol>(path: T): boolean;
                (path: string): boolean;
            };
            markModified: {
                <T extends string | number | symbol>(path: T, scope?: any): void;
                (path: string, scope?: any): void;
            };
            model: {
                <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                    _id: unknown;
                }> & {
                    __v: number;
                }, any>>(name: string): ModelType;
                <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
            };
            modifiedPaths: (options?: {
                includeChildren?: boolean;
            }) => Array<string>;
            overwrite: (obj: import("mongoose").AnyObject) => import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            };
            $parent: () => import("mongoose").Document | undefined;
            populate: {
                <Paths = {}>(path: string | import("mongoose").PopulateOptions | (string | import("mongoose").PopulateOptions)[]): Promise<import("mongoose").MergeType<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                }, Paths>>;
                <Paths = {}>(path: string, select?: string | import("mongoose").AnyObject, model?: import("mongoose").Model<any>, match?: import("mongoose").AnyObject, options?: import("mongoose").PopulateOptions): Promise<import("mongoose").MergeType<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                }, Paths>>;
            };
            populated: (path: string) => any;
            replaceOne: (replacement?: import("mongoose").AnyObject, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, {}, unknown, "find", Record<string, never>>;
            save: (options?: import("mongoose").SaveOptions) => Promise<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }>;
            schema: import("mongoose").Schema;
            set: {
                <T extends string | number | symbol>(path: T, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
                (value: string | Record<string, any>): import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                    _id: string;
                    createdAt: Date | string;
                    updatedAt: Date | string;
                    deletedAt?: Date | string | null;
                };
            };
            toJSON: {
                (options?: import("mongoose").ToObjectOptions & {
                    flattenMaps?: true;
                    flattenObjectIds?: false;
                }): import("mongoose").FlattenMaps<any>;
                (options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: false;
                }): import("mongoose").FlattenMaps<any>;
                (options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: true;
                }): {
                    [x: string]: any;
                };
                (options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                }): any;
                (options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                    flattenObjectIds: true;
                }): any;
                <T = any>(options?: import("mongoose").ToObjectOptions & {
                    flattenMaps?: true;
                    flattenObjectIds?: false;
                }): import("mongoose").FlattenMaps<T>;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: false;
                }): import("mongoose").FlattenMaps<T>;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenObjectIds: true;
                }): import("mongoose").ObjectIdToString<import("mongoose").FlattenMaps<T>>;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                }): T;
                <T = any>(options: import("mongoose").ToObjectOptions & {
                    flattenMaps: false;
                    flattenObjectIds: true;
                }): import("mongoose").ObjectIdToString<T>;
            };
            toObject: {
                (options?: import("mongoose").ToObjectOptions): any;
                <T>(options?: import("mongoose").ToObjectOptions): import("mongoose").Require_id<T>;
            };
            unmarkModified: {
                <T extends string | number | symbol>(path: T): void;
                (path: string): void;
            };
            updateOne: (update?: import("mongoose").UpdateWithAggregationPipeline | import("mongoose").UpdateQuery<import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }>, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("./entities/user.schema").User & import("mongoose").Document<unknown, any, any> & {
                _id: string;
                createdAt: Date | string;
                updatedAt: Date | string;
                deletedAt?: Date | string | null;
            }, {}, unknown, "find", Record<string, never>>;
            validate: {
                <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): Promise<void>;
                (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): Promise<void>;
                (options: {
                    pathsToSkip?: import("mongoose").pathsToSkip;
                }): Promise<void>;
            };
            validateSync: {
                (options: {
                    pathsToSkip?: import("mongoose").pathsToSkip;
                    [k: string]: any;
                }): import("mongoose").Error.ValidationError | null;
                <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
                (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
            };
        } & Required<{
            _id: string;
        }> & {
            __v: number;
        };
    }>;
    remove(id: any): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
    }>;
}
