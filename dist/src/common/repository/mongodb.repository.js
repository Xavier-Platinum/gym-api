"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRepository = exports.createRepoError = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const createRepoError = (message, name, cause) => {
    const error = new Error(message);
    if (name)
        error.name = name;
    if (cause)
        error.stack = cause;
    return error;
};
exports.createRepoError = createRepoError;
class EntityRepository {
    constructor(model) {
        this.model = model;
        this.convertArchived = (archived) => [undefined, 'false', false, null].includes(archived) ? false : true;
        this.getQuery = (condition) => typeof condition === 'string' ? { _id: condition } : { ...condition };
        this.name = model.modelName;
    }
    getModel() {
        return this.model;
    }
    connectDBSession(session) {
        this.session = session;
        if (session && !session.inTransaction()) {
            session.startTransaction();
        }
        return this;
    }
    disconnectDBSession() {
        this.session = null;
        return this;
    }
    async create(attributes) {
        try {
            const [doc] = await this.model.create([attributes], {
                session: this.session,
            });
            return doc?.save({ session: this.session });
        }
        catch (err) {
            if (err && err.code === 11000) {
                return Promise.reject((0, exports.createRepoError)(`${this.name} exists already`, 'DuplicateError', err.keyValue));
            }
            return Promise.reject(err);
        }
    }
    async byID(_id, projections, archived) {
        archived = this.convertArchived(archived || false);
        return this.model
            .findOne({
            _id: new mongoose_1.default.Types.ObjectId(_id),
            ...(!archived
                ? { deleted_at: undefined }
                : { deleted_at: { $ne: undefined } }),
        })
            .lean()
            .session(this.session)
            .select(projections || [])
            .exec()
            .then((result) => {
            if (!result) {
                return Promise.reject((0, exports.createRepoError)(`${this.name} not found`, 'ModelNotFoundError'));
            }
            return result;
        });
    }
    async all(query) {
        const sort = query.sort || 'createdAt';
        const archived = this.convertArchived(query.archived || false);
        try {
            return await this.model
                .find({
                ...query.conditions,
                ...(!archived
                    ? { deleted_at: undefined }
                    : {
                        $or: [
                            { deleted_at: { $ne: undefined } },
                            { deleted_at: undefined },
                        ],
                    }),
            })
                .session(this.session)
                .skip(query.skip || 0)
                .limit(query.limit || 0)
                .select(query?.projections || [])
                .populate(query?.populate || [])
                .sort(sort);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async paginateV2(query) {
        const page = Number(query.page) - 1 || 0;
        const limit = Number(query.limit) || 20;
        const offset = page * limit;
        const sort = query.sort || 'createdAt';
        const archived = this.convertArchived(query.archived || false);
        const dbQuery = {
            ...query.conditions,
            ...(!archived
                ? { deleted_at: undefined }
                : { deleted_at: { $ne: undefined } }),
        };
        return Promise.all([
            this.count(dbQuery),
            new Promise((resolve, reject) => {
                this.model
                    .find(dbQuery)
                    .session(this.session)
                    .limit(limit)
                    .select(query.projections || [])
                    .populate(query.populate || [])
                    .skip(offset)
                    .sort(sort)
                    .then((result) => {
                    resolve({
                        page: {
                            current: page + 1,
                            prev: page > 0 ? page : null,
                            next: page <= result.length ? page + 2 : null,
                        },
                        limit,
                        sort,
                        data: result,
                    });
                })
                    .catch((err) => {
                    return reject(err);
                });
            }),
        ]).then(([count, result]) => ({
            ...result,
            data: result.data,
            limit: result.limit,
            sort: result.sort,
            total: count,
            pages: Math.ceil(count / limit),
            page: result.page,
            offset: page * limit,
        }));
    }
    async paginate(query) {
        const page = Number(query.page) - 1 || 0;
        const limit = Number(query.limit) || 20;
        const offset = page * limit;
        const sort = query.sort || 'createdAt';
        const archived = this.convertArchived(query.archived || false);
        const dbQuery = {
            ...query.conditions,
            ...(!archived
                ? { deleted_at: undefined }
                : { deleted_at: { $ne: undefined } }),
        };
        return Promise.all([
            this.count(dbQuery),
            new Promise((resolve, reject) => {
                this.model
                    .find(dbQuery)
                    .session(this.session)
                    .limit(limit)
                    .select(query.projections || [])
                    .populate(query.populate || [])
                    .skip(offset)
                    .sort(sort)
                    .then((result) => {
                    resolve({
                        page: {
                            current: page + 1,
                            prev: page > 0 ? page : null,
                            next: page < Math.ceil(result.length / limit) ? page + 2 : null,
                        },
                        limit,
                        sort,
                        data: result,
                    });
                })
                    .catch((err) => {
                    return reject(err);
                });
            }),
        ]).then(([count, result]) => ({
            ...result,
            data: result.data,
            limit: result.limit,
            sort: result.sort,
            total: count,
            pages: Math.ceil(count / limit),
            page: result.page,
            offset: page * limit,
        }));
    }
    async byQueryPromise(query, projections, archived, populate, sort = '-createdAt') {
        archived = this.convertArchived(archived);
        return new Promise((resolve, reject) => {
            this.model
                .findOne({
                ...query,
                ...(!archived
                    ? { deleted_at: undefined }
                    : { deleted_at: { $ne: undefined } }),
            })
                .session(this.session)
                .select(projections || [])
                .populate(populate || [])
                .sort(sort)
                .exec()
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                console.log('NEW ERRL', err);
                reject((0, exports.createRepoError)(`${this.name} not found`, 'ModelNotFoundError'));
            });
        });
    }
    async rawFetchQuery(query, projections, archived, populate, sort = '-createdAt') {
        archived = this.convertArchived(archived);
        return this.model
            .findOne({
            ...query,
            ...(!archived
                ? { deleted_at: undefined }
                : { deleted_at: { $ne: undefined } }),
        })
            .session(this.session)
            .select(projections || [])
            .populate(populate || [])
            .sort(sort);
    }
    async byQuery(query, projections, archived, populate, sort = '-createdAt') {
        archived = this.convertArchived(archived);
        return this.model
            .findOne({
            ...query,
            ...(!archived
                ? { deleted_at: undefined }
                : { deleted_at: { $ne: undefined } }),
        })
            .session(this.session)
            .select(projections || [])
            .populate(populate || [])
            .sort(sort)
            .exec()
            .then((result) => {
            if (!result) {
                return Promise.reject((0, exports.createRepoError)(`${this.name} not found`, 'ModelNotFoundError'));
            }
            else {
                return result;
            }
        });
    }
    async byQueryLean(query, projections, archived, populate, sort = '-createdAt') {
        archived = this.convertArchived(archived);
        return this.model
            .findOne({
            ...query,
            ...(!archived
                ? { deleted_at: undefined }
                : { deleted_at: { $ne: undefined } }),
        })
            .lean()
            .session(this.session)
            .select(projections || [])
            .populate(populate || [])
            .sort(sort)
            .exec()
            .then((result) => {
            if (!result) {
                return Promise.reject((0, exports.createRepoError)(`${this.name} not found`, 'ModelNotFoundError'));
            }
            else {
                return result;
            }
        });
    }
    count(query) {
        return new Promise((resolve, reject) => {
            this.model
                .countDocuments({
                ...query,
            })
                .session(this.session)
                .then((result) => resolve(result))
                .catch((err) => reject(err));
        });
    }
    distinct(field, query) {
        return new Promise((resolve, reject) => {
            this.model
                .distinct(field, {
                ...query,
            })
                .lean()
                .session(this.session)
                .then((result) => resolve(result))
                .catch((err) => reject(err));
        });
    }
    countDistinct(field, query) {
        return this.distinct(field, query).then((ids) => ids.length);
    }
    exists(query) {
        return this.model.exists(query).then((result) => !!result);
    }
    async update(condition, update) {
        const query = this.getQuery(condition);
        try {
            const doc = await this.model.findOne(query, null, {
                session: this.session,
                new: false,
            });
            doc.set(update);
            return await doc.save({ session: this.session });
        }
        catch (error) {
            console.log('ERROR', error);
            return Promise.reject((0, exports.createRepoError)(`${this.name} not found`, 'ModelNotFoundError'));
        }
    }
    async findAndUpdate(condition, update) {
        try {
            return await this.model.findOneAndUpdate(condition, update, {
                session: this.session,
                returnDocument: 'after',
            });
        }
        catch (error) {
            return Promise.reject((0, exports.createRepoError)(`${this.name} not found`, 'ModelNotFoundError'));
        }
    }
    async updateMany(condition, update) {
        const query = this.getQuery(condition);
        return this.model
            .updateMany(query, update, { session: this.session })
            .then(() => this.all({ conditions: query }));
    }
    async softDelete(condition) {
        const query = this.getQuery(condition);
        const currentDate = new Date();
        const oldDoc = (await this.byQuery(condition));
        oldDoc.deletedAt = currentDate;
        return this.model
            .findOneAndUpdate(query, { deleted_at: new Date() }, { new: true, session: this.session })
            .then((result) => {
            if (!result)
                return Promise.reject((0, exports.createRepoError)(`${this.name} not found`, 'ModelNotFoundError'));
            return oldDoc;
        });
    }
    async softDeleteMany(condition) {
        const query = this.getQuery(condition);
        const allDocs = await this.all({ conditions: query });
        const deletedAt = new Date();
        return this.model
            .updateMany(query, { deleted_at: deletedAt }, { new: true, session: this.session })
            .then(() => {
            return allDocs.map((doc) => {
                doc.deletedAt = deletedAt;
                return doc;
            });
        });
    }
    async delete(condition) {
        const query = this.getQuery(condition);
        const result = await this.model
            .findOneAndDelete(query, {})
            .session(this.session);
    }
    async deleteAndReturnRecord(condition) {
        const query = this.getQuery(condition);
        const result = await this.model
            .findOneAndDelete(query, {})
            .session(this.session);
        return result;
    }
    async deleteMany(condition) {
        const query = this.getQuery(condition);
        await this.model.deleteMany(query, { session: this.session });
    }
}
exports.EntityRepository = EntityRepository;
